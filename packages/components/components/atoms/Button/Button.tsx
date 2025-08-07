import React, { AnchorHTMLAttributes, FC, PropsWithChildren } from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./Button.module.scss";
import { ButtonProps, ButtonSchema } from "./ButtonSchema";

const ButtonWrapperComponent: FC<PropsWithChildren<ButtonProps>> = ({ children, ...props }) => {
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

export const Button: FC<PropsWithChildren<ButtonProps>> = props => {
    const validatedProps = ButtonSchema.safeParse(props);

    if (!validatedProps.data) {
        return undefined;
    }

    const { variant, disabled, className, ...restProps } = validatedProps.data;

    return (
        <ButtonWrapperComponent
            {...restProps}
            className={clsx(
                styles.button,
                styles[variant],
                disabled && styles.disabled,
                className
            )}>
            {props.children}
        </ButtonWrapperComponent>
    );
};
