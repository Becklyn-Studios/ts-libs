"use client";

import type { ChangeEvent, FC } from "react";
import { type InputHTMLAttributes, useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
    DropdownItem,
    DropdownItemProps,
} from "@becklyn/components/components/atoms/Dropdown/DropdownItem/DropdownItem";
import { DropdownMenu } from "@becklyn/components/components/atoms/Dropdown/DropdownMenu/DropdownMenu";
import { ChevronDown20 } from "@becklyn/components/components/icons/ChevronDown20";
import {
    FloatingFocusManager,
    FloatingPortal,
    autoUpdate,
    flip,
    offset,
    size,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useListNavigation,
    useRole,
} from "@floating-ui/react";
import styles from "./Autocomplete.module.scss";

export interface AutocompleteSchema {
    id?: string;
    value?: string | number;
    options: DropdownItemProps[];
    placeholder?: string;
    label?: string;
    className?: string;
    onChange?: (value: string | number) => void;
    onUpdateInputValue?: (value: string) => void;
    hasError?: boolean;
}

export type AutocompleteProps = AutocompleteSchema &
    Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur" | "onFocus">;

const normalizeString = (str: string): string => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
};

export const Autocomplete: FC<AutocompleteProps> = ({
    id,
    value,
    options,
    placeholder,
    label,
    className,
    onChange,
    onUpdateInputValue,
    hasError,
    ...restProps
}) => {
    const generatedId = useId();

    const inputId = id || generatedId;

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const filteredOptions = useMemo(() => {
        if (!inputValue) {
            return options;
        }

        const normalizedInput = normalizeString(inputValue);
        return options.filter(option => {
            const normalizedLabel = normalizeString(option.label);
            return normalizedLabel.includes(normalizedInput);
        });
    }, [inputValue, options]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onUpdateInputValue?.(newValue);

        if (
            newValue === "" ||
            (selectedIndex !== null &&
                newValue.length < (filteredOptions[selectedIndex]?.label?.length ?? 0))
        ) {
            clearSelected();
        }

        if (newValue && !isOpen) {
            setIsOpen(true);
        }
    };

    const [activeIndex, setActiveIndex] = useState<number | null>(
        value ? filteredOptions.findIndex(option => String(option.value) === value) : null
    );
    const selectedIndex = value
        ? filteredOptions.findIndex(option => String(option.value) === value)
        : null;

    const clearSelected = () => {
        setActiveIndex(null);
        onChange?.("");
    };

    const { refs, floatingStyles, context } = useFloating<HTMLElement>({
        placement: "bottom-start",
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(0),
            flip({ padding: 10 }),
            size({
                apply({ rects, elements, availableHeight }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${availableHeight}px`,
                        minWidth: `${rects.reference.width}px`,
                        maxWidth: `${rects.reference.width}px`,
                    });
                },
                padding: 10,
            }),
        ],
    });

    const listRef = useRef<Array<HTMLElement | null>>([]);

    const click = useClick(context, { event: "mousedown" });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
        // This is a large list, allow looping.
        loop: true,
        focusItemOnHover: false,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        dismiss,
        role,
        listNav,
        click,
    ]);

    const getDisplayValue =
        inputValue ||
        (value && filteredOptions.find(option => String(option.value) === value)?.label) ||
        "";

    const handleSelect = (index: number) => {
        setIsOpen(false);
        onChange?.(filteredOptions[index]?.value || "");
        setInputValue("");
        onUpdateInputValue?.("");
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={clsx(styles.autocompleteContainer, className)}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.autocompleteWrapper}>
                <button
                    ref={refs.setReference}
                    tabIndex={-1}
                    className={clsx(
                        styles.autocomplete,
                        isOpen && styles.open,
                        hasError && styles.hasError
                    )}
                    {...getReferenceProps()}
                    onClick={() => {
                        inputRef.current?.focus();
                        setIsOpen(true);
                    }}>
                    <input
                        id={inputId}
                        ref={inputRef}
                        type="text"
                        value={getDisplayValue}
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        className={styles.input}
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        aria-controls={`${inputId}-dropdown`}
                        aria-autocomplete="list"
                        onKeyDown={event => {
                            if (event.key === " " || event.code === "Space") {
                                event.stopPropagation();
                                return;
                            }
                        }}
                        {...restProps}
                    />
                    <ChevronDown20 aria-hidden className={styles.chevronDownIcon} />
                </button>
            </div>

            {isOpen && filteredOptions.length > 0 && (
                <FloatingPortal>
                    <FloatingFocusManager context={context} modal={false} initialFocus={inputRef}>
                        <DropdownMenu
                            // eslint-disable-next-line react-hooks/refs
                            setFloating={refs.setFloating}
                            getFloatingProps={getFloatingProps}
                            style={floatingStyles}>
                            {filteredOptions.map(({ value, label, disabled }, index) => (
                                <li key={index}>
                                    <DropdownItem
                                        role="option"
                                        ref={node => {
                                            listRef.current[index] = node;
                                        }}
                                        {...getItemProps({
                                            // Handle pointer select.
                                            onClick() {
                                                handleSelect(index);
                                            },
                                            // Handle keyboard select.
                                            onKeyDown(event) {
                                                if (event.key === "Enter") {
                                                    event.preventDefault();
                                                    handleSelect(index);
                                                }

                                                if (event.key === " ") {
                                                    event.preventDefault();
                                                    handleSelect(index);
                                                }
                                            },
                                        })}
                                        label={label}
                                        value={value}
                                        disabled={disabled}
                                        selected={selectedIndex === index}
                                    />
                                </li>
                            ))}
                        </DropdownMenu>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </div>
    );
};
