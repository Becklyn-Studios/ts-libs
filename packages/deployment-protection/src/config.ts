import { parseAllowlist } from "./handoff";
import type { DeploymentProtectionConfig, DeploymentProtectionOptions, EnvMap } from "./types";

const FALSEY = new Set(["0", "false", "no", "off"]);

function read(env: EnvMap, ...keys: string[]): string | null {
    for (const key of keys) {
        const value = env[key]?.trim();

        if (value) {
            return value;
        }
    }

    return null;
}

function isEnabled(env: EnvMap): boolean {
    const raw = read(env, "DEPLOYMENT_PROTECTION_ENABLED");

    if (!raw) {
        return true;
    }

    return !FALSEY.has(raw.toLowerCase());
}

/**
 * Resolve runtime configuration from env (+ optional overrides).
 */
export function resolveConfig(
    options: DeploymentProtectionOptions = {}
): DeploymentProtectionConfig {
    const env: EnvMap = {
        ...(typeof process !== "undefined" ? process.env : {}),
        ...options.env,
    };

    const username = read(env, "DEPLOYMENT_PROTECTION_USERNAME");
    const password = read(env, "DEPLOYMENT_PROTECTION_PASSWORD");
    const explicitSecret = read(env, "DEPLOYMENT_PROTECTION_SECRET");

    // Prefer an explicit secret; otherwise derive a stable key from credentials so
    // projects can stay zero-config beyond username/password.
    const secret = explicitSecret ?? (username && password ? `dp:${username}:${password}` : null);
    const handoffSecret =
        read(env, "DEPLOYMENT_PROTECTION_HANDOFF_SECRET") ?? explicitSecret ?? secret;
    const authProxyUrl =
        read(env, "DEPLOYMENT_PROTECTION_AUTH_PROXY_URL")?.replace(/\/$/, "") ?? null;

    return {
        enabled: isEnabled(env),
        username,
        password,
        secret,
        handoffSecret,
        bypassSecret: read(
            env,
            "VERCEL_AUTOMATION_BYPASS_SECRET",
            "DEPLOYMENT_PROTECTION_BYPASS_SECRET"
        ),
        authProxyUrl,
        allowedReturnOrigins: parseAllowlist(
            read(
                env,
                "DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS",
                "DEPLOYMENT_PROTECTION_AUTH_PROXY_ALLOWED_ORIGINS"
            )
        ),
        vercelClientId: read(
            env,
            "DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID",
            "NEXT_PUBLIC_VERCEL_APP_CLIENT_ID",
            "VERCEL_APP_CLIENT_ID"
        ),
        vercelClientSecret: read(
            env,
            "DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET",
            "VERCEL_APP_CLIENT_SECRET"
        ),
        sessionTtlSeconds: options.sessionTtlSeconds ?? 60 * 60 * 24 * 14,
        formTitle:
            options.form?.title ??
            read(env, "DEPLOYMENT_PROTECTION_FORM_TITLE") ??
            "Authentication required",
        formDescription:
            options.form?.description ??
            read(env, "DEPLOYMENT_PROTECTION_FORM_DESCRIPTION") ??
            "Enter the shared credentials to continue.",
    };
}

export function hasPasswordAuth(config: DeploymentProtectionConfig): boolean {
    return Boolean(config.username && config.password && config.secret);
}

/** Direct Vercel OAuth on the protected app (legacy / single-project setup). */
export function hasVercelDirectAuth(config: DeploymentProtectionConfig): boolean {
    return Boolean(config.vercelClientId && config.vercelClientSecret && config.secret);
}

/**
 * Central auth-proxy mode: apps only need the proxy URL + shared handoff secret.
 * Vercel client credentials live solely on the proxy.
 */
export function hasVercelProxyAuth(config: DeploymentProtectionConfig): boolean {
    return Boolean(config.authProxyUrl && config.handoffSecret && config.secret);
}

export function hasVercelAuth(config: DeploymentProtectionConfig): boolean {
    return hasVercelDirectAuth(config) || hasVercelProxyAuth(config);
}

/**
 * Protection only runs when enabled and at least one auth method is configured.
 * Misconfigured+enabled is treated as inactive (fail-open) so local/dev isn't bricked.
 */
export function isProtectionActive(config: DeploymentProtectionConfig): boolean {
    return (
        config.enabled &&
        (hasPasswordAuth(config) || hasVercelAuth(config) || Boolean(config.bypassSecret))
    );
}
