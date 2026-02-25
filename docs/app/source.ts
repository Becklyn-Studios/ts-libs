import { InferPageType, loader, type LoaderOutput, type MetaData } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docs } from "fumadocs-mdx:collections/server";
import type { DocCollectionEntry, MetaCollectionEntry } from "fumadocs-mdx/runtime/server";

type DocsFrontmatter = { title?: string; description?: string; icon?: string; full?: boolean };
type DocsPageData = DocCollectionEntry<string, DocsFrontmatter>;
type DocsLoaderOutput = LoaderOutput<{ source: { pageData: DocsPageData; metaData: MetaCollectionEntry<MetaData> }; i18n: undefined }>;

// Cast needed because TypeScript cannot resolve the generic conditional type in the
// generated .source/server.ts due to @ts-nocheck suppressing top-level await inference.
const source = loader(docs.toFumadocsSource(), {
    baseUrl: "/docs",
    plugins: [lucideIconsPlugin()],
}) as unknown as DocsLoaderOutput;

export const { getPage, getPages, pageTree, generateParams } = source;

export function getPageImage(page: InferPageType<typeof source>) {
    const segments = [...page.slugs, "image.png"];

    return {
        segments,
        url: `/og/docs/${segments.join("/")}`,
    };
}

export async function getLLMText(page: InferPageType<typeof source>) {
    const processed = await page.data.getText("processed");

    return `# ${page.data.title}

${processed}`;
}
