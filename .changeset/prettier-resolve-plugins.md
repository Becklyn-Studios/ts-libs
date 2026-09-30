---
"@becklyn/prettier": patch
---

Resolve the bundled Prettier plugins via `require.resolve`, so the config works with strict package managers (e.g. pnpm) without installing the plugins in the consuming project.
