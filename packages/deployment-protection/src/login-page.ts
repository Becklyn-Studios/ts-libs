import { VERCEL_AUTHORIZE_PATH } from "./constants";
import type { DeploymentProtectionConfig } from "./types";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function renderLoginPage(
    config: DeploymentProtectionConfig,
    options: {
        error?: string | null;
        returnTo?: string;
        showPassword?: boolean;
        showVercel?: boolean;
    } = {}
): string {
    const returnTo = options.returnTo ?? "/";
    const showPassword = options.showPassword ?? true;
    const showVercel = options.showVercel ?? false;
    const error = options.error ? `<p class="error">${escapeHtml(options.error)}</p>` : "";
    const vercelButton = showVercel
        ? `<a class="secondary" href="${VERCEL_AUTHORIZE_PATH}?return_to=${encodeURIComponent(returnTo)}">Sign in with Vercel</a>`
        : "";

    const passwordForm = showPassword
        ? `
      <form method="post" action="${escapeHtml(returnTo)}">
        <input type="hidden" name="__becklyn_dp" value="1" />
        <input type="hidden" name="return_to" value="${escapeHtml(returnTo)}" />
        <label>
          Username
          <input name="username" type="text" autocomplete="username" required autofocus />
        </label>
        <label>
          Password
          <input name="password" type="password" autocomplete="current-password" required />
        </label>
        <button type="submit">Continue</button>
      </form>`
        : "";

    const divider = showPassword && showVercel ? `<div class="divider"><span>or</span></div>` : "";

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(config.formTitle)}</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0b0f19;
      --card: #121826;
      --text: #e8eefc;
      --muted: #9aa8c7;
      --accent: #3b82f6;
      --border: #243044;
      --error: #f87171;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f4f7fb;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #64748b;
        --border: #e2e8f0;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      background:
        radial-gradient(1200px 600px at 10% -10%, rgba(59,130,246,.25), transparent 60%),
        radial-gradient(900px 500px at 100% 0%, rgba(14,165,233,.18), transparent 55%),
        var(--bg);
      color: var(--text);
      padding: 24px;
    }
    .card {
      width: min(100%, 420px);
      background: color-mix(in srgb, var(--card) 92%, transparent);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,.25);
      backdrop-filter: blur(8px);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 1.35rem;
      letter-spacing: -0.02em;
    }
    p {
      margin: 0 0 20px;
      color: var(--muted);
      line-height: 1.5;
      font-size: .95rem;
    }
    form { display: grid; gap: 14px; }
    label {
      display: grid;
      gap: 6px;
      font-size: .85rem;
      color: var(--muted);
    }
    input {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 14px;
      font: inherit;
      color: var(--text);
      background: transparent;
    }
    input:focus {
      outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent);
      border-color: var(--accent);
    }
    button, .secondary {
      appearance: none;
      border: 0;
      border-radius: 10px;
      padding: 12px 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
    }
    button {
      background: var(--accent);
      color: white;
    }
    .secondary {
      display: block;
      background: transparent;
      color: var(--text);
      border: 1px solid var(--border);
    }
    .divider {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 12px;
      align-items: center;
      margin: 18px 0;
      color: var(--muted);
      font-size: .8rem;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .divider::before, .divider::after {
      content: "";
      height: 1px;
      background: var(--border);
    }
    .error {
      color: var(--error);
      background: color-mix(in srgb, var(--error) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error) 35%, transparent);
      border-radius: 10px;
      padding: 10px 12px;
      margin: 0 0 16px;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>${escapeHtml(config.formTitle)}</h1>
    <p>${escapeHtml(config.formDescription)}</p>
    ${error}
    ${passwordForm}
    ${divider}
    ${vercelButton}
  </main>
</body>
</html>`;
}
