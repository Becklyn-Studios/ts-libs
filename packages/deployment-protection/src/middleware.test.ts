import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
        expect(response.headers.get("set-cookie")?.toLowerCase()).toContain("samesite=none");
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

    it("passes through when the kill switch is off even if the bypass secret is set", async () => {
        const middleware = withDeploymentProtection({
            env: {
                VERCEL_AUTOMATION_BYPASS_SECRET: "bypass-secret",
                DEPLOYMENT_PROTECTION_ENABLED: "false",
            },
        });
        const request = new NextRequest(
            "https://example.com/?x-vercel-protection-bypass=bypass-secret"
        );
        const response = await middleware(request);

        expect(response.status).toBe(200);
        expect(response.headers.get("Location")).toBeNull();
        expect(response.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    });
});

function packageSource(relativePath: string): string {
    return readFileSync(
        path.join(path.dirname(fileURLToPath(import.meta.url)), relativePath),
        "utf8"
    );
}

describe("JSDoc matcher examples", () => {
    it("use two backslashes so copied regex excludes static assets", () => {
        for (const file of ["middleware.ts", "storybook.ts"] as const) {
            const source = packageSource(file);
            const matches = [...source.matchAll(/\.\*(\\\\+)\./g)];
            expect(matches.length).toBeGreaterThan(0);

            for (const match of matches) {
                expect(match[1], file).toHaveLength(2);
            }
        }
    });
});

describe("config env access", () => {
    it("reads the kill switch and bypass secret via static process.env members", () => {
        const source = packageSource("config.ts");
        expect(source).toContain("process.env.DEPLOYMENT_PROTECTION_ENABLED");
        expect(source).toContain("process.env.VERCEL_AUTOMATION_BYPASS_SECRET");
    });
});
