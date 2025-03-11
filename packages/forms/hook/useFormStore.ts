import { useCallback, useMemo, useRef } from "react";

export interface FormStore<Store> {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
    initialValue: Store;
}

export const useFormStore = <Store>(initialValue: Store): FormStore<Store> => {
    const store = useRef<Store>(initialValue);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
        store.current = { ...store.current, ...value };
        subscribers.current.forEach(callback => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
        subscribers.current.add(callback);
        return () => subscribers.current.delete(callback);
    }, []);

    return useMemo(() => {
        return {
            get,
            set,
            subscribe,
            initialValue,
        };
    }, [get, set, subscribe, initialValue]);
};
