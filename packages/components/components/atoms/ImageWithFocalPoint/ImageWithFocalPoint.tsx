import type { FC } from "react";
import Image from "next/image";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./ImageWithFocalPoint.module.scss";

export interface ImageWithFocalPointProps {
    asset: {
        src: string;
        width: number;
        height: number;
    };
    focalPoint?: {
        x?: number;
        y?: number;
    };
    priority?: boolean;
    sizes?: string;
    ignoreAspectRatio?: boolean;
}

export const ImageWithFocalPoint: FC<PropsWithClassName<ImageWithFocalPointProps>> = ({
    asset,
    sizes,
    priority,
    alt,
    ignoreAspectRatio,
    className,
    focalPoint,
    ...props
}) => {
    if (!asset || !asset.src) {
        return null;
    }

    const { height, width, src } = asset;

    let objectPosition = "center";

    if (!!focalPoint && !!focalPoint.x && !!focalPoint.y) {
        const x = (100 / width) * focalPoint.x;
        const y = (100 / height) * focalPoint.y;

        objectPosition = x <= 100 && y <= 100 ? `${x}% ${y}%` : `50% 50%`;
    } else {
        objectPosition = "50% 50%";
    }

    return (
        <div
            className={clsx(styles.imageWrapper, className, "imageWithFocalPoint")}
            style={{ aspectRatio: !ignoreAspectRatio ? width / height : undefined }}>
            <Image
                src={src}
                alt={alt ?? ""}
                width={width}
                height={height}
                priority={priority}
                sizes={sizes}
                className={styles.image}
                style={{ objectPosition }}
                {...props}
            />
        </div>
    );
};
