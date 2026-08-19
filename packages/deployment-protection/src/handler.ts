import { isValidBypass, readBypassCookie, readBypassToken, shouldSetBypassCookie } from "./bypass";
import { hasPasswordAuth, hasVercelAuth, isProtectionActive, resolveConfig } from "./config";
import {
    BYPASS_COOKIE_NAME,
    BYPASS_HEADER,
    OAUTH_NONCE_COOKIE,
    OAUTH_RETURN_COOKIE,
    OAUTH_VERIFIER_COOKIE,
    SESSION_COOKIE_NAME,
    VERCEL_AUTHORIZE_PATH,
    VERCEL_CALLBACK_PATH,
} from "./constants";
import { timingSafeEqualString } from "./crypto";
import { renderLoginPage } from "./login-page";
import { validatePasswordCredentials } from "./password";
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

function redirect(location: string, status = 302): Response {
    return new Response(null, {
        status,
        headers: {
            Location: location,
            "Cache-Control": "no-store",
        },
    });
}

function safeReturnTo(value: string | null | undefined, fallback = "/"): string {
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
        return fallback;
    }

    return value;
}

async function attachSession(
    response: Response,
    config: DeploymentProtectionConfig,
    method: "password" | "vercel" | "bypass",
    subject: string,
    secure: boolean
): Promise<Response> {
    if (!config.secret) {
        return response;
    }

    const token = await createSessionToken(
        config.secret,
        method,
        subject,
        config.sessionTtlSeconds
    );
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
    const hadSetCookieQuery = url.searchParams.has("x-vercel-set-bypass-cookie");

    if (hadQueryBypass || hadSetCookieQuery || setCookieMode) {
        url.searchParams.delete(BYPASS_HEADER);
        url.searchParams.delete("x-vercel-set-bypass-cookie");
        const response = redirect(url.pathname + url.search + url.hash);
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

    const response = redirect(returnTo);
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
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const secure = isSecureRequest(request);
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
        const response = redirect(returnTo);
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

    if (config.secret) {
        const session = await verifySessionToken(
            config.secret,
            readCookie(request, SESSION_COOKIE_NAME)
        );

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
