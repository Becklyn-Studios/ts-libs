# @becklyn/deployment-protection

## 0.2.0

### Minor Changes

- c46032e: Remove `deploymentProtectionMatcher` export. Next.js requires `config.matcher` to be a string literal in the local middleware/proxy file and cannot analyze values imported from a package. Document the recommended matcher inline in the README instead.

## 0.1.0

### Minor Changes

- 36a78fa: Add `@becklyn/deployment-protection`: shared Next.js deployment gate with env username/password, optional Sign in with Vercel, automation bypass, and enable/disable switch.
