"use client";

import { FC, HTMLAttributes, HTMLInputTypeAttribute, useId } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./TextInput.module.scss";

export interface TextInputProps {
    id?: string;
    name: string;
    label: string;
    defaultValue?: HTMLAttributes<HTMLInputElement>["defaultValue"];
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
    name,
    label,
    defaultValue,
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
                name={name}
                value={value}
                defaultValue={defaultValue}
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
