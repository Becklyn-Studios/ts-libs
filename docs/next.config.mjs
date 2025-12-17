import { createMDX } from "fumadocs-mdx/next";

export default createMDX()({
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/docs/:path*.mdx",
                destination: "/llms.mdx/:path*",
            },
        ];
    },
});
