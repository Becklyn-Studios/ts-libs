import { handleDeploymentProtection } from "./handler";
import type { DeploymentProtectionOptions } from "./types";

/**
 * Tell Vercel Edge Middleware to continue to the upstream / static asset.
 * Same signal as `NextResponse.next()` without depending on the Next.js runtime.
 */
export function middlewarePassThrough(): Response {
    return new Response(null, {
        status: 200,
        headers: {
            "x-middleware-next": "1",
        },
    });
}

/**
 * Framework-agnostic Vercel Edge Middleware factory (no Next.js runtime).
 *
 * Intended for static deployments such as Storybook `storybook-static` on Vercel.
 * Reuses the same env vars and auth behaviour as {@link withDeploymentProtection}.
 */
export function withEdgeDeploymentProtection(options: DeploymentProtectionOptions = {}) {
    return async function deploymentProtectionEdgeMiddleware(request: Request): Promise<Response> {
        const protectionResponse = await handleDeploymentProtection(request, options);

        if (protectionResponse) {
            return protectionResponse;
        }

        return middlewarePassThrough();
    };
}
