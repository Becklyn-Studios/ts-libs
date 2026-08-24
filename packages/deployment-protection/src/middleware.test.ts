import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { SESSION_COOKIE_NAME } from "./constants";
import { withDeploymentProtection } from "./middleware";

const baseEnv = {
    DEPLOYMENT_PROTECTION_USERNAME: "preview",
    DEPLOYMENT_PROTECTION_PASSWORD: "s3cret",
    DEPLOYMENT_PROTECTION_SECRET: "super-long-signing-secret",
    VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
};

describe("withDeploymentProtection", () => {
    it("sets the session cookie on the Next.js redirect when bypass is in the query", async () => {
        const middleware = withDeploymentProtection({ env: baseEnv });
        const request = new NextRequest(
            "https://example.com/page?x-vercel-protection-bypass=bypass-secret"
        );
        const response = await middleware(request);

        expect(response.status).toBe(302);
        expect(response.headers.get("Location")).toBe("https://example.com/page");
        expect(response.cookies.get(SESSION_COOKIE_NAME)?.value).toBeTruthy();
    });

    it("does not require x-vercel-set-bypass-cookie to persist the session", async () => {
        const middleware = withDeploymentProtection({
            env: {
                VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
            },
        });
        const request = new NextRequest(
            "https://example.com/?x-vercel-protection-bypass=bypass-secret"
        );
        const response = await middleware(request);

        expect(response.status).toBe(302);
        expect(response.cookies.get(SESSION_COOKIE_NAME)?.value).toBeTruthy();
    });
});
