# Deployment protection auth proxy

Central **Sign in with Vercel** broker for [`@becklyn/deployment-protection`](../deployment-protection).

Register **one** OAuth callback on the Vercel app:

```text
https://<this-host>/callback
```

## Env

| Variable                                                                 | Required    | Description                            |
| ------------------------------------------------------------------------ | ----------- | -------------------------------------- |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID`                                 | yes         | Vercel OAuth client id                 |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET`                             | yes         | Vercel OAuth client secret             |
| `DEPLOYMENT_PROTECTION_SECRET` or `DEPLOYMENT_PROTECTION_HANDOFF_SECRET` | yes         | Shared HMAC secret with protected apps |
| `DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS`                                  | recommended | Comma-separated origin allowlist       |

Protected apps only need:

```bash
DEPLOYMENT_PROTECTION_AUTH_PROXY_URL=https://<this-host>
DEPLOYMENT_PROTECTION_SECRET=<same-or-session-secret>
DEPLOYMENT_PROTECTION_HANDOFF_SECRET=<same-as-proxy>
```

## Develop

```bash
npm run dev -w @becklyn/deployment-protection-auth-proxy
```

## Deploy

Deploy this package as its own Vercel project. Point the Vercel OAuth app callback at `/callback` on that production host.
