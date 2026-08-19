const textEncoder = new TextEncoder();

export function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array): string {
    const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let binary = "";

    for (const byte of view) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlToBytes(value: string): Uint8Array {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (padded.length % 4)) % 4;
    const base64 = padded + "=".repeat(padLength);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

export async function sha256Base64Url(value: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
    return bytesToBase64Url(digest);
}

export async function hmacSign(secret: string, payload: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        textEncoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payload));
    return bytesToBase64Url(signature);
}

export async function timingSafeEqualString(a: string, b: string): Promise<boolean> {
    const aBytes = textEncoder.encode(a);
    const bBytes = textEncoder.encode(b);

    if (aBytes.length !== bBytes.length) {
        // Compare against itself to keep runtime roughly constant on length mismatch.
        await crypto.subtle.digest("SHA-256", aBytes);
        return false;
    }

    let mismatch = 0;

    for (let i = 0; i < aBytes.length; i++) {
        mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
    }

    return mismatch === 0;
}

export function randomToken(byteLength = 32): string {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return bytesToBase64Url(bytes);
}
