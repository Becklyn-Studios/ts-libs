"use client";

import { useCallback, useEffect, useRef } from "react";

export const useInterval = (
    callback: (executions: number) => void,
    interval: number,
    maxExecutions?: number
) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const executions = useRef(0);

    const startInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        executions.current = 0;

        intervalRef.current = setInterval(() => {
            executions.current++;
            callback(executions.current);

            if (undefined !== maxExecutions && executions.current >= maxExecutions) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        }, interval);
    }, [callback, interval, maxExecutions]);

    const cancelInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { startInterval, cancelInterval };
};
