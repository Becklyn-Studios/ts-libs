import { DependencyList, useEffect } from "react";

export const useEscapeListener = (
    callback: (e: KeyboardEvent) => void,
    deps?: DependencyList,
    capture = false
) => {
    useEffect(
        () => {
            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    callback(e);
                }
            };

            document.addEventListener("keydown", onKeyDown, { capture });
            return () => document.removeEventListener("keydown", onKeyDown, { capture });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        deps ? [...deps, capture] : undefined
    );
};
