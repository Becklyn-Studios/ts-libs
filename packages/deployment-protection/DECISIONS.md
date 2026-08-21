# Decisions

## Storybook uses Vercel Edge Middleware (not Storybook config)

- Built Storybook is a static site (`storybook-static`); Storybook `main.ts` / Vite hooks cannot gate production traffic.
- Reuse the existing `handleDeploymentProtection` core via a Next-free edge wrapper that emits `x-middleware-next` for pass-through.
- Configure with a root `middleware.ts` importing `@becklyn/deployment-protection/storybook` and the same env vars as Next apps.
- Keep `next` as an optional peer dependency so Storybook-only projects are not forced to install Next.js.

## Ship self-contained ESM bundles for `./edge` and `./storybook`

- Vercel Routing Middleware (edge + nodejs) file-traces imports with NFT and loads them in a restricted runtime — it does not reliably bundle multi-file package graphs.
- tsc `dist/es/*` used extensionless relative imports and no `type: module`, so Node ESM/`runtime: "nodejs"` failed, and edge builds reported `@becklyn/deployment-protection/edge` as an unsupported module.
- Build zero-import `dist/edge.mjs` + `dist/storybook.mjs` with esbuild and point export conditions (`edge-light`, `worker`, `browser`, `import`, `default`) at those files.
- Do **not** use Vercel framework preset `storybook` for protected deploys (`disableRootMiddleware: true`); use `framework: null`.
