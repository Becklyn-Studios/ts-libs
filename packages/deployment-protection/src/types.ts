export type AuthMethod = "password" | "vercel" | "bypass";

export interface DeploymentProtectionConfig {
    enabled: boolean;
    username: string | null;
    password: string | null;
    secret: string | null;
    bypassSecret: string | null;
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
