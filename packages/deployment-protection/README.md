# `@becklyn/deployment-protection`

Simple, shared deployment gate for Next.js apps on Vercel.

Use this instead of (or after disabling) Vercel platform Deployment Protection when you need:

- a **shared username/password** from env vars
- optional **Sign in with Vercel** for team members
- always-on **automation bypass** via `x-vercel-protection-bypass` / `VERCEL_AUTOMATION_BYPASS_SECRET`
- a kill switch (`DEPLOYMENT_PROTECTION_ENABLED`, on by default)

Protection runs in Next.js **middleware** (Next ≤15) or **proxy** (Next 16+).

> **Note:** Vercel Connect is unrelated (third-party API tokens). Platform Vercel Authentication cookies are not visible to your app once platform protection is off — team members use the **Sign in with Vercel** button instead.

## Install

```bash
npm i @becklyn/deployment-protection
```

## Quick setup

### 1. Middleware / proxy

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
| `DEPLOYMENT_PROTECTION_SECRET`               | recommended       | derived from user+pass    | HMAC secret for session cookies                        |
| `VERCEL_AUTOMATION_BYPASS_SECRET`            | no                | —                         | Same secret as Vercel Protection Bypass for Automation |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_ID`     | for Vercel login  | —                         | Or `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID`                  |
| `DEPLOYMENT_PROTECTION_VERCEL_CLIENT_SECRET` | for Vercel login  | —                         | Or `VERCEL_APP_CLIENT_SECRET`                          |
| `DEPLOYMENT_PROTECTION_FORM_TITLE`           | no                | `Authentication required` | Login heading                                          |
| `DEPLOYMENT_PROTECTION_FORM_DESCRIPTION`     | no                | …                         | Login description                                      |

At least one of password auth, Vercel OAuth, or a bypass secret must be configured while enabled. If nothing is configured, the gate stays inactive (fail-open) so local dev is not bricked.

### 3. Sign in with Vercel (optional)

1. Create a [Sign in with Vercel](https://vercel.com/docs/sign-in-with-vercel) app in the Vercel dashboard.
2. Generate a client secret.
3. Add authorization callback URLs for each project host, pointing at:

    ```text
    https://<your-host>/_becklyn/deployment-protection/vercel/callback
    http://localhost:3000/_becklyn/deployment-protection/vercel/callback
    ```

    You can attach the path to preview + production domains of each project from the dashboard.

4. Set client id/secret env vars on the project(s). Prefer team-level shared env values.

Scopes used: `openid email profile`.

### 4. Automation bypass

Matches Vercel’s Protection Bypass for Automation:

```http
GET /api/health
x-vercel-protection-bypass: <VERCEL_AUTOMATION_BYPASS_SECRET>
```

Or query:

```text
https://app.example/?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true
```

When platform Deployment Protection is disabled, **this package** enforces the bypass secret so CI/Playwright keep working the same way.

## Behaviour

1. Disabled / misconfigured → pass through
2. Internal Vercel OAuth routes → handled by the package
3. Login form `POST` → validate username/password, set signed HttpOnly session cookie
4. Valid bypass header/query/cookie → allow (optionally set cookies)
5. Valid session cookie → allow
6. Else → HTML login page (password and/or Sign in with Vercel)

Session cookie: `__becklyn_dp_session` (HMAC-SHA256, 14 days by default).

## Disable without code changes

```bash
DEPLOYMENT_PROTECTION_ENABLED=false
```

Redeploy. Middleware stays installed but is a no-op.

## API

```ts
import {
    handleDeploymentProtection,
    resolveConfig,
    withDeploymentProtection,
} from "@becklyn/deployment-protection";
```

- `withDeploymentProtection(options?)` / `withDeploymentProtection(next, options?)` — middleware/proxy factory
- `handleDeploymentProtection(request, options?)` — framework-agnostic core (`null` = continue)

Recommended matcher (must be pasted as a string literal in your middleware/proxy file — see above):

```ts
"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)";
```

## Security notes

- This is a **shared-secret gate**, not per-user product auth.
- Prefer a dedicated `DEPLOYMENT_PROTECTION_SECRET` in production.
- Turn off paid Vercel Password Protection / seat-heavy sharing once this is live; keep `VERCEL_AUTOMATION_BYPASS_SECRET` configured for tooling.
- Middleware is a convenience edge check — do not treat it as the only control for highly sensitive data.

## License

MIT
