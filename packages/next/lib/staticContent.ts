import { useEffect, useRef, useState } from "react";

export const useStaticContent = () => {
    const ref = useRef<{ innerHTML: string } | null>(null);
    const [render, setRender] = useState(typeof window === "undefined");

    useEffect(() => {
        // check if the innerHTML is empty as client side navigation
        // need to render the component without server-side backup
        const isEmpty = ref.current?.innerHTML === "";
        if (isEmpty) {
            setRender(true);
        }
    }, []);

    return [render, ref];
};
