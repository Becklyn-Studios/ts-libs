import { type NextRequest, NextResponse } from "next/server";
import { deploymentProtectionMatcher } from "./constants";
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

/**
 * Next.js middleware / proxy wrapper.
 *
 * @example middleware.ts (Next ≤15)
 * ```ts
 * import {withDeploymentProtection, deploymentProtectionMatcher} from "@becklyn/deployment-protection";
 * export default withDeploymentProtection();
 * export const config = { matcher: deploymentProtectionMatcher };
 * ```
 *
 * @example proxy.ts (Next 16+)
 * ```ts
 * import {withDeploymentProtection, deploymentProtectionMatcher} from "@becklyn/deployment-protection";
 * export const proxy = withDeploymentProtection();
 * export const config = { matcher: deploymentProtectionMatcher };
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
            // Preserve NextResponse subclass when possible
            return new NextResponse(protectionResponse.body, {
                status: protectionResponse.status,
                statusText: protectionResponse.statusText,
                headers: protectionResponse.headers,
            });
        }

        if (next) {
            const result = await next(request, event);
            return result ?? NextResponse.next();
        }

        return NextResponse.next();
    };
}

export { deploymentProtectionMatcher };
