---
"@becklyn/deployment-protection": patch
---

Fix Storybook/static Vercel middleware by shipping self-contained `./edge` and `./storybook` ESM bundles. Resolves edge "unsupported modules" and nodejs named-export failures from multi-file tsc output.
