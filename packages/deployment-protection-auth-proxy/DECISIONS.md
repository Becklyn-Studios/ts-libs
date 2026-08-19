# Decisions

## Auth proxy instead of per-project OAuth callbacks

- Vercel SSO requires a registered redirect URL per host; preview URLs make that unmaintainable.
- One small Next.js app owns the single `/callback` and brokers login back to protected apps.
- Apps call `/start` with an HMAC-signed `return_origin` + `return_path` (not a raw shared secret in the URL).
- After Vercel OAuth, the proxy returns a short-lived audience-bound handoff token; each app verifies it and sets its own session cookie.
- Optional `DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS` allowlist on the proxy as defense in depth.
- Direct (legacy) per-app Vercel OAuth remains supported when `DEPLOYMENT_PROTECTION_AUTH_PROXY_URL` is unset.
