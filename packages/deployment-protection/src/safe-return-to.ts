function hasUnsafeCharacters(value: string): boolean {
    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);

        // Control chars, DEL, and any Unicode whitespace (incl. regular space).
        if (code <= 0x1f || code === 0x7f || /\s/.test(value[i]!)) {
            return true;
        }
    }

    return false;
}

/**
 * Sanitize a post-login redirect target so it can never leave the current origin.
 *
 * Browsers treat `\` like `/` in URL resolution, so values such as `/\evil.com`
 * must be rejected in addition to classic `//evil.com` protocol-relative URLs.
 */
export function safeReturnTo(value: string | null | undefined, fallback = "/"): string {
    if (typeof value !== "string" || value.length === 0 || value.length > 2048) {
        return fallback;
    }

    // Fast reject before any decoding / URL parsing.
    if (
        !value.startsWith("/") ||
        value.startsWith("//") ||
        value.includes("\\") ||
        hasUnsafeCharacters(value) ||
        /%5c/i.test(value) || // encoded backslash
        /%00/i.test(value)
    ) {
        return fallback;
    }

    let decoded: string;

    try {
        // Decode once to catch encoded protocol-relative / backslash payloads.
        decoded = decodeURIComponent(value);
    } catch {
        return fallback;
    }

    if (
        !decoded.startsWith("/") ||
        decoded.startsWith("//") ||
        decoded.includes("\\") ||
        hasUnsafeCharacters(decoded)
    ) {
        return fallback;
    }

    try {
        const base = "https://safe.invalid";
        // URL parser normalizes `\` → `/`; reject if that escapes our origin.
        const url = new URL(decoded, base);

        if (url.origin !== base || url.username || url.password) {
            return fallback;
        }

        const sanitized = `${url.pathname}${url.search}${url.hash}`;
        return sanitized.startsWith("/") && !sanitized.startsWith("//") ? sanitized : fallback;
    } catch {
        return fallback;
    }
}
