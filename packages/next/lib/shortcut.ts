import { DependencyList, useEffect } from "react";

export const useShortcut = (
    key: string | string[],
    callback: (e: KeyboardEvent) => void,
    deps?: DependencyList
) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            let input = "";

            if (e.metaKey) {
                input += "meta-";
            }

            if (e.altKey) {
                input += "alt-";
            }

            if (e.shiftKey) {
                input += "shift-";
            }

            if (e.ctrlKey) {
                input += "ctrl-";
            }

            input += e.key;
            console.log(input);

            if (Array.isArray(key) ? key.includes(input) : input === key) {
                callback(e);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
