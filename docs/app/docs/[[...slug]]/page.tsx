import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { getPage, getPageImage, getPages } from "@/app/source";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { getMDXComponents } from "@/mdx-components";

export const revalidate = false;

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
    const params = await props.params;
    const page = getPage(params.slug);

    if (!page) {
        notFound();
    }

    const MDX = page.data.body;

    return (
        <DocsPage
            toc={page.data.toc}
            full={page.data.full}
            tableOfContent={{ style: "clerk", single: false }}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription className="mb-2">{page.data.description}</DocsDescription>
            <div
                className="flex flex-row gap-2 items-center border-b"
                style={{ paddingBottom: "1.5rem" }}>
                <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
                <ViewOptions
                    markdownUrl={`${page.url}.mdx`}
                    githubUrl={`https://github.com/Becklyn-Studios/ts-libs/blob/main/docs/content/docs/${page.path}`}
                />
            </div>
            <DocsBody>
                <MDX components={getMDXComponents()} />
            </DocsBody>
        </DocsPage>
    );
}

export async function generateStaticParams() {
    return getPages().map(page => ({
        slug: page.slugs,
    }));
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
    const params = await props.params;
    const page = getPage(params.slug);

    if (!page) {
        notFound();
    }

    return {
        title: page.data.title,
        description: page.data.description,
        openGraph: {
            images: getPageImage(page).url,
        },
    } satisfies Metadata;
}
