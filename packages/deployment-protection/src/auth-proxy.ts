import { hasVercelDirectAuth, resolveConfig } from "./config";
import {
    OAUTH_NONCE_COOKIE,
    OAUTH_RETURN_COOKIE,
    OAUTH_RETURN_ORIGIN_COOKIE,
    OAUTH_VERIFIER_COOKIE,
    VERCEL_CALLBACK_PATH,
} from "./constants";
import { timingSafeEqualString } from "./crypto";
import {
    type ProxyStartParams,
    createHandoffToken,
    isReturnOriginAllowed,
    normalizeReturnOrigin,
    verifyProxyStartSignature,
} from "./handoff";
import { safeReturnTo } from "./safe-return-to";
import type { DeploymentProtectionOptions } from "./types";
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

/** Fixed OAuth callback path registered once on the Vercel OAuth app. */
export const AUTH_PROXY_CALLBACK_PATH = "/callback";
export const AUTH_PROXY_START_PATH = "/start";

function isSecureRequest(request: Request): boolean {
    return new URL(request.url).protocol === "https:";
}

function textResponse(message: string, status: number): Response {
    return new Response(message, {
        status,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });
}

function cookieOptions(secure: boolean) {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure,
        path: "/",
        maxAge: 10 * 60,
    };
}

/**
 * Auth-proxy entry: verify the signed start request from a protected app, then
 * begin Sign in with Vercel against this proxy's fixed callback URL.
 */
export async function handleAuthProxyStart(
    request: Request,
    options: DeploymentProtectionOptions = {}
): Promise<Response> {
    const config = resolveConfig(options);

    if (!hasVercelDirectAuth(config) || !config.handoffSecret) {
        return textResponse("Auth proxy is not configured", 500);
    }

    const url = new URL(request.url);
    const returnOrigin = normalizeReturnOrigin(url.searchParams.get("return_origin"));
    const returnPath = safeReturnTo(url.searchParams.get("return_path"));
    const expRaw = url.searchParams.get("exp");
    const nonce = url.searchParams.get("nonce");
    const sig = url.searchParams.get("sig");
    const exp = expRaw ? Number(expRaw) : NaN;

    if (!returnOrigin || !nonce || !Number.isFinite(exp)) {
        return textResponse("Invalid start request", 400);
    }

    if (!isReturnOriginAllowed(returnOrigin, config.allowedReturnOrigins)) {
        return textResponse("Return origin is not allowed", 403);
    }

    const params: ProxyStartParams = {
        returnOrigin,
        returnPath,
        exp,
        nonce,
    };

    if (!(await verifyProxyStartSignature(config.handoffSecret, params, sig))) {
        return textResponse("Invalid or expired start signature", 403);
    }

    const response = await buildVercelAuthorizeRedirect(request, config, returnPath, {
        callbackPath: AUTH_PROXY_CALLBACK_PATH,
    });
    const secure = isSecureRequest(request);
    appendSetCookie(response, OAUTH_RETURN_ORIGIN_COOKIE, returnOrigin, cookieOptions(secure));
    return response;
}

/**
 * Auth-proxy Vercel OAuth callback: exchange the code, mint a short-lived handoff
 * token, and redirect back to the protected app callback.
 */
export async function handleAuthProxyCallback(
    request: Request,
    options: DeploymentProtectionOptions = {}
): Promise<Response> {
    const config = resolveConfig(options);

    if (!hasVercelDirectAuth(config) || !config.handoffSecret) {
        return textResponse("Auth proxy is not configured", 500);
    }

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const secure = isSecureRequest(request);
    const returnOrigin = normalizeReturnOrigin(readCookie(request, OAUTH_RETURN_ORIGIN_COOKIE));
    const returnPath = safeReturnTo(readCookie(request, OAUTH_RETURN_COOKIE));

    const fail = (message: string, status = 401): Response => {
        const response = textResponse(message, status);
        clearOAuthCookies(response, secure);
        return response;
    };

    if (!returnOrigin) {
        return fail("Missing return origin", 400);
    }

    if (!isReturnOriginAllowed(returnOrigin, config.allowedReturnOrigins)) {
        return fail("Return origin is not allowed", 403);
    }

    if (!code || !(await assertOAuthState(request, state))) {
        return fail("Vercel sign-in failed (invalid state)");
    }

    try {
        const codeVerifier = readCookie(request, OAUTH_VERIFIER_COOKIE);

        if (!codeVerifier) {
            throw new Error("Missing PKCE verifier");
        }

        const tokenData = await exchangeVercelCode(request, config, code, codeVerifier, {
            callbackPath: AUTH_PROXY_CALLBACK_PATH,
        });
        const storedNonce = readCookie(request, OAUTH_NONCE_COOKIE);
        const tokenNonce = decodeIdTokenNonce(tokenData.id_token);

        if (storedNonce && tokenNonce && !(await timingSafeEqualString(storedNonce, tokenNonce))) {
            throw new Error("Nonce mismatch");
        }

        const user = await fetchVercelUserInfo(tokenData.access_token);
        const subject = user.preferred_username || user.email || user.sub || "vercel-user";
        const handoff = await createHandoffToken(config.handoffSecret, returnOrigin, subject);

        const target = new URL(VERCEL_CALLBACK_PATH, `${returnOrigin}/`);
        target.searchParams.set("handoff", handoff);
        target.searchParams.set("return_to", returnPath);

        const response = new Response(null, {
            status: 302,
            headers: {
                Location: target.toString(),
                "Cache-Control": "no-store",
            },
        });
        clearOAuthCookies(response, secure);
        return response;
    } catch {
        return fail("Vercel sign-in failed");
    }
}
