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

function isOptions(value: unknown): value is DeploymentProtectionOptions {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value !== "function"
    );
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
        return redirectResponse;
    }

    const nextResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
    });
    copyHeaders(response, nextResponse, false);
    return nextResponse;
}

function copyHeaders(from: Response, to: NextResponse, skipLocation: boolean): void {
    const setCookies =
        typeof from.headers.getSetCookie === "function" ? from.headers.getSetCookie() : [];

    if (setCookies.length > 0) {
        for (const cookie of setCookies) {
            to.headers.append("Set-Cookie", cookie);
        }
    }

    from.headers.forEach((value, key) => {
        const lower = key.toLowerCase();

        if (lower === "set-cookie") {
            // Already copied via getSetCookie when available; fall back otherwise.
            if (setCookies.length === 0) {
                to.headers.append("Set-Cookie", value);
            }
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
