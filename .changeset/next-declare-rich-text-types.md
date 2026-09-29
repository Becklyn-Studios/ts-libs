---
"@becklyn/next": patch
---

Declare `@contentful/rich-text-types` as a dependency. `rte/generators` imports it at runtime, which failed in projects where it is not hoisted (e.g. strict pnpm setups or Yarn PnP).
