---
"@becklyn/deployment-protection": minor
---

Add central auth-proxy support for Sign in with Vercel so projects no longer register per-host OAuth callback URLs. Protected apps can set `DEPLOYMENT_PROTECTION_AUTH_PROXY_URL` and share a handoff secret; the new private `deployment-protection-auth-proxy` app owns the single Vercel callback.
