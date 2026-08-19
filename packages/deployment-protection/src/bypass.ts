import { BYPASS_COOKIE_NAME, BYPASS_HEADER, SET_BYPASS_COOKIE_HEADER } from "./constants";
import { timingSafeEqualString } from "./crypto";

export function readBypassToken(request: Request): string | null {
    const header = request.headers.get(BYPASS_HEADER)?.trim();

    if (header) {
        return header;
    }

    const url = new URL(request.url);
    const query = url.searchParams.get(BYPASS_HEADER)?.trim();

    if (query) {
        return query;
    }

    return null;
}

export function readBypassCookie(request: Request): string | null {
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
        return null;
    }

    for (const part of cookieHeader.split(";")) {
        const [rawName, ...rest] = part.trim().split("=");
        if (rawName === BYPASS_COOKIE_NAME) {
            return decodeURIComponent(rest.join("="));
        }
    }

    return null;
}

export async function isValidBypass(
    provided: string | null | undefined,
    secret: string | null
): Promise<boolean> {
    if (!provided || !secret) {
        return false;
    }

    return timingSafeEqualString(provided, secret);
}

export function shouldSetBypassCookie(request: Request): boolean | "samesitenone" {
    const url = new URL(request.url);
    const value =
        request.headers.get(SET_BYPASS_COOKIE_HEADER) ??
        url.searchParams.get(SET_BYPASS_COOKIE_HEADER);

    if (!value) {
        return false;
    }

    if (value.toLowerCase() === "samesitenone") {
        return "samesitenone";
    }

    return value === "true" || value === "1";
}
