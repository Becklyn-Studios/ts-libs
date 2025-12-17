import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { pageTree } from "@/app/source";
import { Title } from "@/components/layout/Title";

export default function RootDocsLayout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={pageTree}
            nav={{ title: <Title />, url: "/docs" }}
            githubUrl="https://github.com/Becklyn-Studios/ts-libs">
            {children}
        </DocsLayout>
    );
}
