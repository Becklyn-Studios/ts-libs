import {
    base64UrlToBytes,
    bytesToBase64Url,
    hmacSign,
    randomToken,
    timingSafeEqualString,
} from "./crypto";
import { safeReturnTo } from "./safe-return-to";

export const HANDOFF_TTL_SECONDS = 60;
export const PROXY_START_TTL_SECONDS = 5 * 60;

export interface ProxyStartParams {
    returnOrigin: string;
    returnPath: string;
    exp: number;
    nonce: string;
}

export interface HandoffPayload {
    exp: number;
    aud: string;
    subject: string;
    method: "vercel";
}

function encodeJson(value: unknown): string {
    return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}

function decodeJson<T>(encoded: string): T | null {
    try {
        const json = new TextDecoder().decode(base64UrlToBytes(encoded));
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

/**
 * Canonical payload for HMAC over the proxy start request.
 * Field order is fixed so app and proxy produce the same signature.
 */
export function canonicalProxyStartPayload(params: ProxyStartParams): string {
    return `v1\n${params.returnOrigin}\n${params.returnPath}\n${params.exp}\n${params.nonce}`;
}

export async function signProxyStart(secret: string, params: ProxyStartParams): Promise<string> {
    return hmacSign(secret, canonicalProxyStartPayload(params));
}

export async function verifyProxyStartSignature(
    secret: string,
    params: ProxyStartParams,
    signature: string | null | undefined
): Promise<boolean> {
    if (!signature) {
        return false;
    }

    if (params.exp < Math.floor(Date.now() / 1000)) {
        return false;
    }

    const expected = await signProxyStart(secret, params);
    return timingSafeEqualString(signature, expected);
}

export async function buildProxyStartUrl(options: {
    authProxyUrl: string;
    secret: string;
    returnOrigin: string;
    returnPath: string;
    ttlSeconds?: number;
}): Promise<string> {
    const returnPath = safeReturnTo(options.returnPath);
    const params: ProxyStartParams = {
        returnOrigin: options.returnOrigin.replace(/\/$/, ""),
        returnPath,
        exp: Math.floor(Date.now() / 1000) + (options.ttlSeconds ?? PROXY_START_TTL_SECONDS),
        nonce: randomToken(16),
    };
    const sig = await signProxyStart(options.secret, params);
    const url = new URL("/start", ensureTrailingSlashBase(options.authProxyUrl));
    url.searchParams.set("return_origin", params.returnOrigin);
    url.searchParams.set("return_path", params.returnPath);
    url.searchParams.set("exp", String(params.exp));
    url.searchParams.set("nonce", params.nonce);
    url.searchParams.set("sig", sig);
    return url.toString();
}

function ensureTrailingSlashBase(value: string): string {
    try {
        const url = new URL(value);
        return url.toString().endsWith("/") ? url.toString() : `${url.toString()}/`;
    } catch {
        return value.endsWith("/") ? value : `${value}/`;
    }
}

export async function createHandoffToken(
    secret: string,
    audienceOrigin: string,
    subject: string,
    ttlSeconds = HANDOFF_TTL_SECONDS
): Promise<string> {
    const payload: HandoffPayload = {
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
        aud: audienceOrigin.replace(/\/$/, ""),
        subject,
        method: "vercel",
    };
    const body = encodeJson(payload);
    const signature = await hmacSign(secret, body);
    return `${body}.${signature}`;
}

export async function verifyHandoffToken(
    secret: string,
    token: string | null | undefined,
    expectedAudienceOrigin: string
): Promise<HandoffPayload | null> {
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

    const payload = decodeJson<HandoffPayload>(body);

    if (
        !payload ||
        typeof payload.exp !== "number" ||
        typeof payload.aud !== "string" ||
        typeof payload.subject !== "string" ||
        payload.method !== "vercel"
    ) {
        return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
    }

    const expectedAud = expectedAudienceOrigin.replace(/\/$/, "");

    if (!(await timingSafeEqualString(payload.aud, expectedAud))) {
        return null;
    }

    return payload;
}

/**
 * Validate a post-login return origin for the auth proxy.
 * Only https (and http://localhost / 127.0.0.1) are accepted.
 */
export function normalizeReturnOrigin(value: string | null | undefined): string | null {
    if (typeof value !== "string" || value.length === 0 || value.length > 512) {
        return null;
    }

    let url: URL;

    try {
        url = new URL(value);
    } catch {
        return null;
    }

    if (url.username || url.password) {
        return null;
    }

    const host = url.hostname.toLowerCase();
    const isLocalHttp =
        url.protocol === "http:" &&
        (host === "localhost" || host === "127.0.0.1" || host === "[::1]");

    if (url.protocol !== "https:" && !isLocalHttp) {
        return null;
    }

    // Origin only — reject unexpected path/query/hash noise by normalizing.
    return url.origin;
}

/**
 * Optional allowlist. Entries may be:
 * - full origins (`https://app.example.com`)
 * - hostname suffixes (`.vercel.app`, `example.com`)
 * - `localhost` (any localhost / 127.0.0.1 http(s) origin)
 *
 * Empty allowlist → any origin that passes {@link normalizeReturnOrigin}.
 */
export function isReturnOriginAllowed(origin: string, allowlist: string[]): boolean {
    if (allowlist.length === 0) {
        return true;
    }

    let url: URL;

    try {
        url = new URL(origin);
    } catch {
        return false;
    }

    const host = url.hostname.toLowerCase();

    for (const raw of allowlist) {
        const entry = raw.trim().toLowerCase();

        if (!entry) {
            continue;
        }

        if (entry === "localhost") {
            if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
                return true;
            }
            continue;
        }

        if (entry.startsWith("http://") || entry.startsWith("https://")) {
            try {
                if (new URL(entry).origin.toLowerCase() === origin.toLowerCase()) {
                    return true;
                }
            } catch {
                // ignore invalid allowlist entries
            }
            continue;
        }

        const suffix = entry.startsWith(".") ? entry : `.${entry}`;

        if (host === entry || host === entry.replace(/^\./, "") || host.endsWith(suffix)) {
            return true;
        }
    }

    return false;
}

export function parseAllowlist(value: string | null | undefined): string[] {
    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map(part => part.trim())
        .filter(Boolean);
}
