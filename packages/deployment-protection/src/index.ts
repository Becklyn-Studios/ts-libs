export { INTERNAL_PATH_PREFIX, VERCEL_AUTHORIZE_PATH, VERCEL_CALLBACK_PATH } from "./constants";
export {
    AUTH_PROXY_CALLBACK_PATH,
    AUTH_PROXY_START_PATH,
    handleAuthProxyCallback,
    handleAuthProxyStart,
} from "./auth-proxy";
export { handleDeploymentProtection } from "./handler";
export { withDeploymentProtection } from "./middleware";
export { middlewarePassThrough, withEdgeDeploymentProtection } from "./edge";
export {
    resolveConfig,
    hasPasswordAuth,
    hasVercelAuth,
    hasVercelDirectAuth,
    hasVercelProxyAuth,
    isProtectionActive,
} from "./config";
export type {
    AuthMethod,
    DeploymentProtectionConfig,
    DeploymentProtectionOptions,
    FormOptions,
    SessionPayload,
} from "./types";
