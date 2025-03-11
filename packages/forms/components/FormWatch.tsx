import React, { ReactNode } from "react";
import { useFormData } from "../hook/useFormData";

interface WatchFormValueProps {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: (value: any) => ReactNode;
}

export const FormWatch: React.FC<WatchFormValueProps> = ({ name, children }) => {
    const [value] = useFormData(store => (name ? store[name] : store));

    return <React.Fragment>{children(value)}</React.Fragment>;
};
