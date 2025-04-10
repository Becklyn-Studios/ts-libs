import { useCallback, useEffect, useState } from "react";
import { UsercentricsData, UsercentricsProps } from "../context";
import { ServiceStates, UC, UCCMPEvent, UCCustomEvent } from "../types";

export const useUsercentricsHook = ({
    windowEvent = "ucEvent",
    forceReload,
    debug,
}: UsercentricsProps): UsercentricsData => {
    const [cmp, setCmp] = useState<UC | null>(null);
    const [consentUpdate, setConsentUpdate] = useState<number>(0);
    const [serviceStates, setServiceStates] = useState<ServiceStates>({});

    const incrementConsentUpdate = () => setConsentUpdate(prev => ++prev);
    const isInitialized = !!cmp?.isInitialized?.();

    useEffect(() => {
        const onCmpEvent = (event: UCCMPEvent) => {
            if (["ACCEPT_ALL", "DENY_ALL", "SAVE"].includes(event.detail.type)) {
                incrementConsentUpdate();
            }
        };

        window.addEventListener("UC_UI_CMP_EVENT", onCmpEvent);

        return () => window.removeEventListener("UC_UI_CMP_EVENT", onCmpEvent);
    }, []);

    useEffect(() => {
        const onLoad = () => {
            incrementConsentUpdate();

            if (!window.UC_UI) {
                return;
            }

            if (debug) {
                console.log(window.UC_UI);
            }

            setCmp(window.UC_UI);
        };

        window.addEventListener("UC_UI_INITIALIZED", onLoad);
        return () => window.removeEventListener("UC_UI_INITIALIZED", onLoad);
    }, [debug]);

    useEffect(() => {
        const handleCustomEvent = (e: UCCustomEvent) => {
            const details = e.detail;

            if (debug) {
                console.log(details);
            }

            if (details.action !== "onInitialPageLoad") {
                for (const key in details) {
                    const value = details[key];

                    if (serviceStates[key] !== value && forceReload?.[key] === value) {
                        window.location.reload();
                        return;
                    }
                }
            }

            setServiceStates(details);
        };

        const onUcEvent = ((e: UCCustomEvent) => handleCustomEvent(e)) as EventListener;

        window.addEventListener(windowEvent, onUcEvent);
        return () => window.removeEventListener(windowEvent, onUcEvent);
    }, [debug, windowEvent, forceReload, serviceStates]);

    const showFirstLayer = useCallback((): void => {
        if (!cmp || !isInitialized) {
            return;
        }

        cmp.showFirstLayer();
    }, [cmp, isInitialized]);

    const showSecondLayer = useCallback(
        (serviceId?: string): void => {
            if (!cmp || !isInitialized) {
                return;
            }

            cmp.showSecondLayer(serviceId);
        },
        [cmp, isInitialized]
    );

    const acceptService = useCallback(
        (serviceId: string): void => {
            if (!cmp || !isInitialized) {
                return;
            }

            cmp.acceptService(serviceId);
        },
        [cmp, isInitialized]
    );

    const isServiceAccepted = useCallback(
        (serviceId: string): boolean => {
            if (debug) {
                return true;
            }

            if (!cmp || !isInitialized) {
                return false;
            }

            const service = cmp.getServicesBaseInfo().find(data => data.id === serviceId);

            return !!service && service.consent.status;
        },
        [debug, cmp, isInitialized]
    );

    return {
        cmp,
        consentUpdate,
        isInitialized,
        showFirstLayer,
        showSecondLayer,
        acceptService,
        isServiceAccepted,
    };
};
