"use client";

import { FC, PropsWithChildren, useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";

export interface AccordionProps {
    headline: string;
    isDefaultOpen?: boolean;
    className?: string;
}

export const Accordion: FC<PropsWithChildren<AccordionProps>> = ({
    headline,
    isDefaultOpen = false,
    className,
    children,
}) => {
    const [isOpen, setOpen] = useState(!!isDefaultOpen);

    return (
        <div className={clsx(styles.wrapper, isOpen && styles.open, className)}>
            <button
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-label={`${isOpen ? "Collapse" : "Expand"}: ${headline}`}
                type="button"
                className={styles.head}>
                {headline}
                <div className={styles.chevron} aria-hidden>
                    ↓
                </div>
            </button>
            <div aria-hidden={!isOpen} className={styles.frame}>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
};
