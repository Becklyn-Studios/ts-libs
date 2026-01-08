import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import Link from "next/link";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./Clickable.module.scss";

interface ClickableProps {
    href: string;
    type: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "tertiary";
    disabled?: boolean;
    onClick?: () => void;
}

const ClickableWrapperComponent: FC<PropsWithChildren<PropsWithClassName<ClickableProps>>> = ({
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
            {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
            {children}
        </button>
    );
};

export const Clickable: FC<PropsWithChildren<PropsWithClassName<ClickableProps>>> = props => {
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
