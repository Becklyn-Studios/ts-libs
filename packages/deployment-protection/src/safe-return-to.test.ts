import { describe, expect, it } from "vitest";
import { safeReturnTo } from "./safe-return-to";

describe("safeReturnTo", () => {
    it("allows plain same-origin paths", () => {
        expect(safeReturnTo("/")).toBe("/");
        expect(safeReturnTo("/dashboard")).toBe("/dashboard");
        expect(safeReturnTo("/a/b?x=1#y")).toBe("/a/b?x=1#y");
    });

    it("rejects absolute and protocol-relative URLs", () => {
        expect(safeReturnTo("https://evil.com")).toBe("/");
        expect(safeReturnTo("//evil.com")).toBe("/");
        expect(safeReturnTo("//evil.com/phish")).toBe("/");
        expect(safeReturnTo("///evil.com")).toBe("/");
    });

    it("rejects backslash-based open redirects", () => {
        expect(safeReturnTo("/\\evil.com")).toBe("/");
        expect(safeReturnTo("/\\/evil.com")).toBe("/");
        expect(safeReturnTo("/\\http://evil.com")).toBe("/");
        expect(safeReturnTo("/%5cevil.com")).toBe("/");
        expect(safeReturnTo("/%5Cevil.com")).toBe("/");
        expect(safeReturnTo("/%5c%2fevil.com")).toBe("/");
    });

    it("rejects encoded protocol-relative payloads after decoding", () => {
        expect(safeReturnTo("/%2f%2fevil.com")).toBe("/");
        expect(safeReturnTo("/%2F%2Fevil.com")).toBe("/");
    });

    it("rejects whitespace, control chars, and empty values", () => {
        expect(safeReturnTo("")).toBe("/");
        expect(safeReturnTo(null)).toBe("/");
        expect(safeReturnTo(undefined)).toBe("/");
        expect(safeReturnTo("/foo bar")).toBe("/");
        expect(safeReturnTo("/foo\nbar")).toBe("/");
        expect(safeReturnTo("dashboard")).toBe("/");
    });

    it("supports a custom fallback", () => {
        expect(safeReturnTo("//evil.com", "/home")).toBe("/home");
    });
});
