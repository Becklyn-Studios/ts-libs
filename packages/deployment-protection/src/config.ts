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

function assignDefined(target: EnvMap, key: string, value: string | undefined): void {
    if (value !== undefined) {
        target[key] = value;
    }
}

/**
 * Next.js middleware / Edge only inlines statically analyzable `process.env.NAME` access.
 * Spreading `process.env` is often `{}` there, so a runtime
 * `VERCEL_AUTOMATION_BYPASS_SECRET` could activate the gate while the kill switch is invisible.
 */
function readProcessEnv(): EnvMap {
    if (typeof process === "undefined") {
        return {};
    }

    const env: EnvMap = { ...process.env };

    assignDefined(env, "DEPLOYMENT_PROTECTION_ENABLED", process.env.DEPLOYMENT_PROTECTION_ENABLED);
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_USERNAME",
        process.env.DEPLOYMENT_PROTECTION_USERNAME
    );
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_PASSWORD",
        process.env.DEPLOYMENT_PROTECTION_PASSWORD
    );
    assignDefined(env, "DEPLOYMENT_PROTECTION_SECRET", process.env.DEPLOYMENT_PROTECTION_SECRET);
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_HANDOFF_SECRET",
        process.env.DEPLOYMENT_PROTECTION_HANDOFF_SECRET
    );
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_AUTH_PROXY_URL",
        process.env.DEPLOYMENT_PROTECTION_AUTH_PROXY_URL
    );
    assignDefined(
        env,
        "VERCEL_AUTOMATION_BYPASS_SECRET",
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    );
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_BYPASS_SECRET",
        process.env.DEPLOYMENT_PROTECTION_BYPASS_SECRET
    );
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS",
        process.env.DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS
    );
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_AUTH_PROXY_ALLOWED_ORIGINS",
        process.env.DEPLOYMENT_PROTECTION_AUTH_PROXY_ALLOWED_ORIGINS
    );
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID",
        process.env.DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID
    );
    assignDefined(
        env,
        "NEXT_PUBLIC_VERCEL_APP_CLIENT_ID",
        process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID
    );
    assignDefined(env, "VERCEL_APP_CLIENT_ID", process.env.VERCEL_APP_CLIENT_ID);
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET",
        process.env.DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET
    );
    assignDefined(env, "VERCEL_APP_CLIENT_SECRET", process.env.VERCEL_APP_CLIENT_SECRET);
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_FORM_TITLE",
        process.env.DEPLOYMENT_PROTECTION_FORM_TITLE
    );
    assignDefined(
        env,
        "DEPLOYMENT_PROTECTION_FORM_DESCRIPTION",
        process.env.DEPLOYMENT_PROTECTION_FORM_DESCRIPTION
    );

    return env;
}

/**
 * Resolve runtime configuration from env (+ optional overrides).
 */
export function resolveConfig(
    options: DeploymentProtectionOptions = {}
): DeploymentProtectionConfig {
    const env: EnvMap = {
        ...readProcessEnv(),
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
 *
 * `DEPLOYMENT_PROTECTION_ENABLED=false` always wins, including when
 * `VERCEL_AUTOMATION_BYPASS_SECRET` is set (Vercel injects that on most projects).
 */
export function isProtectionActive(config: DeploymentProtectionConfig): boolean {
    if (!config.enabled) {
        return false;
    }

    return hasPasswordAuth(config) || hasVercelAuth(config) || Boolean(config.bypassSecret);
}
