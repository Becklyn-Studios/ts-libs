import { isValidBypass, readBypassCookie, readBypassToken, shouldSetBypassCookie } from "./bypass";
import {
    hasPasswordAuth,
    hasVercelAuth,
    hasVercelDirectAuth,
    hasVercelProxyAuth,
    isProtectionActive,
    resolveConfig,
} from "./config";
import {
    BYPASS_COOKIE_NAME,
    BYPASS_HEADER,
    OAUTH_NONCE_COOKIE,
    OAUTH_RETURN_COOKIE,
    OAUTH_VERIFIER_COOKIE,
    SESSION_COOKIE_NAME,
    SET_BYPASS_COOKIE_HEADER,
    VERCEL_AUTHORIZE_PATH,
    VERCEL_CALLBACK_PATH,
} from "./constants";
import { timingSafeEqualString } from "./crypto";
import { buildProxyStartUrl, verifyHandoffToken } from "./handoff";
import { renderLoginPage } from "./login-page";
import { validatePasswordCredentials } from "./password";
import { safeReturnTo } from "./safe-return-to";
import { createSessionToken, sessionCookieOptions, verifySessionToken } from "./session";
import type { DeploymentProtectionConfig, DeploymentProtectionOptions } from "./types";
import {
    appendSetCookie,
    assertOAuthState,
    buildVercelAuthorizeRedirect,
    clearOAuthCookies,
    decodeIdTokenNonce,
    exchangeVercelCode,
    fetchVercelUserInfo,
    readCookie,
} from "./vercel-oauth";

function isSecureRequest(request: Request): boolean {
    return new URL(request.url).protocol === "https:";
}

function getPathname(request: Request): string {
    return new URL(request.url).pathname;
}

function htmlResponse(html: string, status = 401): Response {
    return new Response(html, {
        status,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });
}

function redirect(request: Request, location: string, status = 302): Response {
    // Next.js middleware/proxy requires an absolute Location; relative values throw ERR_INVALID_URL.
    const absoluteLocation = new URL(location, request.url).toString();
    return new Response(null, {
        status,
        headers: {
            Location: absoluteLocation,
            "Cache-Control": "no-store",
        },
    });
}

/**
 * Prefer the dedicated session secret; fall back to the automation bypass secret
 * so a query-param bypass can still persist `__becklyn_dp_session` when no
 * username/password or explicit HMAC secret is configured.
 */
function signingSecret(config: DeploymentProtectionConfig): string | null {
    return config.secret ?? config.bypassSecret;
}

async function attachSession(
    response: Response,
    config: DeploymentProtectionConfig,
    method: "password" | "vercel" | "bypass",
    subject: string,
    secure: boolean
): Promise<Response> {
    const secret = signingSecret(config);

    if (!secret) {
        return response;
    }

    const token = await createSessionToken(secret, method, subject, config.sessionTtlSeconds);
    const opts = sessionCookieOptions(config.sessionTtlSeconds, secure);
    appendSetCookie(response, SESSION_COOKIE_NAME, token, opts);
    return response;
}

type BypassResult = { kind: "miss" } | { kind: "allow" } | { kind: "respond"; response: Response };

async function handleBypass(
    request: Request,
    config: DeploymentProtectionConfig
): Promise<BypassResult> {
    if (!config.bypassSecret) {
        return { kind: "miss" };
    }

    const token = readBypassToken(request) ?? readBypassCookie(request);

    if (!(await isValidBypass(token, config.bypassSecret))) {
        return { kind: "miss" };
    }

    const setCookieMode = shouldSetBypassCookie(request);
    const url = new URL(request.url);
    const hadQueryBypass = url.searchParams.has(BYPASS_HEADER);
    const hadSetCookieQuery = url.searchParams.has(SET_BYPASS_COOKIE_HEADER);

    // Query-param bypass (and the Vercel set-cookie helper) persist auth, then
    // strip secrets from the URL. Header-only automation stays one-shot.
    if (hadQueryBypass || hadSetCookieQuery || setCookieMode) {
        url.searchParams.delete(BYPASS_HEADER);
        url.searchParams.delete(SET_BYPASS_COOKIE_HEADER);
        const response = redirect(request, url.pathname + url.search + url.hash);
        const secure = isSecureRequest(request);

        if (setCookieMode || hadSetCookieQuery) {
            appendSetCookie(response, BYPASS_COOKIE_NAME, config.bypassSecret, {
                httpOnly: true,
                secure,
                path: "/",
                maxAge: config.sessionTtlSeconds,
                sameSite: setCookieMode === "samesitenone" ? "none" : "lax",
            });
        }

        // Always persist a signed session when the bypass secret arrived via query.
        await attachSession(response, config, "bypass", "automation", secure);
        return { kind: "respond", response };
    }

    return { kind: "allow" };
}

async function handlePasswordPost(
    request: Request,
    config: DeploymentProtectionConfig
): Promise<Response | null> {
    if (request.method !== "POST" || !hasPasswordAuth(config)) {
        return null;
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (
        !contentType.includes("application/x-www-form-urlencoded") &&
        !contentType.includes("multipart/form-data")
    ) {
        return null;
    }

    let form: FormData;

    try {
        form = await request.formData();
    } catch {
        return null;
    }

    if (form.get("__becklyn_dp") !== "1") {
        return null;
    }

    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    const returnTo = safeReturnTo(String(form.get("return_to") ?? getPathname(request)));

    if (!(await validatePasswordCredentials(config, username, password))) {
        return htmlResponse(
            renderLoginPage(config, {
                error: "Invalid username or password.",
                returnTo,
                showPassword: true,
                showVercel: hasVercelAuth(config),
            })
        );
    }

    const response = redirect(request, returnTo);
    return attachSession(response, config, "password", username, isSecureRequest(request));
}

async function handleVercelAuthorize(
    request: Request,
    config: DeploymentProtectionConfig
): Promise<Response | null> {
    if (getPathname(request) !== VERCEL_AUTHORIZE_PATH) {
        return null;
    }

    if (!hasVercelAuth(config)) {
        return new Response("Sign in with Vercel is not configured", { status: 500 });
    }

    const returnTo = safeReturnTo(new URL(request.url).searchParams.get("return_to"));

    // Prefer central auth-proxy so apps never register per-host OAuth callbacks.
    if (hasVercelProxyAuth(config) && config.authProxyUrl && config.handoffSecret) {
        const startUrl = await buildProxyStartUrl({
            authProxyUrl: config.authProxyUrl,
            secret: config.handoffSecret,
            returnOrigin: new URL(request.url).origin,
            returnPath: returnTo,
        });
        return redirect(request, startUrl);
    }

    if (!hasVercelDirectAuth(config)) {
        return new Response("Sign in with Vercel is not configured", { status: 500 });
    }

    return buildVercelAuthorizeRedirect(request, config, returnTo);
}

async function handleVercelCallback(
    request: Request,
    config: DeploymentProtectionConfig
): Promise<Response | null> {
    if (getPathname(request) !== VERCEL_CALLBACK_PATH) {
        return null;
    }

    if (!hasVercelAuth(config) || !config.secret) {
        return new Response("Sign in with Vercel is not configured", { status: 500 });
    }

    const url = new URL(request.url);
    const handoff = url.searchParams.get("handoff");
    const secure = isSecureRequest(request);

    // Auth-proxy handoff: short-lived signed token, no Vercel client secret on the app.
    if (handoff) {
        if (!config.handoffSecret) {
            return new Response("Sign in with Vercel is not configured", { status: 500 });
        }

        const returnTo = safeReturnTo(url.searchParams.get("return_to"));
        const payload = await verifyHandoffToken(config.handoffSecret, handoff, url.origin);

        if (!payload) {
            return htmlResponse(
                renderLoginPage(config, {
                    error: "Vercel sign-in failed (invalid handoff).",
                    returnTo,
                    showPassword: hasPasswordAuth(config),
                    showVercel: true,
                })
            );
        }

        const response = redirect(request, returnTo);
        return attachSession(response, config, "vercel", payload.subject, secure);
    }

    // Legacy direct OAuth callback on the protected app.
    if (!hasVercelDirectAuth(config)) {
        return new Response("Sign in with Vercel is not configured", { status: 500 });
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const returnTo = safeReturnTo(readCookie(request, OAUTH_RETURN_COOKIE));

    if (!code || !(await assertOAuthState(request, state))) {
        const response = htmlResponse(
            renderLoginPage(config, {
                error: "Vercel sign-in failed (invalid state).",
                returnTo,
                showPassword: hasPasswordAuth(config),
                showVercel: true,
            })
        );
        clearOAuthCookies(response, secure);
        return response;
    }

    try {
        const codeVerifier = readCookie(request, OAUTH_VERIFIER_COOKIE);

        if (!codeVerifier) {
            throw new Error("Missing PKCE verifier");
        }

        const tokenData = await exchangeVercelCode(request, config, code, codeVerifier);
        const storedNonce = readCookie(request, OAUTH_NONCE_COOKIE);
        const tokenNonce = decodeIdTokenNonce(tokenData.id_token);

        if (storedNonce && tokenNonce && !(await timingSafeEqualString(storedNonce, tokenNonce))) {
            throw new Error("Nonce mismatch");
        }

        const user = await fetchVercelUserInfo(tokenData.access_token);
        const subject = user.preferred_username || user.email || user.sub || "vercel-user";
        const response = redirect(request, returnTo);
        clearOAuthCookies(response, secure);
        return attachSession(response, config, "vercel", subject, secure);
    } catch {
        const response = htmlResponse(
            renderLoginPage(config, {
                error: "Vercel sign-in failed.",
                returnTo,
                showPassword: hasPasswordAuth(config),
                showVercel: true,
            })
        );
        clearOAuthCookies(response, secure);
        return response;
    }
}

/**
 * Core request handler. Returns `null` when the request may continue to the app.
 */
export async function handleDeploymentProtection(
    request: Request,
    options: DeploymentProtectionOptions = {}
): Promise<Response | null> {
    const config = resolveConfig(options);

    if (!isProtectionActive(config)) {
        return null;
    }

    const vercelAuthorize = await handleVercelAuthorize(request, config);
    if (vercelAuthorize) {
        return vercelAuthorize;
    }

    const vercelCallback = await handleVercelCallback(request, config);
    if (vercelCallback) {
        return vercelCallback;
    }

    const passwordResponse = await handlePasswordPost(request, config);
    if (passwordResponse) {
        return passwordResponse;
    }

    const bypass = await handleBypass(request, config);
    if (bypass.kind === "respond") {
        return bypass.response;
    }
    if (bypass.kind === "allow") {
        return null;
    }

    const secret = signingSecret(config);

    if (secret) {
        const session = await verifySessionToken(secret, readCookie(request, SESSION_COOKIE_NAME));

        if (session) {
            return null;
        }
    }

    if (!hasPasswordAuth(config) && !hasVercelAuth(config)) {
        return new Response("Unauthorized", { status: 401 });
    }

    const returnTo = safeReturnTo(getPathname(request) + new URL(request.url).search);
    return htmlResponse(
        renderLoginPage(config, {
            returnTo,
            showPassword: hasPasswordAuth(config),
            showVercel: hasVercelAuth(config),
        })
    );
}
