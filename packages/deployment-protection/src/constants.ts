export const SESSION_COOKIE_NAME = "__becklyn_dp_session";
export const BYPASS_COOKIE_NAME = "__becklyn_dp_bypass";
export const OAUTH_STATE_COOKIE = "__becklyn_dp_oauth_state";
export const OAUTH_NONCE_COOKIE = "__becklyn_dp_oauth_nonce";
export const OAUTH_VERIFIER_COOKIE = "__becklyn_dp_oauth_verifier";
export const OAUTH_RETURN_COOKIE = "__becklyn_dp_oauth_return";

export const INTERNAL_PATH_PREFIX = "/_becklyn/deployment-protection";
export const VERCEL_AUTHORIZE_PATH = `${INTERNAL_PATH_PREFIX}/vercel`;
export const VERCEL_CALLBACK_PATH = `${INTERNAL_PATH_PREFIX}/vercel/callback`;

export const BYPASS_HEADER = "x-vercel-protection-bypass";
export const SET_BYPASS_COOKIE_HEADER = "x-vercel-set-bypass-cookie";

export const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

/** Recommended Next.js matcher for full-site protection. */
export const deploymentProtectionMatcher = [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)",
];
