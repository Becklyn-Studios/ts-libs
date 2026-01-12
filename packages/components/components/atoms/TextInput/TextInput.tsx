"use client";

import { FC, HTMLInputTypeAttribute, useId } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./TextInput.module.scss";

export interface TextInputProps {
    id?: string;
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    type?: HTMLInputTypeAttribute;
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
    type = "text",
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
            <input
                id={id}
                value={value}
                onChange={e => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={clsx(styles.input, disabled && styles.disabled)}
                type={type}
            />
            {error && (
                <output
                    htmlFor={id}
                    name={`${id}_error`}
                    className={styles.error}
                    aria-invalid={true}>
                    {error}
                </output>
            )}
        </div>
    );
};
