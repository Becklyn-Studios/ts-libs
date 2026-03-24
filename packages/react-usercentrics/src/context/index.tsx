import React, { PropsWithChildren, createContext, useContext } from "react";
import { useUsercentricsHook } from "../hook";
import { UCCmp } from "../types";

export interface UsercentricsData {
    cmp: UCCmp | null;
    consentUpdate: number;
    isInitialized: boolean;
    showFirstLayer: () => void;
    showSecondLayer: () => void;
    showServiceDetails: (serviceId: string) => void;
    acceptService: (serviceId: string) => void;
    isServiceAccepted: (serviceId: string) => boolean;
}

export const UsercentricsContext = createContext<UsercentricsData>({} as UsercentricsData);

export interface UsercentricsProps {
    windowEvent?: string;
    debug?: boolean;
}

export const UsercentricsProvider: React.FC<PropsWithChildren<UsercentricsProps>> = ({
    children,
    ...props
}) => {
    const data = useUsercentricsHook(props);

    return <UsercentricsContext.Provider value={data}>{children}</UsercentricsContext.Provider>;
};

export const useUsercentrics = () => useContext(UsercentricsContext);
