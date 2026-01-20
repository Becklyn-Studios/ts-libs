"use client";

import type { FC } from "react";
import clsx from "clsx";
import styles from "./DropdownItem.module.scss";

export interface DropdownItemProps extends React.HTMLAttributes<HTMLButtonElement> {
    ref?: React.Ref<HTMLButtonElement | null>;
    label: string;
    value: string | number;
    selected?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    multiSelect?: boolean;
}

export const DropdownItem: FC<DropdownItemProps> = ({
    ref,
    label,
    selected = false,
    onClick,
    disabled = false,
    multiSelect = false,
    ...props
}) => {
    return (
        <button
            {...props}
            type="button"
            ref={ref}
            className={clsx(
                styles.dropdownItem,
                multiSelect && styles.multi,
                selected && styles.selected,
                disabled && styles.disabled
            )}
            onClick={onClick}
            role="option"
            aria-selected={selected}
            disabled={disabled}>
            {multiSelect && <input type="checkbox" checked={selected} />}
            <span>{label}</span>
        </button>
    );
};
