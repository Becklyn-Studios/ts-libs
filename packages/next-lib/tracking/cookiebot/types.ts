export type CookiebotEventType =
    | "CookiebotCookieAccepted"
    | "CookiebotEmbeddingAccepted"
    | "CookiebotWidgetClosed"
    | "CookiebotWidgetOpened"
    | "CookiebotWidgetLoaded";

export interface CookiebotEvent extends Event {
    type: CookiebotEventType;
}

export interface CookiebotEventMap {
    /** @deprecated in favour of CookiebotEmbeddingAccepted */
    CookiebotCookieAccepted: CookiebotEvent;
    CookiebotEmbeddingAccepted: CookiebotEvent;
    CookiebotWidgetClosed: CookiebotEvent;
    CookiebotWidgetOpened: CookiebotEvent;
    CookiebotWidgetLoaded: CookiebotEvent;
}

export interface CookiebotConsent {
    necessary: boolean;
    preferences: boolean;
    statistics: boolean;
    marketing: boolean;
    method: string | null;
}

export interface CookiebotRegulations {
    gdprApplies: boolean;
    ccpaApplies: boolean;
    lgpdApplies: boolean;
}

declare global {
    interface Window {
        Cookiebot: {
            consent: CookiebotConsent;
            consented: boolean;
            declined: boolean;
            hasResponse: boolean;
            doNotTrack: boolean;
            regulations: CookiebotRegulations;
            show: () => void;
            hide: () => void;
            renew: () => void;
            getScript: (URL: string, async: boolean, callback: () => void) => void;
            runScripts: () => void;
            withdraw: () => void;
            submitCustomConsent: (
                optinPreferences: boolean,
                optinStatistics: boolean,
                optinMarketing: boolean
            ) => void;
        };
        addEventListener<K extends keyof CookiebotEventMap>(
            type: K,
            listener: (this: Window, ev: CookiebotEventMap[K]) => void,
            options?: boolean | EventListenerOptions
        ): void;
        removeEventListener<K extends keyof CookiebotEventMap>(
            type: K,
            listener: (this: HTMLElement, ev: CookiebotEventMap[K]) => any,
            options?: boolean | EventListenerOptions
        ): void;
        dispatchEvent<K extends keyof CookiebotEventMap>(ev: CookiebotEventMap[K]): void;
    }
}
