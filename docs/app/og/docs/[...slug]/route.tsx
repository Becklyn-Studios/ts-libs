import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { generate as DefaultImage } from "fumadocs-ui/og";
import { getPage, getPageImage, getPages } from "@/app/source";

export const revalidate = false;
export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
    const { slug } = await params;
    const page = getPage(slug.slice(0, -1));

    if (!page) {
        notFound();
    }

    return new ImageResponse(
        <DefaultImage
            title={page.data.title}
            description={page.data.description}
            site="Becklyn Libraries Documentation"
        />,
        {
            width: 1200,
            height: 630,
        }
    );
}

export function generateStaticParams() {
    return getPages().map(page => ({
        lang: page.locale,
        slug: getPageImage(page).segments,
    }));
}
