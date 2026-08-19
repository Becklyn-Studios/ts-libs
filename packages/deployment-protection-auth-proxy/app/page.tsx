import type { ReactElement } from "react";

export default function HomePage(): ReactElement {
    return (
        <main
            style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                maxWidth: 560,
                margin: "10vh auto",
                padding: 24,
                lineHeight: 1.5,
            }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: 8 }}>
                Deployment protection auth proxy
            </h1>
            <p style={{ color: "#64748b" }}>
                This service brokers <strong>Sign in with Vercel</strong> for apps using{" "}
                <code>@becklyn/deployment-protection</code>. It is not meant to be opened directly.
            </p>
            <ul>
                <li>
                    <code>/start</code> — signed entry from a protected app
                </li>
                <li>
                    <code>/callback</code> — single Vercel OAuth redirect URI
                </li>
            </ul>
        </main>
    );
}
