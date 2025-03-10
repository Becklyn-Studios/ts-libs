"use client";

import { useEffect, useState } from "react";

export interface UseIntersectionProps {
    ref: React.MutableRefObject<HTMLElement | null>;
    defaultValue?: boolean;
    callback?: (entry: IntersectionObserverEntry, isVisible: boolean) => void;
    filter?: (entry: IntersectionObserverEntry) => boolean;
    dependencies?: React.DependencyList[] | null;
    options?: IntersectionObserverInit;
}

export const useIntersection = ({
    ref,
    defaultValue = false,
    callback,
    filter,
    options,
    dependencies,
}: UseIntersectionProps) => {
    const [visible, setVisible] = useState(defaultValue);
    const { current } = ref;

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const isVisible = filter ? filter(entry) : entry.isIntersecting;
                setVisible(isVisible);
                if (callback) {
                    callback(entry, isVisible);
                }
            });
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, ...(dependencies ?? [])]);

    return visible;
};
