import { describe, expect, it } from "vitest";
import { hasPasswordAuth, hasVercelAuth, isProtectionActive, resolveConfig } from "./config";
import { BYPASS_COOKIE_NAME, BYPASS_HEADER, SESSION_COOKIE_NAME } from "./constants";
import { timingSafeEqualString } from "./crypto";
import { handleDeploymentProtection } from "./handler";
import { createSessionToken, sessionCookieOptions, verifySessionToken } from "./session";
import { appendSetCookie } from "./vercel-oauth";

const baseEnv = {
    DEPLOYMENT_PROTECTION_USERNAME: "preview",
    DEPLOYMENT_PROTECTION_PASSWORD: "s3cret",
    DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
};

function setCookieHeader(response: Response): string {
    const cookies = response.headers.getSetCookie?.() ?? [response.headers.get("Set-Cookie") ?? ""];
    return cookies.join("\n");
}

function namedSetCookie(response: Response, name: string): string {
    const cookies = response.headers.getSetCookie?.() ?? [response.headers.get("Set-Cookie") ?? ""];
    return cookies.find(cookie => cookie.startsWith(`${name}=`)) ?? "";
}

function cookieHeaderFromResponse(response: Response, name: string): string | null {
    const cookies = response.headers.getSetCookie?.() ?? [response.headers.get("Set-Cookie") ?? ""];

    for (const cookie of cookies) {
        const [pair] = cookie.split(";");

        if (!pair?.startsWith(`${name}=`)) {
            continue;
        }

        return `${name}=${pair.slice(name.length + 1)}`;
    }

    return null;
}

function expectSameSiteNone(cookie: string) {
    expect(cookie).toMatch(/;\s*SameSite=None(?:;|$)/);
}

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

    it("lets the kill switch win over the automation bypass secret", () => {
        const config = resolveConfig({
            env: {
                VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
                DEPLOYMENT_PROTECTION_ENABLED: "false",
            },
        });
        expect(config.enabled).toBe(false);
        expect(config.bypassSecret).toBe("bypass-secret");
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

    it("uses SameSite=None; Secure on HTTPS and Lax on HTTP", () => {
        expect(sessionCookieOptions(60, true)).toEqual({
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
            maxAge: 60,
        });
        expect(sessionCookieOptions(60, false)).toEqual({
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            maxAge: 60,
        });
    });
});

describe("appendSetCookie", () => {
    it("serializes SameSite=None without a trailing suffix", () => {
        const response = new Response(null);
        appendSetCookie(response, "test", "value", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        expect(response.headers.get("Set-Cookie")).toBe(
            "test=value; Path=/; HttpOnly; Secure; SameSite=None"
        );
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

    it("does not enforce bypass when the kill switch is off", async () => {
        const env = {
            VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
            DEPLOYMENT_PROTECTION_ENABLED: "false",
        };

        const anonymous = await handleDeploymentProtection(new Request("https://example.com/"), {
            env,
        });
        expect(anonymous).toBeNull();

        const withHeader = await handleDeploymentProtection(
            new Request("https://example.com/api/health", {
                headers: {
                    [BYPASS_HEADER]: "bypass-secret",
                },
            }),
            { env }
        );
        expect(withHeader).toBeNull();

        const withQuery = await handleDeploymentProtection(
            new Request("https://example.com/?x-vercel-protection-bypass=bypass-secret"),
            { env }
        );
        expect(withQuery).toBeNull();
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
        expect(response!.headers.get("Location")).toBe("https://example.com/dashboard");
        expect(response!.headers.get("Set-Cookie")).toContain(SESSION_COOKIE_NAME);
        expectSameSiteNone(namedSetCookie(response!, SESSION_COOKIE_NAME));
        expect(namedSetCookie(response!, SESSION_COOKIE_NAME)).toContain("Secure");
    });

    it("sets the session cookie as SameSite=Lax on HTTP", async () => {
        const body = new URLSearchParams({
            __becklyn_dp: "1",
            username: "preview",
            password: "s3cret",
            return_to: "/",
        });

        const response = await handleDeploymentProtection(
            new Request("http://localhost:3000/", {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                body,
            }),
            { env: baseEnv }
        );

        expect(response).not.toBeNull();
        expect(namedSetCookie(response!, SESSION_COOKIE_NAME)).toMatch(/;\s*SameSite=Lax(?:;|$)/);
        expect(namedSetCookie(response!, SESSION_COOKIE_NAME)).not.toMatch(/SameSite=None/);
    });

    it("does not open-redirect on malicious return_to after login", async () => {
        const body = new URLSearchParams({
            __becklyn_dp: "1",
            username: "preview",
            password: "s3cret",
            return_to: "/\\\\evil.com",
        });

        const response = await handleDeploymentProtection(
            new Request("https://example.com/login", {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                body,
            }),
            { env: baseEnv }
        );

        expect(response).not.toBeNull();
        expect(response!.status).toBe(302);
        expect(response!.headers.get("Location")).toBe("https://example.com/");
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

    it("sets a session cookie when the automation secret is in the query", async () => {
        const env = {
            ...baseEnv,
            VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
        };
        const response = await handleDeploymentProtection(
            new Request("https://example.com/page?x-vercel-protection-bypass=bypass-secret&keep=1"),
            { env }
        );

        expect(response).not.toBeNull();
        expect(response!.status).toBe(302);
        expect(response!.headers.get("Location")).toBe("https://example.com/page?keep=1");
        expect(setCookieHeader(response!)).toContain(SESSION_COOKIE_NAME);
        expect(setCookieHeader(response!)).not.toContain(BYPASS_COOKIE_NAME);
        expectSameSiteNone(namedSetCookie(response!, SESSION_COOKIE_NAME));

        const sessionCookie = cookieHeaderFromResponse(response!, SESSION_COOKIE_NAME);
        expect(sessionCookie).toBeTruthy();

        const followUp = await handleDeploymentProtection(
            new Request("https://example.com/page?keep=1", {
                headers: { cookie: sessionCookie! },
            }),
            { env }
        );
        expect(followUp).toBeNull();
    });

    it("sets a session cookie from the bypass query even without other auth config", async () => {
        const env = {
            VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
        };
        const response = await handleDeploymentProtection(
            new Request("https://example.com/?x-vercel-protection-bypass=bypass-secret"),
            { env }
        );

        expect(response).not.toBeNull();
        expect(response!.status).toBe(302);
        expect(setCookieHeader(response!)).toContain(SESSION_COOKIE_NAME);

        const sessionCookie = cookieHeaderFromResponse(response!, SESSION_COOKIE_NAME);
        const followUp = await handleDeploymentProtection(
            new Request("https://example.com/", {
                headers: { cookie: sessionCookie! },
            }),
            { env }
        );
        expect(followUp).toBeNull();
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
        expect(response!.headers.get("Location")).toBe("https://example.com/page");
        expect(setCookieHeader(response!)).toContain(SESSION_COOKIE_NAME);
        expect(setCookieHeader(response!)).toContain(BYPASS_COOKIE_NAME);
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

describe("auth proxy mode on protected apps", () => {
    it("detects proxy auth without vercel client credentials", () => {
        const config = resolveConfig({
            env: {
                DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
                DEPLOYMENT_PROTECTION_AUTH_PROXY_URL: "https://dp-auth.example.com",
            },
        });
        expect(hasVercelAuth(config)).toBe(true);
        expect(config.authProxyUrl).toBe("https://dp-auth.example.com");
    });

    it("redirects authorize to the auth proxy with a signature", async () => {
        const response = await handleDeploymentProtection(
            new Request(
                "https://app.example.com/_becklyn/deployment-protection/vercel?return_to=/dash"
            ),
            {
                env: {
                    DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
                    DEPLOYMENT_PROTECTION_AUTH_PROXY_URL: "https://dp-auth.example.com",
                },
            }
        );
        expect(response).not.toBeNull();
        expect(response!.status).toBe(302);
        const location = new URL(response!.headers.get("Location")!);
        expect(location.origin).toBe("https://dp-auth.example.com");
        expect(location.pathname).toBe("/start");
        expect(location.searchParams.get("return_origin")).toBe("https://app.example.com");
        expect(location.searchParams.get("return_path")).toBe("/dash");
        expect(location.searchParams.get("sig")).toBeTruthy();
    });

    it("accepts a valid handoff token on the app callback", async () => {
        const { createHandoffToken } = await import("./handoff");
        const handoff = await createHandoffToken(
            "super-long-signing-secret",
            "https://app.example.com",
            "alice",
            60
        );
        const response = await handleDeploymentProtection(
            new Request(
                `https://app.example.com/_becklyn/deployment-protection/vercel/callback?handoff=${encodeURIComponent(handoff)}&return_to=/home`
            ),
            {
                env: {
                    DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
                    DEPLOYMENT_PROTECTION_AUTH_PROXY_URL: "https://dp-auth.example.com",
                },
            }
        );
        expect(response).not.toBeNull();
        expect(response!.status).toBe(302);
        expect(response!.headers.get("Location")).toBe("https://app.example.com/home");
        expect(response!.headers.get("Set-Cookie")).toContain(SESSION_COOKIE_NAME);
        expectSameSiteNone(namedSetCookie(response!, SESSION_COOKIE_NAME));
    });

    it("shows Sign in with Vercel when only auth proxy is configured", async () => {
        const response = await handleDeploymentProtection(new Request("https://example.com/"), {
            env: {
                DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
                DEPLOYMENT_PROTECTION_AUTH_PROXY_URL: "https://dp-auth.example.com",
            },
        });
        expect(response).not.toBeNull();
        expect(await response!.text()).toContain("Sign in with Vercel");
    });
});
