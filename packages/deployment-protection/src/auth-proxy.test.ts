import { afterEach, describe, expect, it, vi } from "vitest";
import { handleAuthProxyCallback, handleAuthProxyStart } from "./auth-proxy";
import {
    OAUTH_RETURN_COOKIE,
    OAUTH_RETURN_ORIGIN_COOKIE,
    OAUTH_STATE_COOKIE,
    OAUTH_VERIFIER_COOKIE,
    VERCEL_CALLBACK_PATH,
} from "./constants";
import { buildProxyStartUrl, verifyHandoffToken } from "./handoff";

const proxyEnv = {
    DEPLOYMENT_PROTECTION_SECRET: "shared-handoff-secret",
    DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID: "client",
    DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET: "client-secret",
};

function readSetCookies(response: Response): string[] {
    if (typeof response.headers.getSetCookie === "function") {
        return response.headers.getSetCookie();
    }

    const single = response.headers.get("Set-Cookie");
    return single ? [single] : [];
}

function cookieHeaderFromResponse(response: Response): string {
    return readSetCookies(response)
        .map(part => part.split(";")[0]!)
        .join("; ");
}

describe("handleAuthProxyStart", () => {
    it("rejects unsigned start requests", async () => {
        const response = await handleAuthProxyStart(
            new Request(
                "https://dp-auth.example.com/start?return_origin=https://app.example.com&return_path=/&exp=9999999999&nonce=n&sig=bad"
            ),
            { env: proxyEnv }
        );
        expect(response.status).toBe(403);
    });

    it("redirects to Vercel authorize for a valid signed start", async () => {
        const startUrl = await buildProxyStartUrl({
            authProxyUrl: "https://dp-auth.example.com",
            secret: proxyEnv.DEPLOYMENT_PROTECTION_SECRET,
            returnOrigin: "https://app.example.com",
            returnPath: "/dashboard",
        });

        const response = await handleAuthProxyStart(new Request(startUrl), { env: proxyEnv });
        expect(response.status).toBe(302);
        const location = response.headers.get("Location");
        expect(location).toContain("https://vercel.com/oauth/authorize?");
        expect(location).toContain(encodeURIComponent("https://dp-auth.example.com/callback"));
        const cookies = readSetCookies(response).join("\n");
        expect(cookies).toContain(OAUTH_RETURN_ORIGIN_COOKIE);
        expect(cookies).toContain(OAUTH_STATE_COOKIE);
    });

    it("enforces allowlist", async () => {
        const startUrl = await buildProxyStartUrl({
            authProxyUrl: "https://dp-auth.example.com",
            secret: proxyEnv.DEPLOYMENT_PROTECTION_SECRET,
            returnOrigin: "https://evil.com",
            returnPath: "/",
        });

        const response = await handleAuthProxyStart(new Request(startUrl), {
            env: {
                ...proxyEnv,
                DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS: ".vercel.app,https://app.example.com",
            },
        });
        expect(response.status).toBe(403);
        expect(await response.text()).toContain("not allowed");
    });
});

describe("handleAuthProxyCallback", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("mints a handoff token and redirects to the app callback", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async (input: RequestInfo | URL) => {
                const url = String(input);

                if (url.includes("/login/oauth/token")) {
                    return new Response(
                        JSON.stringify({
                            access_token: "access",
                            token_type: "Bearer",
                            expires_in: 3600,
                        }),
                        { status: 200, headers: { "Content-Type": "application/json" } }
                    );
                }

                if (url.includes("/login/oauth/userinfo")) {
                    return new Response(JSON.stringify({ preferred_username: "alice" }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                }

                throw new Error(`Unexpected fetch: ${url}`);
            })
        );

        const startUrl = await buildProxyStartUrl({
            authProxyUrl: "https://dp-auth.example.com",
            secret: proxyEnv.DEPLOYMENT_PROTECTION_SECRET,
            returnOrigin: "https://app.example.com",
            returnPath: "/after",
        });
        const startResponse = await handleAuthProxyStart(new Request(startUrl), { env: proxyEnv });
        const cookies = cookieHeaderFromResponse(startResponse);
        const state = cookies
            .split("; ")
            .map(part => part.trim())
            .find(part => part.startsWith(`${OAUTH_STATE_COOKIE}=`))
            ?.split("=")[1];

        expect(state).toBeTruthy();
        expect(cookies).toContain(OAUTH_VERIFIER_COOKIE);
        expect(cookies).toContain(OAUTH_RETURN_COOKIE);

        const callbackResponse = await handleAuthProxyCallback(
            new Request(
                `https://dp-auth.example.com/callback?code=auth-code&state=${decodeURIComponent(state!)}`,
                {
                    headers: { cookie: cookies },
                }
            ),
            { env: proxyEnv }
        );

        expect(callbackResponse.status).toBe(302);
        const location = new URL(callbackResponse.headers.get("Location")!);
        expect(location.origin).toBe("https://app.example.com");
        expect(location.pathname).toBe(VERCEL_CALLBACK_PATH);
        expect(location.searchParams.get("return_to")).toBe("/after");

        const handoff = location.searchParams.get("handoff");
        const payload = await verifyHandoffToken(
            proxyEnv.DEPLOYMENT_PROTECTION_SECRET,
            handoff,
            "https://app.example.com"
        );
        expect(payload?.subject).toBe("alice");
    });
});
