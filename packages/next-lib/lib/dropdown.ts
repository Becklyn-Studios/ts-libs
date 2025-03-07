import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { Options } from "@popperjs/core";
import { useClickOutside } from "./click";
import { useEscapeListener } from "./escape";
import { useTrapFocus } from "./focusTrap";

interface DropdownOptions extends Partial<Options> {
    isOpen?: boolean;
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
    onClose?: () => void;
}

export const useDropdown = ({
    isOpen: externalIsOpen,
    setIsOpen: externalSetIsOpen,
    onClose,
    ...options
}: DropdownOptions) => {
    const [internalIsOpen, internalSetIsOpen] = useState<boolean>(false);
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

    const [, { update }] = useTrapFocus(popperElement);

    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : internalSetIsOpen;

    const clickOutsideRef = useClickOutside({
        callback: e => {
            if (popperElement && popperElement.contains(e.target as HTMLElement)) {
                return;
            }

            handleClose();
        },
    });

    const popper = usePopper(referenceElement, popperElement, options);
    const { forceUpdate } = popper;

    useEscapeListener(
        e => {
            if (!isOpen || !referenceElement) {
                return;
            }

            if (
                !referenceElement.contains(e.target as HTMLElement) &&
                !(e.target as HTMLElement).contains(popperElement)
            ) {
                return;
            }

            handleClose();
        },
        [referenceElement, popperElement, isOpen]
    );

    useEffect(() => {
        if (!referenceElement) {
            return;
        }

        const observer = new ResizeObserver(() => {
            if (!forceUpdate) {
                return;
            }

            forceUpdate();
        });

        observer.observe(referenceElement);

        return () => observer.disconnect();
    }, [referenceElement, forceUpdate]);

    useEffect(() => {
        if (!popperElement) {
            return;
        }

        const observer = new MutationObserver(() => {
            update();
        });

        observer.observe(popperElement, { subtree: true, attributes: true });

        return () => observer.disconnect();
    }, [popperElement, update]);

    const handleClose = () => {
        if (!isOpen) {
            return;
        }

        setIsOpen(false);

        if (onClose) {
            onClose();
        }
    };

    return {
        isOpen,
        setIsOpen,
        clickOutsideRef,
        referenceElement,
        popperElement,
        setReferenceElement,
        setPopperElement,
        ...popper,
    };
};
