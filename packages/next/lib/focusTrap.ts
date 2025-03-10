import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

export const checkCanFocusTrap = async (container: (HTMLElement | SVGElement)[]) => {
    const results = container.map(element => {
        return new Promise<void>(resolve => {
            const interval = setInterval(() => {
                if (getComputedStyle(element).visibility !== "hidden") {
                    resolve();
                    clearInterval(interval);
                }
            }, 5);
        });
    });

    await Promise.all(results);
};

export const FOCUSABLE_ELEMENTS =
    'button:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([tabindex="-1"]), select:not([tabindex="-1"]), textarea:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

type UseTrapFocus<T> = [
    MutableRefObject<T | null>,
    {
        update: () => void;
    },
];

export const useTrapFocus = <T extends HTMLElement>(container?: T | null): UseTrapFocus<T> => {
    const ref = useRef<T | null>(null);
    const [nodes, setNodes] = useState<Element[] | null>(null);

    const update = useCallback(() => {
        const el = ref.current || container;

        if (!el) {
            return;
        }

        setNodes(Array.from(el.querySelectorAll(FOCUSABLE_ELEMENTS)));
    }, [container]);

    useEffect(() => {
        const el = ref.current || container;

        if (!el) {
            return;
        }

        update();
    }, [container, update]);

    useEffect(() => {
        const el = ref.current || container;

        if (!el || !nodes) {
            return;
        }

        const firstFocusableElement = nodes[0] as HTMLElement;
        const lastFocusableElement = nodes[nodes.length - 1] as HTMLElement;

        const onKeyDown = (e: KeyboardEvent) => {
            const isTabPressed = e.key === "Tab" || e.keyCode === 9;

            if (!isTabPressed) {
                return;
            }

            if (e.shiftKey && document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            } else if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        };

        el.focus();

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [container, nodes]);

    return [ref, { update }];
};
