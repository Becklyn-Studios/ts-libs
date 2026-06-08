"use client";

import { FC, PropsWithChildren, useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";

const headId = `accordion-head`;
const frameId = `accordion-frame`;

export interface AccordionProps {
    headline: string;
    isDefaultExpanded?: boolean;
    className?: string;
}

export const Accordion: FC<PropsWithChildren<AccordionProps>> = ({
    headline,
    isDefaultExpanded = false,
    className,
    children,
}) => {
    const [isExpanded, setExpanded] = useState(!!isDefaultExpanded);

    return (
        <div className={clsx(styles.wrapper, isExpanded && styles.expanded, className)}>
            <h3>
                <button
                    id={headId}
                    onClick={() => setExpanded(prev => !prev)}
                    aria-expanded={isExpanded}
                    aria-controls={frameId}
                    type="button"
                    className={styles.head}>
                    {headline}
                    <div className={styles.chevron} aria-hidden>
                        ↓
                    </div>
                </button>
            </h3>
            <div
                id={frameId}
                aria-labelledby={headId}
                inert={!isExpanded}
                role="region"
                className={styles.frame}>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
};
