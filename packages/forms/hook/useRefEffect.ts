import { useRef } from "react";

export const useRefEffect = <T>(state: T) => {
    const value = useRef(state);
    // eslint-disable-next-line react-hooks/refs
    value.current = state;

    return value;
};
