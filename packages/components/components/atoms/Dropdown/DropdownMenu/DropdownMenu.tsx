"use client";

import { type FC, PropsWithChildren } from "react";
import {
    DropdownItem,
    DropdownItemProps,
} from "@becklyn/components/components/atoms/Dropdown/DropdownItem/DropdownItem";
import { UseInteractionsReturn } from "@floating-ui/react";
import styles from "./DropdownMenu.module.scss";

export interface DropdownMenuProps {
    ref?: React.RefObject<HTMLUListElement | null>;
    setFloating?: (node: HTMLElement | null) => void;
    getFloatingProps?: UseInteractionsReturn["getFloatingProps"];
    options?: DropdownItemProps[];
    value?: string | number | string[] | number[];
    setValue?: (value: string | number) => void;
    id?: string;
    style?: React.CSSProperties;
    multiSelect?: boolean;
}

export const DropdownMenu: FC<PropsWithChildren<DropdownMenuProps>> = ({
    ref,
    setFloating,
    getFloatingProps,
    options,
    value,
    setValue,
    id,
    style,
    children,
    multiSelect = false,
}) => {
    const isOptionSelected = (optionValue: string | number) => {
        if (Array.isArray(value)) {
            return value.some(val => val === optionValue);
        }

        return value === optionValue;
    };

    return (
        <div
            ref={setFloating}
            style={style}
            className={styles.dropdownContainer}
            {...getFloatingProps?.()}>
            <ul ref={ref} className={styles.dropdown} id={`${id}-dropdown`} role="listbox">
                {options?.length
                    ? options.map(option => (
                          <li key={option.value}>
                              <DropdownItem
                                  label={option.label}
                                  selected={isOptionSelected(option.value)}
                                  disabled={option.disabled}
                                  onClick={() => {
                                      setValue?.(option.value);
                                  }}
                                  value={option.value}
                                  multiSelect={multiSelect}
                              />
                          </li>
                      ))
                    : children}
            </ul>
        </div>
    );
};
