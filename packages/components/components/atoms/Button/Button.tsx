import React, { AnchorHTMLAttributes, FC } from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./Button.module.scss";
import { ButtonProps, ButtonSchema } from "./ButtonSchema";

const ButtonWrapperComponent: FC<ButtonProps> = ({ children, ...props }) => {
    return props.href ? (
        <Link href={props.href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
            {children}
        </Link>
    ) : (
        <button
            type={props.type || "button"}
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
            {children}
        </button>
    );
};

export const Button: FC<ButtonProps> = props => {
    const validatedProps = ButtonSchema.safeParse(props);

    if (!validatedProps.data) {
        return undefined;
    }

    const {
        children,
        variant = "primary",
        disabled = false,
        className = "",
        ...restProps
    } = validatedProps.data;

    return (
        <ButtonWrapperComponent
            {...restProps}
            className={clsx(
                styles.button,
                styles[variant],
                disabled && styles.disabled,
                className
            )}>
            {children}
        </ButtonWrapperComponent>
    );
};
