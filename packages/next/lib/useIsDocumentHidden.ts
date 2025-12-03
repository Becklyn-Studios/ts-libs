import { useEffect, useState } from "react";

export const useIsDocumentHidden = () => {
    const [isDocumentHidden, setIsDocumentHidden] = useState(document.hidden);

    useEffect(() => {
        const handleVisibilityChange = () => setIsDocumentHidden(document.hidden);

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    return isDocumentHidden;
};
