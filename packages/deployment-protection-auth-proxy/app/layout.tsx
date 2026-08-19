import type { ReactElement, ReactNode } from "react";

export const metadata = {
    title: "Deployment protection auth proxy",
    robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    );
}
