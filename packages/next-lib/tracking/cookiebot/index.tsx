"use client";

import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";
import { CookiebotConsent } from "./types";

export interface CookiebotProviderContextData {
    isLoaded: boolean;
    isOpened: boolean;
    isAccepted: boolean;
    isConsentAnswered: boolean;
    checkConsent: (key: keyof CookiebotConsent) => boolean;
    openWidget: () => void;
    closeWidget: () => void;
    consent: CookiebotConsent;
    consentUpdate: number;
}

export const CookiebotProviderContext = createContext<CookiebotProviderContextData>(
    {} as CookiebotProviderContextData
);

const closeWidget = () => {
    if (typeof window !== "undefined") {
        window?.Cookiebot?.hide();
    }
};
const openWidget = () => {
    if (typeof window !== "undefined") {
        window?.Cookiebot?.show();
    }
};

export interface CookiebotProviderProps {
    cookieBotId: string;
    locale: string;
}

export const CookiebotProvider: React.FC<PropsWithChildren<CookiebotProviderProps>> = ({
    locale,
    cookieBotId,
    children,
}) => {
    const [consentUpdate, setConsentUpdate] = useState(0);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isConsentAnswered, setIsConsentAnswered] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [consent, setConsent] = useState<CookiebotConsent>({
        necessary: false,
        preferences: false,
        statistics: false,
        marketing: false,
        method: null,
    });

    const checkConsent = (key: keyof CookiebotConsent) => isAccepted && isLoaded && !!consent[key];

    useEffect(() => {
        const openedInitHandler = () => {};
        const tagsExecutedHandler = () => {};

        const openedHandler = () => {
            setIsOpened(true);
        };

        const acceptedHandler = () => {
            setIsAccepted(true);
            setIsOpened(false);
            setConsent(window.Cookiebot.consent ?? {});
            setConsentUpdate(n => n + 1);
        };

        const declinedHandler = () => {
            setIsAccepted(false);
            setIsOpened(false);
            setConsentUpdate(n => n + 1);
        };

        const readyHandler = () => {
            setIsConsentAnswered(true);
        };

        const loadedHandler = () => {
            setIsLoaded(true);
            setConsent(window.Cookiebot.consent ?? {});
        };

        window.addEventListener("CookiebotOnConsentReady", readyHandler);
        window.addEventListener("CookiebotOnLoad", loadedHandler);
        window.addEventListener("CookiebotOnDialogInit", openedInitHandler);
        window.addEventListener("CookiebotOnDialogDisplay", openedHandler);
        window.addEventListener("CookiebotOnAccept", acceptedHandler);
        window.addEventListener("CookiebotOnDecline", declinedHandler);
        window.addEventListener("CookiebotOnTagsExecuted", tagsExecutedHandler);

        return () => {
            window.removeEventListener("CookiebotOnConsentReady", readyHandler);
            window.removeEventListener("CookiebotOnLoad", loadedHandler);
            window.removeEventListener("CookiebotOnDialogInit", openedInitHandler);
            window.removeEventListener("CookiebotOnDialogDisplay", openedHandler);
            window.removeEventListener("CookiebotOnAccept", acceptedHandler);
            window.removeEventListener("CookiebotOnDecline", declinedHandler);
            window.removeEventListener("CookiebotOnTagsExecuted", tagsExecutedHandler);
        };
    }, []);

    return (
        <CookiebotProviderContext.Provider
            value={{
                openWidget,
                closeWidget,
                isLoaded,
                isOpened,
                isAccepted,
                isConsentAnswered,
                checkConsent,
                consent,
                consentUpdate,
            }}>
            <Script
                id="Cookiebot"
                data-culture={locale.toUpperCase()}
                src={`https://consent.cookiebot.com/uc.js?cbid=${cookieBotId}`}
            />
            {children}
        </CookiebotProviderContext.Provider>
    );
};

export const useCookiebot = () => useContext(CookiebotProviderContext);

export const withCookiebot = <P extends {}>(Component: React.FC<P & CookiebotProviderProps>) => {
    return (props: P & CookiebotProviderProps) => (
        <CookiebotProvider {...props}>
            <Component {...props} />
        </CookiebotProvider>
    );
};
