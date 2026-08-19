/**
 * Storybook deployment protection for Vercel.
 *
 * Built Storybooks are static sites, so protection runs as **Vercel Edge Middleware**
 * (not Storybook config). Drop a `middleware.ts` next to the Vercel project root that
 * serves `storybook-static` and set the same env vars as the Next.js integration.
 *
 * @example middleware.ts
 * ```ts
 * import { withStorybookDeploymentProtection } from "@becklyn/deployment-protection/storybook";
 *
 * export default withStorybookDeploymentProtection();
 *
 * // Matcher must be a string literal in this file (Vercel/Next static analysis).
 * export const config = {
 *   matcher: [
 *     "/((?!.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?|mjs)$).*)",
 *   ],
 * };
 * ```
 *
 * Optional `vercel.json` for a Storybook-only project:
 * ```json
 * {
 *   "buildCommand": "npm run build-storybook",
 *   "outputDirectory": "storybook-static",
 *   "framework": null
 * }
 * ```
 */
export {
    middlewarePassThrough,
    withEdgeDeploymentProtection as withStorybookDeploymentProtection,
} from "./edge";
export type { DeploymentProtectionOptions } from "./types";
