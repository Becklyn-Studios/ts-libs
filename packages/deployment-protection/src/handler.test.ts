import { describe, expect, it } from "vitest";
import { hasPasswordAuth, hasVercelAuth, isProtectionActive, resolveConfig } from "./config";
import { BYPASS_HEADER, SESSION_COOKIE_NAME } from "./constants";
import { timingSafeEqualString } from "./crypto";
import { handleDeploymentProtection } from "./handler";
import { createSessionToken, verifySessionToken } from "./session";

const baseEnv = {
    DEPLOYMENT_PROTECTION_USERNAME: "preview",
    DEPLOYMENT_PROTECTION_PASSWORD: "s3cret",
    DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
};

describe("resolveConfig", () => {
    it("is enabled by default", () => {
        const config = resolveConfig({ env: baseEnv });
        expect(config.enabled).toBe(true);
        expect(isProtectionActive(config)).toBe(true);
        expect(hasPasswordAuth(config)).toBe(true);
    });

    it("can be disabled via env", () => {
        const config = resolveConfig({
            env: {
                ...baseEnv,
                DEPLOYMENT_PROTECTION_ENABLED: "false",
            },
        });
        expect(config.enabled).toBe(false);
        expect(isProtectionActive(config)).toBe(false);
    });

    it("detects vercel oauth config", () => {
        const config = resolveConfig({
            env: {
                DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
                DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID: "client",
                DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET: "secret",
            },
        });
        expect(hasVercelAuth(config)).toBe(true);
        expect(hasPasswordAuth(config)).toBe(false);
    });
});

describe("session tokens", () => {
    it("round-trips a signed session", async () => {
        const token = await createSessionToken("secret", "password", "preview", 60);
        const payload = await verifySessionToken("secret", token);
        expect(payload?.subject).toBe("preview");
        expect(payload?.method).toBe("password");
    });

    it("rejects tampered tokens", async () => {
        const token = await createSessionToken("secret", "password", "preview", 60);
        const tampered = token.replace(/\./, ".x");
        expect(await verifySessionToken("secret", tampered)).toBeNull();
    });
});

describe("timingSafeEqualString", () => {
    it("compares equal strings", async () => {
        expect(await timingSafeEqualString("abc", "abc")).toBe(true);
        expect(await timingSafeEqualString("abc", "abd")).toBe(false);
        expect(await timingSafeEqualString("abc", "ab")).toBe(false);
    });
});

describe("handleDeploymentProtection", () => {
    it("allows traffic when disabled", async () => {
        const response = await handleDeploymentProtection(new Request("https://example.com/"), {
            env: {
                ...baseEnv,
                DEPLOYMENT_PROTECTION_ENABLED: "0",
            },
        });
        expect(response).toBeNull();
    });

    it("returns a login page when unauthenticated", async () => {
        const response = await handleDeploymentProtection(
            new Request("https://example.com/dashboard"),
            { env: baseEnv }
        );
        expect(response).not.toBeNull();
        expect(response!.status).toBe(401);
        const html = await response!.text();
        expect(html).toContain("Authentication required");
        expect(html).toContain('name="username"');
    });

    it("accepts valid password credentials", async () => {
        const body = new URLSearchParams({
            __becklyn_dp: "1",
            username: "preview",
            password: "s3cret",
            return_to: "/dashboard",
        });

        const response = await handleDeploymentProtection(
            new Request("https://example.com/dashboard", {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                body,
            }),
            { env: baseEnv }
        );

        expect(response).not.toBeNull();
        expect(response!.status).toBe(302);
        expect(response!.headers.get("Location")).toBe("/dashboard");
        expect(response!.headers.get("Set-Cookie")).toContain(SESSION_COOKIE_NAME);
    });

    it("rejects invalid password credentials", async () => {
        const body = new URLSearchParams({
            __becklyn_dp: "1",
            username: "preview",
            password: "wrong",
            return_to: "/",
        });

        const response = await handleDeploymentProtection(
            new Request("https://example.com/", {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                body,
            }),
            { env: baseEnv }
        );

        expect(response).not.toBeNull();
        expect(response!.status).toBe(401);
        expect(await response!.text()).toContain("Invalid username or password");
    });

    it("allows a valid session cookie", async () => {
        const token = await createSessionToken(
            baseEnv.DEPLOYMENT_PROTECTION_SECRET,
            "password",
            "preview",
            60
        );
        const response = await handleDeploymentProtection(
            new Request("https://example.com/private", {
                headers: {
                    cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
                },
            }),
            { env: baseEnv }
        );
        expect(response).toBeNull();
    });

    it("bypasses with the automation secret header", async () => {
        const response = await handleDeploymentProtection(
            new Request("https://example.com/api/health", {
                headers: {
                    [BYPASS_HEADER]: "bypass-secret",
                },
            }),
            {
                env: {
                    ...baseEnv,
                    VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
                },
            }
        );
        expect(response).toBeNull();
    });

    it("bypasses with the automation secret query param and sets session", async () => {
        const response = await handleDeploymentProtection(
            new Request(
                "https://example.com/page?x-vercel-protection-bypass=bypass-secret&x-vercel-set-bypass-cookie=true"
            ),
            {
                env: {
                    ...baseEnv,
                    VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
                },
            }
        );
        expect(response).not.toBeNull();
        expect(response!.status).toBe(302);
        expect(response!.headers.get("Location")).toBe("/page");
        const cookies = response!.headers.getSetCookie?.() ?? [
            response!.headers.get("Set-Cookie") ?? "",
        ];
        expect(cookies.join("\n")).toContain(SESSION_COOKIE_NAME);
    });

    it("shows Sign in with Vercel when configured", async () => {
        const response = await handleDeploymentProtection(new Request("https://example.com/"), {
            env: {
                ...baseEnv,
                DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID: "client",
                DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET: "secret",
            },
        });
        expect(response).not.toBeNull();
        expect(await response!.text()).toContain("Sign in with Vercel");
    });
});
