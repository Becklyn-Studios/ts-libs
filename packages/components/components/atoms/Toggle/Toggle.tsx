"use client";

import type { FC } from "react";
import clsx from "clsx";
import { TRACKING } from "@becklyn/next/tracking/index";
import styles from "./Toggle.module.scss";

export interface ToggleProps {
    className?: string;
    label?: string;
    active: boolean;
    onToggle: () => void;
}

export const Toggle: FC<ToggleProps> = ({ className, label, active, onToggle }) => {
    return (
        <button
            data-event={TRACKING.BUTTON}
            className={clsx(styles.container, className)}
            type="button"
            onClick={onToggle}>
            <div className={clsx(styles.box, active && styles.active)}>
                <div className={styles.dot} />
            </div>
            {label && <div className={styles.label}>{label}</div>}
        </button>
    );
};
