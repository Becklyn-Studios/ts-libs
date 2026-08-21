import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function importBuiltBundle(relativePath: string): Promise<Record<string, unknown>> {
    const absolutePath = path.join(packageRoot, relativePath);
    return import(pathToFileURL(absolutePath).href);
}

describe("edge/storybook publish bundles", () => {
    it("ships self-contained ESM bundles with no relative imports", () => {
        for (const relativePath of ["dist/edge.mjs", "dist/storybook.mjs"] as const) {
            const source = readFileSync(path.join(packageRoot, relativePath), "utf8");
            expect(source.length).toBeGreaterThan(500);
            // Bundles must not reach back into multi-file tsc output.
            expect(source).not.toMatch(/from\s+["']\.\//);
            expect(source).not.toMatch(/require\(["']\.\//);
            // And must not pull Next.js into the Storybook/static path.
            expect(source).not.toMatch(/next\/server/);
        }
    });

    it("exports the public edge API from the edge bundle", async () => {
        const mod = await importBuiltBundle("dist/edge.mjs");
        expect(typeof mod.withEdgeDeploymentProtection).toBe("function");
        expect(typeof mod.middlewarePassThrough).toBe("function");

        const passThrough = (mod.middlewarePassThrough as () => Response)();
        expect(passThrough.headers.get("x-middleware-next")).toBe("1");
    });

    it("exports the Storybook alias from the storybook bundle", async () => {
        const mod = await importBuiltBundle("dist/storybook.mjs");
        expect(typeof mod.withStorybookDeploymentProtection).toBe("function");
        expect(typeof mod.middlewarePassThrough).toBe("function");
        // Rename-only surface: edge factory name is not re-exported here.
        expect(mod.withEdgeDeploymentProtection).toBeUndefined();
    });
});
