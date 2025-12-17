import { getLLMText, getPages } from "@/app/source";

export const revalidate = false;

export async function GET() {
    const scan = getPages().map(getLLMText);
    const scanned = await Promise.all(scan);

    return new Response(scanned.join("\n\n"));
}
