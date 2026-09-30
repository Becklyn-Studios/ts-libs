---
"@becklyn/react-usercentrics": patch
---

Declare `tslib` as a dependency. The CommonJS build imports it at runtime (`importHelpers`), which failed in projects where `tslib` is not hoisted (e.g. pnpm).
