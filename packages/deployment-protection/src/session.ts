import { base64UrlToBytes, bytesToBase64Url, hmacSign, timingSafeEqualString } from "./crypto";
import type { AuthMethod, SessionPayload } from "./types";

function encodePayload(payload: SessionPayload): string {
    return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

function decodePayload(encoded: string): SessionPayload | null {
    try {
        const json = new TextDecoder().decode(base64UrlToBytes(encoded));
        const parsed = JSON.parse(json) as SessionPayload;

        if (
            typeof parsed.exp !== "number" ||
            typeof parsed.method !== "string" ||
            typeof parsed.subject !== "string"
        ) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

export async function createSessionToken(
    secret: string,
    method: AuthMethod,
    subject: string,
    ttlSeconds: number
): Promise<string> {
    const payload: SessionPayload = {
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
        method,
        subject,
    };
    const body = encodePayload(payload);
    const signature = await hmacSign(secret, body);
    return `${body}.${signature}`;
}

export async function verifySessionToken(
    secret: string,
    token: string | undefined | null
): Promise<SessionPayload | null> {
    if (!token) {
        return null;
    }

    const [body, signature] = token.split(".");

    if (!body || !signature) {
        return null;
    }

    const expected = await hmacSign(secret, body);

    if (!(await timingSafeEqualString(signature, expected))) {
        return null;
    }

    const payload = decodePayload(body);

    if (!payload) {
        return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
    }

    return payload;
}

export function sessionCookieOptions(maxAge: number, secure: boolean) {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure,
        path: "/",
        maxAge,
    };
}
