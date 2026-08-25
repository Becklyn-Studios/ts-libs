---
"@becklyn/deployment-protection": patch
---

Set `__becklyn_dp_session` when `x-vercel-protection-bypass` is present as a query param, including Next.js middleware redirects that previously dropped the cookie. Fix JSDoc matcher examples so copied regexes use `\\.` and still exclude static assets.
