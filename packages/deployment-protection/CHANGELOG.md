# @becklyn/deployment-protection

## 0.4.1

### Patch Changes

- b9685e4: Fix Storybook/static Vercel middleware by shipping self-contained `./edge` and `./storybook` ESM bundles. Resolves edge "unsupported modules" and nodejs named-export failures from multi-file tsc output.

## 0.4.0

### Minor Changes

- 03bce00: Add Storybook / static deploy support via Vercel Edge Middleware (`@becklyn/deployment-protection/storybook` and `./edge`) using the same env-based gate as Next.js, without requiring the `next` package.

## 0.3.0

### Minor Changes

- 32f0ae6: Add central auth-proxy support for Sign in with Vercel so projects no longer register per-host OAuth callback URLs. Protected apps can set `DEPLOYMENT_PROTECTION_AUTH_PROXY_URL` and share a handoff secret; the new private `deployment-protection-auth-proxy` app owns the single Vercel callback.

## 0.2.0

### Minor Changes

- c46032e: Remove `deploymentProtectionMatcher` export. Next.js requires `config.matcher` to be a string literal in the local middleware/proxy file and cannot analyze values imported from a package. Document the recommended matcher inline in the README instead.

## 0.1.0

### Minor Changes

- 36a78fa: Add `@becklyn/deployment-protection`: shared Next.js deployment gate with env username/password, optional Sign in with Vercel, automation bypass, and enable/disable switch.
