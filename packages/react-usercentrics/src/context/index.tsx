import React, { PropsWithChildren, createContext, useContext } from "react";
import { useUsercentricsHook } from "../hook";
import { ServiceStates, UC } from "../types";

export interface UsercentricsData {
    cmp: UC | null;
    consentUpdate: number;
    isInitialized: boolean;
    showFirstLayer: () => void;
    showSecondLayer: (serviceId?: string) => void;
    acceptService: (serviceId: string) => void;
    isServiceAccepted: (serviceId: string) => Promise<boolean>;
}

export const UsercentricsContext = createContext<UsercentricsData>({} as UsercentricsData);

export interface UsercentricsProps {
    windowEvent?: string;
    forceReload?: ServiceStates;
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
