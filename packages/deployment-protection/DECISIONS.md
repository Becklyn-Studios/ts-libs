# Decisions

## Storybook uses Vercel Edge Middleware (not Storybook config)

- Built Storybook is a static site (`storybook-static`); Storybook `main.ts` / Vite hooks cannot gate production traffic.
- Reuse the existing `handleDeploymentProtection` core via a Next-free edge wrapper that emits `x-middleware-next` for pass-through.
- Configure with a root `middleware.ts` importing `@becklyn/deployment-protection/storybook` and the same env vars as Next apps.
- Keep `next` as an optional peer dependency so Storybook-only projects are not forced to install Next.js.
