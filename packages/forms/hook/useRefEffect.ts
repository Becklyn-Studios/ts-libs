import { useRef } from "react";

export const useRefEffect = <T>(state: T) => {
    const value = useRef(state);
    value.current = state;

    return value;
};
