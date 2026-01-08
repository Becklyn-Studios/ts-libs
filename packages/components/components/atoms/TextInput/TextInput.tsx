"use client";

import { FC, useId } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./TextInput.module.scss";

export interface TextInputProps {
    id?: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export const TextInput: FC<PropsWithClassName<TextInputProps>> = ({
    id: providedId,
    label,
    placeholder,
    value,
    error,
    onChange,
    disabled,
    required,
    className,
}) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <div className={styles.content}>
                <input
                    id={id}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={clsx(styles.input, disabled && styles.disabled)}
                />
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
};
