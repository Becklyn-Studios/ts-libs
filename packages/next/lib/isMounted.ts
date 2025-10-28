import { useEffect, useLayoutEffect, useState } from "react";

export const useIsMounted = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted;
};

export const useIsLayoutMounted = () => {
    const [isLayoutMounted, setIsLayoutMounted] = useState(false);

    useLayoutEffect(() => {
        setIsLayoutMounted(true);
    }, []);

    return isLayoutMounted;
};
