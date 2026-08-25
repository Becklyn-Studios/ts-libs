# `@becklyn/deployment-protection`

Simple, shared deployment gate for Next.js apps and static Storybook deploys on Vercel.

Use this instead of (or after disabling) Vercel platform Deployment Protection when you need:

- a **shared username/password** from env vars
- optional **Sign in with Vercel** for team members
- always-on **automation bypass** via `x-vercel-protection-bypass` / `VERCEL_AUTOMATION_BYPASS_SECRET`
- a kill switch (`DEPLOYMENT_PROTECTION_ENABLED`, on by default) that disables the **entire** gate, including automation bypass

Protection runs in:

- Next.js **middleware** (Next ≤15) or **proxy** (Next 16+)
- **Vercel Edge Middleware** for static Storybook (`@becklyn/deployment-protection/storybook`)

> **Note:** Vercel Connect is unrelated (third-party API tokens). Platform Vercel Authentication cookies are not visible to your app once platform protection is off — team members use the **Sign in with Vercel** button instead.

## Install

```bash
npm i @becklyn/deployment-protection
```

## Quick setup

### Storybook (static on Vercel)

Built Storybook is static (`storybook-static`), so protection is **Vercel Routing Middleware** — not a Storybook addon.

1. Install the package in the project that deploys Storybook (published build, or workspace package after `npm run build`).
2. Add `middleware.ts` at the **Vercel project root** (same level Vercel uses for `vercel.json` / output):

```ts
import { withStorybookDeploymentProtection } from "@becklyn/deployment-protection/storybook";

export default withStorybookDeploymentProtection();

export const config = {
    matcher: ["/((?!.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?|mjs)$).*)"],
};
```

3. Set the same environment variables as for Next.js (below).
4. `vercel.json` for a Storybook-only project — **`framework` must be `null`** (Other). Do **not** use the Vercel “Storybook” framework preset; it sets `disableRootMiddleware` and skips middleware entirely:

```json
{
    "buildCommand": "npm run build-storybook",
    "outputDirectory": "storybook-static",
    "framework": null
}
```

`withStorybookDeploymentProtection` does **not** require the `next` package. The matcher must stay a **string literal** in `middleware.ts` (same static-analysis rule as Next.js).

Prefer the default **edge** runtime. `runtime: "nodejs"` is supported as well — both resolve to a self-contained ESM bundle (`dist/storybook.mjs` / `dist/edge.mjs`) so Vercel does not need to trace the multi-file tsc graph.

Framework-agnostic alias (same implementation):

```ts
import { withEdgeDeploymentProtection } from "@becklyn/deployment-protection/edge";

export default withEdgeDeploymentProtection();
```

### 1. Next.js middleware / proxy

Next.js requires `config.matcher` to be a **string literal in the local middleware/proxy file**.
It cannot be imported from a package (Next analyzes the matcher statically at build time).

**Next.js 16+ (`proxy.ts`):**

```ts
import { withDeploymentProtection } from "@becklyn/deployment-protection";

export const proxy = withDeploymentProtection();

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)",
    ],
};
```

**Next.js ≤15 (`middleware.ts`):**

```ts
import { withDeploymentProtection } from "@becklyn/deployment-protection";

export default withDeploymentProtection();

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)",
    ],
};
```

Compose with existing middleware:

```ts
export default withDeploymentProtection(async request => {
    // your logic…
    return NextResponse.next();
});
```

### 2. Environment variables

| Variable                                     | Required          | Default                   | Description                                            |
| -------------------------------------------- | ----------------- | ------------------------- | ------------------------------------------------------ |
| `DEPLOYMENT_PROTECTION_ENABLED`              | no                | `true`                    | Set `false` / `0` / `off` to disable                   |
| `DEPLOYMENT_PROTECTION_USERNAME`             | for password auth | —                         | Shared username                                        |
| `DEPLOYMENT_PROTECTION_PASSWORD`             | for password auth | —                         | Shared password                                        |
| `DEPLOYMENT_PROTECTION_SECRET`               | recommended       | derived from user+pass    | HMAC secret for session cookies (+ handoff fallback)   |
| `DEPLOYMENT_PROTECTION_AUTH_PROXY_URL`       | for proxy SSO     | —                         | Base URL of the central auth-proxy app                 |
| `DEPLOYMENT_PROTECTION_HANDOFF_SECRET`       | no                | same as `…_SECRET`        | Shared secret between apps and the auth-proxy          |
| `VERCEL_AUTOMATION_BYPASS_SECRET`            | no                | —                         | Same secret as Vercel Protection Bypass for Automation |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID`     | direct Vercel SSO | —                         | Or `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID` (legacy)         |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET` | direct Vercel SSO | —                         | Or `VERCEL_APP_CLIENT_SECRET` (legacy)                 |
| `DEPLOYMENT_PROTECTION_FORM_TITLE`           | no                | `Authentication required` | Login heading                                          |
| `DEPLOYMENT_PROTECTION_FORM_DESCRIPTION`     | no                | …                         | Login description                                      |

At least one of password auth, Vercel OAuth (proxy or direct), or a bypass secret must be configured while enabled. If nothing is configured, the gate stays inactive (fail-open) so local dev is not bricked.

`DEPLOYMENT_PROTECTION_ENABLED=false` **always wins**. A set `VERCEL_AUTOMATION_BYPASS_SECRET` (Vercel injects this on most projects) does not keep the gate active.

### 3. Sign in with Vercel via auth-proxy (recommended)

Register **one** OAuth callback URL on a shared [Sign in with Vercel](https://vercel.com/docs/sign-in-with-vercel) app:

```text
https://<auth-proxy-host>/callback
```

Deploy the `deployment-protection-auth-proxy` app from this monorepo (or any tiny Next app that wires the handlers below) and set:

**On the auth-proxy**

| Variable                                             | Description                            |
| ---------------------------------------------------- | -------------------------------------- |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID`             | Vercel OAuth client id                 |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET`         | Vercel OAuth client secret             |
| `DEPLOYMENT_PROTECTION_SECRET` or `…_HANDOFF_SECRET` | Shared HMAC secret with protected apps |
| `DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS`              | Optional allowlist (see below)         |

**On every protected app**

| Variable                               | Description                            |
| -------------------------------------- | -------------------------------------- |
| `DEPLOYMENT_PROTECTION_AUTH_PROXY_URL` | e.g. `https://dp-auth.example.com`     |
| `DEPLOYMENT_PROTECTION_SECRET`         | Session cookie secret                  |
| `DEPLOYMENT_PROTECTION_HANDOFF_SECRET` | Same as proxy (defaults to `…_SECRET`) |

No per-project / per-preview callback URLs.

#### Flow

1. App redirects to `{AUTH_PROXY_URL}/start` with a **signed** `return_origin` + `return_path`.
2. Proxy runs Vercel OAuth against its fixed `/callback`.
3. Proxy redirects to  
   `{return_origin}/_becklyn/deployment-protection/vercel/callback?handoff=…&return_to=…`
4. App verifies the short-lived handoff token (`aud` must match its origin), sets `__becklyn_dp_session`, continues.

#### Allowlist (proxy)

`DEPLOYMENT_PROTECTION_ALLOWED_ORIGINS` is a comma-separated list:

- full origins: `https://app.example.com`
- host suffixes: `.vercel.app`, `example.com`
- `localhost` (http(s) localhost / 127.0.0.1)

Empty allowlist → any origin that passes https (or local http) validation. Prefer an allowlist in production.

#### Minimal proxy route handlers

```ts
// app/start/route.ts
import { handleAuthProxyStart } from "@becklyn/deployment-protection";

export const GET = (request: Request) => handleAuthProxyStart(request);

// app/callback/route.ts
import { handleAuthProxyCallback } from "@becklyn/deployment-protection";

export const GET = (request: Request) => handleAuthProxyCallback(request);
```

### 4. Sign in with Vercel (legacy direct mode)

Still supported when `DEPLOYMENT_PROTECTION_AUTH_PROXY_URL` is unset:

1. Create a Sign in with Vercel app.
2. Add authorization callback URLs for **each** project host:

    ```text
    https://<your-host>/_becklyn/deployment-protection/vercel/callback
    http://localhost:3000/_becklyn/deployment-protection/vercel/callback
    ```

3. Set client id/secret on the project(s).

When both proxy URL and direct client credentials are set, **proxy mode wins** for the authorize step.

Scopes used: `openid email profile`.

### 5. Automation bypass

Matches Vercel’s Protection Bypass for Automation:

```http
GET /api/health
x-vercel-protection-bypass: <VERCEL_AUTOMATION_BYPASS_SECRET>
```

Or query:

```text
https://app.example/?x-vercel-protection-bypass=<secret>
```

A valid bypass query param redirects to the same path without the secret and sets the signed `__becklyn_dp_session` cookie, so later requests stay authenticated. You do not need `x-vercel-set-bypass-cookie` for that.

Optional Vercel-compatible helper — also persist the raw bypass secret as `__becklyn_dp_bypass`:

```text
https://app.example/?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true
```

The header form stays one-shot (no cookies) so CI/Playwright can send it on each request.

When platform Deployment Protection is disabled, **this package** enforces the bypass secret so CI/Playwright keep working the same way.

Bypass is only enforced while the gate is enabled. `DEPLOYMENT_PROTECTION_ENABLED=false` turns off challenges **and** bypass handling.

## Behaviour

1. Disabled / misconfigured → pass through
2. Internal Vercel OAuth routes → handled by the package (proxy start or direct OAuth / handoff)
3. Login form `POST` → validate username/password, set signed HttpOnly session cookie
4. Valid bypass header → allow this request
5. Valid bypass query param → set `__becklyn_dp_session`, redirect to the cleaned URL
6. Valid session or bypass cookie → allow
7. Else → HTML login page (password and/or Sign in with Vercel)

Session cookie: `__becklyn_dp_session` (HMAC-SHA256, 14 days by default). On HTTPS it is `HttpOnly; Secure; SameSite=None` so a logged-in session is sent when the preview is embedded in a third-party iframe (e.g. Contentful live preview). On HTTP (localhost) it stays `SameSite=Lax` because browsers reject `SameSite=None` without `Secure`.

## Disable without code changes

```bash
DEPLOYMENT_PROTECTION_ENABLED=false
```

Redeploy. Middleware stays installed but is a no-op — including when `VERCEL_AUTOMATION_BYPASS_SECRET` is set.

## API

```ts
import {
    handleAuthProxyCallback,
    handleAuthProxyStart,
    handleDeploymentProtection,
    resolveConfig,
    withDeploymentProtection,
    withEdgeDeploymentProtection,
} from "@becklyn/deployment-protection";
import { withStorybookDeploymentProtection } from "@becklyn/deployment-protection/storybook";
```

- `withDeploymentProtection(options?)` / `withDeploymentProtection(next, options?)` — Next.js middleware/proxy factory
- `withStorybookDeploymentProtection(options?)` / `withEdgeDeploymentProtection(options?)` — Vercel Edge Middleware for Storybook / static deploys (no Next.js)
- `handleDeploymentProtection(request, options?)` — framework-agnostic core (`null` = continue)
- `handleAuthProxyStart` / `handleAuthProxyCallback` — central auth-proxy routes

Recommended matcher (must be pasted as a string literal in your middleware/proxy file — see above):

```ts
"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)";
```

## Security notes

- This is a **shared-secret gate**, not per-user product auth.
- Prefer a dedicated `DEPLOYMENT_PROTECTION_SECRET` in production.
- Auth-proxy start requests are HMAC-signed; handoff tokens are short-lived and audience-bound.
- Do not put the raw handoff secret in query strings — only signatures/tokens.
- Turn off paid Vercel Password Protection / seat-heavy sharing once this is live; keep `VERCEL_AUTOMATION_BYPASS_SECRET` configured for tooling.
- Middleware is a convenience edge check — do not treat it as the only control for highly sensitive data.
- `__becklyn_dp_session` is `SameSite=None` on HTTPS so third-party iframes can send it. That cookie only decides whether the preview may load; apps must still CSRF-protect their own state-changing endpoints. OAuth state/PKCE cookies stay `SameSite=Lax`.
- Safari (and some Chrome third-party-cookie settings) may still block unpartitioned third-party cookies even with `SameSite=None`.

## License

MIT
