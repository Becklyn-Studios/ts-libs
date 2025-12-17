import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "fumadocs-ui/style.css";

const inter = Inter({
    subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body>
                <RootProvider>{children}</RootProvider>
            </body>
        </html>
    );
}
