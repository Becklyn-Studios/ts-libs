"use client";

import { useEffect, useLayoutEffect, useState } from "react";

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

export interface UseIntersectionsProps {
    observed: NodeListOf<Element> | null;
    callback?: (entry: IntersectionObserverEntry, isVisible: boolean) => void;
    filter?: (entry: IntersectionObserverEntry) => boolean;
    dependencies?: React.DependencyList[] | null;
    options?: IntersectionObserverInit;
}

export const useIntersections = ({ observed }: UseIntersectionsProps) => {
    const [visibleIndex, setIndexVisible] = useState<number | null>(null);
    useLayoutEffect(() => {
        if (!observed) {
            return;
        }

        const detach: (() => void)[] = [];

        observed.forEach((ref, index) => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id = entry.target.id;

                    if (!id) {
                        return;
                    }

                    setIndexVisible(index);
                });
            });

            if (ref) {
                observer.observe(ref);
            }

            detach.push(() => observer.disconnect());
        });

        return () => detach.forEach(cb => cb());
    }, [observed]);

    return visibleIndex;
};
