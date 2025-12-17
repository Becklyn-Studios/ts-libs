import { useEffect, useLayoutEffect, useState } from "react";

export const useIsMounted = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    return isMounted;
};

export const useIsLayoutMounted = () => {
    const [isLayoutMounted, setIsLayoutMounted] = useState(false);

    useLayoutEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLayoutMounted(true);
    }, []);

    return isLayoutMounted;
};
