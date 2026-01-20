"use client";

import { FC, useEffect, useRef, useState } from "react";
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
    useTypeahead,
} from "@floating-ui/react";
import styles from "./Dropdown.module.scss";

export interface DropdownSchemaBase {
    label?: string;
    placeholder?: string;
    options: DropdownItemProps[];
    disabled?: boolean;
    className?: string;
}

export interface DropdownSchemaSingle extends DropdownSchemaBase {
    value?: string;
    setValue: (value: string) => void;
    multiSelect?: false;
}

export interface DropdownSchemaMulti extends DropdownSchemaBase {
    value: string[];
    setValue: (value: string[]) => void;
    multiSelect: true;
}

export type DropdownProps = DropdownSchemaSingle | DropdownSchemaMulti;

export const Dropdown: FC<DropdownProps> = ({
    options,
    label,
    placeholder,
    value,
    setValue,
    className,
    multiSelect,
    disabled,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

    // Sync selectedIndexes with value prop changes
    useEffect(() => {
        if (value === undefined) {
            setSelectedIndexes([]);
            return;
        }

        const newSelectedIndexes = Array.isArray(value)
            ? value
                  .map(val => options.findIndex(option => String(option.value) === val))
                  .filter(index => index !== -1)
            : [options.findIndex(option => String(option.value) === value)].filter(
                  index => index !== -1
              );

        setSelectedIndexes(prevIndexes =>
            prevIndexes.length !== newSelectedIndexes.length ||
            !prevIndexes.every((index, i) => index === newSelectedIndexes[i])
                ? newSelectedIndexes
                : prevIndexes
        );
    }, [value, options]);

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
    const listContentRef = useRef(options.map(option => option.value.toString()));
    const isTypingRef = useRef(false);

    const click = useClick(context, { event: "mousedown" });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        selectedIndex: multiSelect ? undefined : selectedIndexes[0],
        onNavigate: setActiveIndex,
        // This is a large list, allow looping.
        loop: true,
        focusItemOnHover: false,
    });
    const typeahead = useTypeahead(context, {
        listRef: listContentRef,
        activeIndex,
        selectedIndex: multiSelect ? undefined : selectedIndexes[0],
        onMatch: isOpen ? setActiveIndex : (index: number) => setSelectedIndexes([index]),
        onTypingChange(isTyping) {
            isTypingRef.current = isTyping;
        },
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        dismiss,
        role,
        listNav,
        typeahead,
        click,
    ]);

    const handleSelect = (index: number) => {
        if (multiSelect) {
            const newSelectedIndexes = selectedIndexes.includes(index)
                ? selectedIndexes.filter(i => i !== index)
                : [...selectedIndexes, index];
            setValue(newSelectedIndexes.map(idx => options[idx]?.value.toString() || ""));
            setSelectedIndexes(newSelectedIndexes);
        } else {
            setSelectedIndexes([index]);
            setIsOpen(false);
            setValue(options[index]?.value.toString() || "");
        }
    };

    const selectedItemLabel = multiSelect
        ? selectedIndexes.join(", ")
        : selectedIndexes[0] !== undefined
          ? options[selectedIndexes[0]]?.label
          : undefined;

    return (
        <div className={clsx(styles.dropdown, className)}>
            {label && <span className={styles.dropdownLabel}>{label}</span>}
            <button
                disabled={disabled}
                type="button"
                tabIndex={0}
                ref={refs.setReference}
                aria-labelledby="select-label"
                aria-autocomplete="none"
                className={clsx(styles.dropdownButton, isOpen && styles.open)}
                {...getReferenceProps()}>
                <span>{selectedItemLabel || placeholder}</span>
                <ChevronDown20 aria-hidden className={styles.dropdownButtonIcon} />
            </button>
            {isOpen && (
                <FloatingPortal>
                    <FloatingFocusManager context={context} modal={false}>
                        <DropdownMenu
                            // eslint-disable-next-line react-hooks/refs
                            setFloating={refs.setFloating}
                            getFloatingProps={getFloatingProps}
                            style={floatingStyles}
                            multiSelect={multiSelect}>
                            {options.map(
                                // eslint-disable-next-line react-hooks/refs
                                ({ value: optionValue, label, disabled }, index) => (
                                    <li key={index}>
                                        <DropdownItem
                                            multiSelect={multiSelect}
                                            role="option"
                                            ref={node => {
                                                listRef.current[index] = node;
                                            }}
                                            tabIndex={index === activeIndex ? 0 : -1}
                                            aria-selected={selectedIndexes.includes(index)}
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

                                                    if (event.key === " " && !isTypingRef.current) {
                                                        event.preventDefault();
                                                        handleSelect(index);
                                                    }
                                                },
                                            })}
                                            label={label}
                                            value={optionValue}
                                            disabled={disabled}
                                            selected={selectedIndexes.includes(index)}
                                        />
                                    </li>
                                )
                            )}
                        </DropdownMenu>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </div>
    );
};
