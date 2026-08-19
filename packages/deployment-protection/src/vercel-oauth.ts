import {
    OAUTH_NONCE_COOKIE,
    OAUTH_RETURN_COOKIE,
    OAUTH_RETURN_ORIGIN_COOKIE,
    OAUTH_STATE_COOKIE,
    OAUTH_VERIFIER_COOKIE,
    VERCEL_CALLBACK_PATH,
} from "./constants";
import { randomToken, sha256Base64Url, timingSafeEqualString } from "./crypto";
import type { DeploymentProtectionConfig } from "./types";

export interface VercelTokenResponse {
    access_token: string;
    token_type: string;
    id_token?: string;
    expires_in: number;
    scope?: string;
    refresh_token?: string;
}

export interface VercelUserInfo {
    sub?: string;
    name?: string;
    email?: string;
    preferred_username?: string;
}

export interface VercelOAuthPathOptions {
    /**
     * Absolute path used as the OAuth redirect_uri path on the current origin.
     * Defaults to the protected-app callback path. Auth-proxy uses `/callback`.
     */
    callbackPath?: string;
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

function resolveCallbackPath(options?: VercelOAuthPathOptions): string {
    return options?.callbackPath ?? VERCEL_CALLBACK_PATH;
}

export async function buildVercelAuthorizeRedirect(
    request: Request,
    config: DeploymentProtectionConfig,
    returnTo: string,
    options?: VercelOAuthPathOptions
): Promise<Response> {
    if (!config.vercelClientId) {
        return new Response("Vercel OAuth is not configured", { status: 500 });
    }

    const state = randomToken(32);
    const nonce = randomToken(32);
    const codeVerifier = randomToken(48);
    const codeChallenge = await sha256Base64Url(codeVerifier);
    const origin = new URL(request.url).origin;
    const redirectUri = `${origin}${resolveCallbackPath(options)}`;
    const secure = origin.startsWith("https://");

    const params = new URLSearchParams({
        client_id: config.vercelClientId,
        redirect_uri: redirectUri,
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        response_type: "code",
        scope: "openid email profile",
    });

    const response = new Response(null, {
        status: 302,
        headers: {
            Location: `https://vercel.com/oauth/authorize?${params.toString()}`,
        },
    });

    const opts = cookieOptions(secure);
    appendSetCookie(response, OAUTH_STATE_COOKIE, state, opts);
    appendSetCookie(response, OAUTH_NONCE_COOKIE, nonce, opts);
    appendSetCookie(response, OAUTH_VERIFIER_COOKIE, codeVerifier, opts);
    appendSetCookie(response, OAUTH_RETURN_COOKIE, returnTo || "/", opts);

    return response;
}

export async function exchangeVercelCode(
    request: Request,
    config: DeploymentProtectionConfig,
    code: string,
    codeVerifier: string,
    options?: VercelOAuthPathOptions
): Promise<VercelTokenResponse> {
    if (!config.vercelClientId || !config.vercelClientSecret) {
        throw new Error("Vercel OAuth is not configured");
    }

    const origin = new URL(request.url).origin;
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.vercelClientId,
        client_secret: config.vercelClientSecret,
        code,
        code_verifier: codeVerifier,
        redirect_uri: `${origin}${resolveCallbackPath(options)}`,
    });

    const response = await fetch("https://api.vercel.com/login/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${errorText}`);
    }

    return (await response.json()) as VercelTokenResponse;
}

export async function fetchVercelUserInfo(accessToken: string): Promise<VercelUserInfo> {
    const response = await fetch("https://api.vercel.com/login/oauth/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load Vercel user info");
    }

    return (await response.json()) as VercelUserInfo;
}

export function readCookie(request: Request, name: string): string | null {
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
        return null;
    }

    for (const part of cookieHeader.split(";")) {
        const [rawName, ...rest] = part.trim().split("=");

        if (rawName === name) {
            return decodeURIComponent(rest.join("="));
        }
    }

    return null;
}

export async function assertOAuthState(request: Request, state: string | null): Promise<boolean> {
    const stored = readCookie(request, OAUTH_STATE_COOKIE);
    if (!state || !stored) {
        return false;
    }

    return timingSafeEqualString(state, stored);
}

export function decodeIdTokenNonce(idToken: string | undefined): string | null {
    if (!idToken) {
        return null;
    }

    const parts = idToken.split(".");
    const payload = parts[1];

    if (!payload) {
        return null;
    }

    try {
        const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padLength = (4 - (padded.length % 4)) % 4;
        const json = atob(padded + "=".repeat(padLength));
        const data = JSON.parse(json) as { nonce?: string };
        return data.nonce ?? null;
    } catch {
        return null;
    }
}

export function clearOAuthCookies(response: Response, secure: boolean): void {
    const expired = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure,
        path: "/",
        maxAge: 0,
    };

    for (const name of [
        OAUTH_STATE_COOKIE,
        OAUTH_NONCE_COOKIE,
        OAUTH_VERIFIER_COOKIE,
        OAUTH_RETURN_COOKIE,
        OAUTH_RETURN_ORIGIN_COOKIE,
    ]) {
        appendSetCookie(response, name, "", expired);
    }
}

export function appendSetCookie(
    response: Response,
    name: string,
    value: string,
    options: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "lax" | "strict" | "none";
        path?: string;
        maxAge?: number;
    }
): void {
    const parts = [`${name}=${encodeURIComponent(value)}`];

    if (options.maxAge !== undefined) {
        parts.push(`Max-Age=${options.maxAge}`);
    }

    parts.push(`Path=${options.path ?? "/"}`);

    if (options.httpOnly) {
        parts.push("HttpOnly");
    }

    if (options.secure) {
        parts.push("Secure");
    }

    if (options.sameSite) {
        parts.push(
            `SameSite=${options.sameSite === "none" ? "None" : options.sameSite[0]!.toUpperCase()}${options.sameSite.slice(1)}`
        );
    }

    response.headers.append("Set-Cookie", parts.join("; "));
}
