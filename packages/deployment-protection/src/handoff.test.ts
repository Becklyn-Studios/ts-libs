import { describe, expect, it } from "vitest";
import {
    buildProxyStartUrl,
    createHandoffToken,
    isReturnOriginAllowed,
    normalizeReturnOrigin,
    parseAllowlist,
    signProxyStart,
    verifyHandoffToken,
    verifyProxyStartSignature,
} from "./handoff";

describe("handoff tokens", () => {
    it("round-trips a signed handoff for the expected audience", async () => {
        const token = await createHandoffToken("secret", "https://app.example.com", "alice", 60);
        const payload = await verifyHandoffToken("secret", token, "https://app.example.com");
        expect(payload?.subject).toBe("alice");
        expect(payload?.method).toBe("vercel");
        expect(payload?.aud).toBe("https://app.example.com");
    });

    it("rejects handoff tokens for a different audience", async () => {
        const token = await createHandoffToken("secret", "https://app.example.com", "alice", 60);
        expect(await verifyHandoffToken("secret", token, "https://other.example.com")).toBeNull();
    });

    it("rejects tampered handoff tokens", async () => {
        const token = await createHandoffToken("secret", "https://app.example.com", "alice", 60);
        const tampered = token.replace(".", ".x");
        expect(await verifyHandoffToken("secret", tampered, "https://app.example.com")).toBeNull();
    });
});

describe("proxy start signatures", () => {
    it("accepts a valid signed start request", async () => {
        const params = {
            returnOrigin: "https://preview.example.com",
            returnPath: "/dashboard",
            exp: Math.floor(Date.now() / 1000) + 300,
            nonce: "abc",
        };
        const sig = await signProxyStart("secret", params);
        expect(await verifyProxyStartSignature("secret", params, sig)).toBe(true);
    });

    it("rejects expired start requests", async () => {
        const params = {
            returnOrigin: "https://preview.example.com",
            returnPath: "/",
            exp: Math.floor(Date.now() / 1000) - 10,
            nonce: "abc",
        };
        const sig = await signProxyStart("secret", params);
        expect(await verifyProxyStartSignature("secret", params, sig)).toBe(false);
    });

    it("builds a start URL with signature params", async () => {
        const url = new URL(
            await buildProxyStartUrl({
                authProxyUrl: "https://dp-auth.example.com",
                secret: "secret",
                returnOrigin: "https://app.example.com",
                returnPath: "/x",
            })
        );
        expect(url.origin).toBe("https://dp-auth.example.com");
        expect(url.pathname).toBe("/start");
        expect(url.searchParams.get("return_origin")).toBe("https://app.example.com");
        expect(url.searchParams.get("return_path")).toBe("/x");
        expect(url.searchParams.get("sig")).toBeTruthy();
        expect(url.searchParams.get("nonce")).toBeTruthy();
    });
});

describe("return origin validation", () => {
    it("normalizes https origins and rejects non-https remote origins", () => {
        expect(normalizeReturnOrigin("https://app.example.com/path")).toBe(
            "https://app.example.com"
        );
        expect(normalizeReturnOrigin("http://evil.com")).toBeNull();
        expect(normalizeReturnOrigin("http://localhost:3000")).toBe("http://localhost:3000");
    });

    it("applies allowlist entries", () => {
        const allowlist = parseAllowlist("https://app.example.com, .vercel.app, localhost");
        expect(isReturnOriginAllowed("https://app.example.com", allowlist)).toBe(true);
        expect(isReturnOriginAllowed("https://foo.vercel.app", allowlist)).toBe(true);
        expect(isReturnOriginAllowed("http://localhost:3000", allowlist)).toBe(true);
        expect(isReturnOriginAllowed("https://evil.com", allowlist)).toBe(false);
    });
});
