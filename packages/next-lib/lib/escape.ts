import { DependencyList, useEffect } from "react";

export const useEscapeListener = (callback: (e: KeyboardEvent) => void, deps?: DependencyList) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                callback(e);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
