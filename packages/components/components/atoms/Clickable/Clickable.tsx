import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import Link from "next/link";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./Clickable.module.scss";

type ClickableProps = LinkClickable | ButtonClickable;

interface BaseClickable {
    variant?: "primary" | "secondary" | "tertiary";
    disabled?: boolean;
}

interface LinkClickable extends BaseClickable {
    href: string;
}

interface ButtonClickable extends BaseClickable {
    type: "button" | "submit" | "reset";
    onClick?: () => void;
}

const isLinkClickable = (props: ClickableProps): props is LinkClickable => {
    return "href" in props;
};

const ClickableWrapperComponent: FC<PropsWithChildren<PropsWithClassName<ClickableProps>>> = ({
    children,
    ...props
}) => {
    return isLinkClickable(props) ? (
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
