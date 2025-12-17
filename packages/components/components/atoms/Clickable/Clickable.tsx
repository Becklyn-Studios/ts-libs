import React, { AnchorHTMLAttributes, FC, PropsWithChildren } from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./Clickable.module.scss";

interface ClickableProps {
    href: string;
    type: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "tertiary";
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}

const ClickableWrapperComponent: FC<PropsWithChildren<ClickableProps>> = ({
    children,
    ...props
}) => {
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

export const Clickable: FC<PropsWithChildren<ClickableProps>> = props => {
    const { variant, disabled, className, ...restProps } = props;

    return (
        <ClickableWrapperComponent
            {...restProps}
            className={clsx(
                styles.clickable,
                variant ? styles[variant] : undefined,
                disabled && styles.disabled,
                className
            )}>
            {props.children}
        </ClickableWrapperComponent>
    );
};
