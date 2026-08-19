import { describe, expect, it } from "vitest";
import { SESSION_COOKIE_NAME } from "./constants";
import { middlewarePassThrough, withEdgeDeploymentProtection } from "./edge";
import { createSessionToken } from "./session";

const baseEnv = {
    DEPLOYMENT_PROTECTION_USERNAME: "preview",
    DEPLOYMENT_PROTECTION_PASSWORD: "s3cret",
    DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
};

describe("middlewarePassThrough", () => {
    it("signals Vercel to continue the request", () => {
        const response = middlewarePassThrough();
        expect(response.status).toBe(200);
        expect(response.headers.get("x-middleware-next")).toBe("1");
    });
});

describe("withEdgeDeploymentProtection", () => {
    it("returns the login page when unauthenticated", async () => {
        const middleware = withEdgeDeploymentProtection({ env: baseEnv });
        const response = await middleware(new Request("https://storybook.example.com/"));
        expect(response.status).toBe(401);
        expect(await response.text()).toContain("Authentication required");
        expect(response.headers.get("x-middleware-next")).toBeNull();
    });

    it("passes through when a valid session cookie is present", async () => {
        const token = await createSessionToken(
            baseEnv.DEPLOYMENT_PROTECTION_SECRET,
            "password",
            "preview",
            60
        );
        const middleware = withEdgeDeploymentProtection({ env: baseEnv });
        const response = await middleware(
            new Request("https://storybook.example.com/", {
                headers: {
                    cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
                },
            })
        );
        expect(response.status).toBe(200);
        expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("is a no-op when protection is disabled", async () => {
        const middleware = withEdgeDeploymentProtection({
            env: {
                ...baseEnv,
                DEPLOYMENT_PROTECTION_ENABLED: "false",
            },
        });
        const response = await middleware(new Request("https://storybook.example.com/"));
        expect(response.headers.get("x-middleware-next")).toBe("1");
    });
});
