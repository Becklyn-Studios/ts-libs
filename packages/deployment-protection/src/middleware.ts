import { type NextRequest, NextResponse } from "next/server";
import { handleDeploymentProtection } from "./handler";
import type { DeploymentProtectionOptions } from "./types";

type NextMiddleware = (
    request: NextRequest,
    event?: unknown
) =>
    | Response
    | NextResponse
    | Promise<Response | NextResponse | undefined | void>
    | undefined
    | void;

export type WithDeploymentProtectionArgs =
    | []
    | [DeploymentProtectionOptions]
    | [NextMiddleware]
    | [NextMiddleware, DeploymentProtectionOptions];

type CookieSameSite = "lax" | "strict" | "none";

interface ParsedSetCookie {
    name: string;
    value: string;
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    maxAge?: number;
    sameSite?: CookieSameSite;
}

function isOptions(value: unknown): value is DeploymentProtectionOptions {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value !== "function"
    );
}

function decodeCookieValue(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function parseSetCookie(header: string): ParsedSetCookie | null {
    const parts = header
        .split(";")
        .map(part => part.trim())
        .filter(Boolean);
    const first = parts.shift();

    if (!first) {
        return null;
    }

    const separator = first.indexOf("=");

    if (separator <= 0) {
        return null;
    }

    const parsed: ParsedSetCookie = {
        name: first.slice(0, separator),
        value: decodeCookieValue(first.slice(separator + 1)),
    };

    for (const part of parts) {
        const [rawKey, ...rest] = part.split("=");
        const key = rawKey?.toLowerCase();
        const attrValue = rest.join("=");

        if (key === "httponly") {
            parsed.httpOnly = true;
        } else if (key === "secure") {
            parsed.secure = true;
        } else if (key === "path") {
            parsed.path = attrValue;
        } else if (key === "max-age") {
            const maxAge = Number(attrValue);

            if (!Number.isNaN(maxAge)) {
                parsed.maxAge = maxAge;
            }
        } else if (key === "samesite") {
            const sameSite = attrValue.toLowerCase();

            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
                parsed.sameSite = sameSite;
            }
        }
    }

    return parsed;
}

function readSetCookieHeaders(headers: Headers): string[] {
    if (typeof headers.getSetCookie === "function") {
        const cookies = headers.getSetCookie();

        if (cookies.length > 0) {
            return cookies;
        }
    }

    const single = headers.get("set-cookie");
    return single ? [single] : [];
}

/**
 * Next.js middleware only reliably applies cookies set via `NextResponse.cookies`.
 * Copying raw `Set-Cookie` headers onto a redirect is ignored by the runtime.
 */
function applyCookies(from: Response, to: NextResponse): void {
    for (const header of readSetCookieHeaders(from.headers)) {
        const cookie = parseSetCookie(header);

        if (!cookie) {
            continue;
        }

        to.cookies.set(cookie.name, cookie.value, {
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            path: cookie.path,
            maxAge: cookie.maxAge,
            sameSite: cookie.sameSite,
        });
    }
}

function toNextResponse(request: NextRequest, response: Response): NextResponse {
    const location = response.headers.get("Location");

    if (location && response.status >= 300 && response.status < 400) {
        // Always resolve against the incoming request so relative Locations never reach Next.
        const redirectResponse = NextResponse.redirect(
            new URL(location, request.url),
            response.status
        );

        copyHeaders(response, redirectResponse, /* skipLocation */ true);
        applyCookies(response, redirectResponse);
        return redirectResponse;
    }

    const nextResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
    });
    copyHeaders(response, nextResponse, false);
    applyCookies(response, nextResponse);
    return nextResponse;
}

function copyHeaders(from: Response, to: NextResponse, skipLocation: boolean): void {
    from.headers.forEach((value, key) => {
        const lower = key.toLowerCase();

        if (lower === "set-cookie") {
            // Applied via NextResponse.cookies so the middleware runtime honors them.
            return;
        }

        if (skipLocation && lower === "location") {
            return;
        }

        to.headers.set(key, value);
    });
}

/**
 * Next.js middleware / proxy wrapper.
 *
 * Next.js only accepts a statically analyzable `config.matcher` in the local
 * middleware/proxy file. Do not import a matcher from this package — paste the
 * recommended pattern inline (see README).
 *
 * @example middleware.ts (Next ≤15)
 * ```ts
 * import {withDeploymentProtection} from "@becklyn/deployment-protection";
 * export default withDeploymentProtection();
 * export const config = {
 *   matcher: [
 *     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)",
 *   ],
 * };
 * ```
 *
 * @example proxy.ts (Next 16+)
 * ```ts
 * import {withDeploymentProtection} from "@becklyn/deployment-protection";
 * export const proxy = withDeploymentProtection();
 * export const config = {
 *   matcher: [
 *     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)",
 *   ],
 * };
 * ```
 */
export function withDeploymentProtection(...args: WithDeploymentProtectionArgs) {
    let next: NextMiddleware | undefined;
    let options: DeploymentProtectionOptions = {};

    if (args.length === 1) {
        if (typeof args[0] === "function") {
            next = args[0];
        } else if (isOptions(args[0])) {
            options = args[0];
        }
    } else if (args.length === 2) {
        next = args[0];
        options = args[1] ?? {};
    }

    return async function deploymentProtectionMiddleware(
        request: NextRequest,
        event?: unknown
    ): Promise<Response | NextResponse> {
        const protectionResponse = await handleDeploymentProtection(request, options);

        if (protectionResponse) {
            return toNextResponse(request, protectionResponse);
        }

        if (next) {
            const result = await next(request, event);
            return result ?? NextResponse.next();
        }

        return NextResponse.next();
    };
}
