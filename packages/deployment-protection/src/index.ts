export { INTERNAL_PATH_PREFIX, VERCEL_AUTHORIZE_PATH, VERCEL_CALLBACK_PATH } from "./constants";
export { handleDeploymentProtection } from "./handler";
export { withDeploymentProtection } from "./middleware";
export { resolveConfig, hasPasswordAuth, hasVercelAuth, isProtectionActive } from "./config";
export type {
    AuthMethod,
    DeploymentProtectionConfig,
    DeploymentProtectionOptions,
    FormOptions,
    SessionPayload,
} from "./types";
