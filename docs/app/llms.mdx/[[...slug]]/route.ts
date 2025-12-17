import { notFound } from "next/navigation";
import { getLLMText, getPage, getPages } from "@/app/source";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
    const { slug } = await params;
    const page = getPage(slug);

    if (!page) {
        notFound();
    }

    return new Response(await getLLMText(page), {
        headers: {
            "Content-Type": "text/markdown",
        },
    });
}

export function generateStaticParams() {
    return getPages().map(page => ({
        slug: page.slugs,
    }));
}
