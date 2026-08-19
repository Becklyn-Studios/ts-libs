export type AuthMethod = "password" | "vercel" | "bypass";

export interface DeploymentProtectionConfig {
    enabled: boolean;
    username: string | null;
    password: string | null;
    secret: string | null;
    /**
     * Shared secret used to sign proxy start requests and verify handoff tokens.
     * Falls back to {@link secret} when unset.
     */
    handoffSecret: string | null;
    bypassSecret: string | null;
    /**
     * Base URL of the central auth-proxy app (e.g. https://dp-auth.example.com).
     * When set, protected apps no longer need per-host Vercel OAuth callback URLs.
     */
    authProxyUrl: string | null;
    /**
     * Optional allowlist for auth-proxy return origins (proxy side).
     * See README for entry formats.
     */
    allowedReturnOrigins: string[];
    vercelClientId: string | null;
    vercelClientSecret: string | null;
    sessionTtlSeconds: number;
    formTitle: string;
    formDescription: string;
}

export interface FormOptions {
    title?: string;
    description?: string;
}

export interface DeploymentProtectionOptions {
    /**
     * Optional env override (useful for tests).
     * Merged over `process.env`.
     */
    env?: Record<string, string | undefined>;
    /** Customize the built-in login form copy. */
    form?: FormOptions;
    /** Session lifetime in seconds (default 14 days). */
    sessionTtlSeconds?: number;
}

export interface SessionPayload {
    exp: number;
    method: AuthMethod;
    subject: string;
}

export type EnvMap = Record<string, string | undefined>;
