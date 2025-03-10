"use client";

import {
    DependencyList,
    FC,
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
} from "react";
import Script from "next/script";
import { DataLayerData } from "./types";

export interface GtmProviderProps {
    hasConsent: boolean;
    onBeforeGtmSetup?: () => void;
    onAfterGtmSetup?: () => void;
}

export interface GtmProviderData {
    hasConsent: boolean;
}

const Context = createContext<GtmProviderData>({} as GtmProviderData);

export const GtmProvider: FC<PropsWithChildren<GtmProviderProps>> = ({
    hasConsent,
    onBeforeGtmSetup,
    onAfterGtmSetup,
    children,
}) => {
    useDataEventForwarder(hasConsent);

    useEffect(() => {
        if (onBeforeGtmSetup) {
            onBeforeGtmSetup();
        }

        window.dataLayer = window.dataLayer || [];

        window.gtag = window.gtag || ((...arg) => window.dataLayer!.push(arg));

        if (onAfterGtmSetup) {
            onAfterGtmSetup();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Context.Provider value={{ hasConsent }}>
            {hasConsent && (
                <Script id="google-tag-manager" data-cookieconsent="marketing">
                    {`
                      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://dt.visit-bw.com/dt.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
                    `}
                </Script>
            )}
            {children}
        </Context.Provider>
    );
};

export const useGtm = () => useContext(Context);

export const withGtm = <P extends {} & GtmProviderProps>(Component: FC<P>) => {
    return (props: P) => (
        <GtmProvider {...props}>
            <Component {...props} />
        </GtmProvider>
    );
};

export const useDataLayer = (input: DataLayerData, deps: DependencyList = []) => {
    const hasConsent = useGtm();

    useEffect(() => {
        if (!hasConsent) {
            return;
        }

        const data = typeof input === "function" ? input() : input;

        if (!data) {
            return;
        }

        if (window.dataLayer) {
            window.dataLayer.push(data);
        } else {
            window.dataLayer = [data];
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasConsent, input, ...deps]);
};

export const useLazyDataLayer = () => {
    const { hasConsent } = useGtm();

    return (input: DataLayerData) => {
        if (!hasConsent || !input) {
            return;
        }

        const data = typeof input === "function" ? input() : input;

        if (window.dataLayer) {
            window.dataLayer.push(data);
        } else {
            window.dataLayer = [data];
        }
    };
};

export const useDataEventForwarder = (hasConsent: boolean) => {
    useLayoutEffect(() => {
        const captureDataEvent = (event: MouseEvent) => {
            if (!hasConsent) {
                return;
            }

            const target = event.target as Element;

            if (!target) {
                return;
            }

            const element = target.closest("*[data-event]");

            if (!element) {
                return;
            }

            const dataEvent = element.getAttribute("data-event") ?? undefined;
            const classList = element.classList ? element.classList.toString() : undefined;
            const className = element.className;
            const text = "innerText" in element ? (element.innerText as string) : undefined;

            const data = {
                event: "websiteClick",
                dataEvent,
                classList,
                className,
                text,
            };

            if (window.dataLayer) {
                window.dataLayer.push(data);
            } else {
                window.dataLayer = [data];
            }
        };

        document.addEventListener("click", captureDataEvent);

        return () => {
            document.removeEventListener("click", captureDataEvent);
        };
    }, [hasConsent]);
};
