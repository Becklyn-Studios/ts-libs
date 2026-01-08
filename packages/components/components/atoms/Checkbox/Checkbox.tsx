"use client";

import { FC, PropsWithChildren, useId } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./Checkbox.module.scss";

export interface CheckboxProps {
    id?: string;
    name?: string;
    label?: string;
    disabled?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

export const Checkbox: FC<PropsWithChildren<PropsWithClassName<CheckboxProps>>> = ({
    id: providedId,
    name,
    label,
    checked,
    onChange,
    disabled,
    className,
    children,
}) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
        <div className={clsx(styles.wrapper, className)}>
            <input
                type="checkbox"
                className={styles.input}
                checked={checked ?? false}
                onChange={e => onChange?.(e.target.checked)}
                name={name}
                id={id}
                disabled={disabled}
            />
            {label && (
                <label className={clsx(styles.label, disabled && styles.disabled)} htmlFor={id}>
                    {children ?? label}
                </label>
            )}
        </div>
    );
};
