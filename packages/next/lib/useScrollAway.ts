"use client";

import { useEffect } from "react";

export const useScrollAway = (
    elementId: string,
    options?: {
        scrollContainerQuery?: string;
        elementHeight?: number;
        reverseDirection?: boolean;
    }
) => {
    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        const element = document.getElementById(elementId);
        if (!element) {
            return;
        }

        const { scrollContainerQuery, elementHeight, reverseDirection = false } = options || {};

        const scrollContainer = scrollContainerQuery
            ? document.querySelector<HTMLElement>(scrollContainerQuery)
            : null;

        const scrollAnchor = scrollContainer || document.documentElement;
        const distanceToTransform = elementHeight ?? element.offsetHeight;

        let lastScrollPosition = scrollAnchor.scrollTop;
        let ticking = false;

        const update = () => {
            const currentScroll = scrollAnchor.scrollTop;
            const isScrollingDown = currentScroll > lastScrollPosition;

            const shouldHide = reverseDirection ? !isScrollingDown : isScrollingDown;

            if (currentScroll >= distanceToTransform && shouldHide) {
                element.style.transform = `translateY(${-distanceToTransform}px)`;
            } else {
                element.style.transform = "translateY(0)";
            }

            lastScrollPosition = currentScroll;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        };

        const targetElement = scrollContainer || window;
        targetElement.addEventListener("scroll", handleScroll, { passive: true });

        return () => targetElement.removeEventListener("scroll", handleScroll);
    }, [elementId, options]);
};
