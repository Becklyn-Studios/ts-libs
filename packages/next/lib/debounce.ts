export const debounce = (func: () => void, wait: number): (() => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return () => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(func, wait);
    };
};
