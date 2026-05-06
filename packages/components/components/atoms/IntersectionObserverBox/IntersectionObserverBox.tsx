"use client";

import { FC, PropsWithChildren, useRef } from "react";
import clsx from "clsx";
import { UseIntersectionProps, useIntersection } from "@becklyn/next/lib/intersection";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./IntersectionObserverBox.module.scss";

export type IntersectionObserverBoxProps = Omit<UseIntersectionProps, "ref"> & PropsWithClassName;

export const IntersectionObserverBox: FC<PropsWithChildren<IntersectionObserverBoxProps>> = ({
    children,
    className,
    defaultValue,
    callback,
    filter,
    dependencies,
    options,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersection({
        ref,
        defaultValue,
        callback,
        filter,
        dependencies,
        options,
    });

    return (
        <div ref={ref} className={clsx(styles.box, isVisible && styles.visible, className)}>
            {children ?? (isVisible ? "In viewport" : "Out of viewport")}
        </div>
    );
};
