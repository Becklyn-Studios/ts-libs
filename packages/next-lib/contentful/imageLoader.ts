import { ImageLoaderProps as ImageLoaderProps_ } from "next/image";

export type ImageLoaderFormat = "webp" | "jpeg" | "png";

export interface ImageLoaderProps extends ImageLoaderProps_ {
    format?: ImageLoaderFormat;
}

export const imageLoader = ({ src, width, quality, format = "webp" }: ImageLoaderProps) => {
    let url = src;

    if (!src.startsWith("https")) {
        if (src.startsWith("http")) {
            url = "https" + url.slice(4);
        } else {
            url = `https:${src}`;
        }
    }

    switch (true) {
        case src.includes("ctfassets"):
        case src.includes("contentful"):
            return `${url}?w=${width}&q=${quality || 96}&fm=${format === "jpeg" ? "jpg" : format}`;
        case src.includes("mein.toubiz.de"):
            return `${url}?width=${width}&quality=${quality || 96}&format=image/${format}`;
        default:
            return src;
    }
};
