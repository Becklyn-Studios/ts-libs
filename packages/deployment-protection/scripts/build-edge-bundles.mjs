/**
 * Bundle Storybook / static-deploy entry points into self-contained ESM files.
 *
 * Vercel Routing Middleware (edge + nodejs) file-traces imports via NFT and
 * loads them in a restricted runtime. Multi-file tsc output with extensionless
 * relative imports does not resolve there, and bare package subpaths often show
 * up as "unsupported modules". A single zero-import .mjs file avoids both.
 */
import * as esbuild from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");

/** @type {esbuild.BuildOptions} */
const shared = {
    bundle: true,
    format: "esm",
    platform: "neutral",
    target: "es2022",
    legalComments: "none",
    // Keep process.env.* as runtime lookups (Vercel injects env at the edge).
    packages: "bundle",
    logLevel: "info",
};

const entries = [
    {
        entryPoints: [path.join(root, "src/edge.ts")],
        outfile: path.join(outDir, "edge.mjs"),
    },
    {
        entryPoints: [path.join(root, "src/storybook.ts")],
        outfile: path.join(outDir, "storybook.mjs"),
    },
];

await mkdir(outDir, { recursive: true });

for (const entry of entries) {
    await esbuild.build({
        ...shared,
        ...entry,
    });
}

// Marker so consumers / tests can assert the bundle build ran.
await writeFile(
    path.join(outDir, "edge-bundles.json"),
    `${JSON.stringify(
        {
            format: "esm",
            entries: entries.map(entry => path.relative(root, entry.outfile)),
        },
        null,
        4
    )}\n`
);
