---
"@becklyn/deployment-protection": minor
---

Remove `deploymentProtectionMatcher` export. Next.js requires `config.matcher` to be a string literal in the local middleware/proxy file and cannot analyze values imported from a package. Document the recommended matcher inline in the README instead.
