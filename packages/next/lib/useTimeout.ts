"use client";

import { useCallback, useRef } from "react";

export const useTimeout = (
    callback: (executions: number) => void,
    duration: number,
    maxExecutions?: number
) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const executions = useRef(0);

    const startTimeout = useCallback(() => {
        if (undefined !== maxExecutions && maxExecutions <= executions.current) {
            return;
        }

        executions.current++;

        timeoutRef.current = setTimeout(() => {
            callback(executions.current);
        }, duration);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cancelTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return { startTimeout, cancelTimeout };
};
