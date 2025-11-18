import { useCallback, useEffect, useRef, useState } from "react";
import { UsercentricsData, UsercentricsProps } from "../context";
import { ConsentDetails, UCCmp, UCConsentEvent } from "../types";

export const useUsercentricsHook = ({ debug }: UsercentricsProps): UsercentricsData => {
    const [cmp, setCmp] = useState<UCCmp | null>(null);
    const consentDetails = useRef<ConsentDetails | null>(null);
    const [consentUpdate, setConsentUpdate] = useState<number>(0);
    const incrementConsentUpdate = () => setConsentUpdate(prev => ++prev);
    const [isInitialized, setInitialized] = useState<boolean>(false);

    const logUcNotInitializedMessage = () => {
        console.debug("Usercentircs is not initialized.");
    };

    useEffect(() => {
        const consentChangeEvent = (event: UCConsentEvent) => {
            consentDetails.current = event.detail;
            incrementConsentUpdate();
        };

        window.addEventListener("UC_CONSENT", consentChangeEvent);

        return () => window.removeEventListener("UC_CONSENT", consentChangeEvent);
    }, []);

    useEffect(() => {
        const onLoad = () => {
            incrementConsentUpdate();

            if (!window.__ucCmp) {
                return;
            }

            if (debug) {
                console.debug("Usercentrice was initialized.");
            }

            setCmp(window.__ucCmp);
        };

        window.addEventListener("UC_UI_INITIALIZED", onLoad);
        return () => window.removeEventListener("UC_UI_INITIALIZED", onLoad);
    }, [debug]);

    useEffect(() => {
        if (!window?.__ucCmp) {
            return;
        }

        if (debug) {
            console.debug(window.__ucCmp);
        }

        setCmp(window.__ucCmp);
    }, [consentUpdate]);

    useEffect(() => {
        if (!window) {
            return;
        }

        if (!cmp) {
            if (debug) {
                logUcNotInitializedMessage();
            }

            return;
        }

        cmp.getConsentDetails().then(details => {
            consentDetails.current = details;
        });

        cmp.isInitialized().then(v => {
            setInitialized(v);
        });
    }, [cmp]);

    const showFirstLayer = useCallback((): void => {
        if (!window) {
            return;
        }

        if (debug) {
            console.debug("Function showFirstLayer() was called.");
        }

        if (!cmp || !isInitialized) {
            if (debug) {
                logUcNotInitializedMessage();
            }

            return;
        }

        cmp.showFirstLayer();
    }, [cmp, isInitialized]);

    const showSecondLayer = useCallback((): void => {
        if (debug) {
            console.debug("Function showSecondLayer() was called.");
        }

        if (!cmp || !isInitialized) {
            if (debug) {
                logUcNotInitializedMessage();
            }

            return;
        }

        cmp.showSecondLayer();
    }, [cmp, isInitialized]);

    const showServiceDetails = useCallback(
        (serviceId: string): void => {
            if (debug) {
                console.debug(`showServiceDetails() was called with('${serviceId}')`);
            }

            if (!serviceId) {
                if (debug) {
                    console.error("Variable `serviceId` is empty.");
                }
                return;
            }

            if (!cmp || !isInitialized) {
                if (debug) {
                    logUcNotInitializedMessage();
                }

                return;
            }

            cmp.showServiceDetails(serviceId);
        },
        [cmp, isInitialized]
    );

    const acceptServices = useCallback(
        (serviceIds: string[]): void => {
            if (!window || !cmp || !isInitialized) {
                return;
            }

            cmp.updateServicesConsents(serviceIds.map(id => ({ id, consent: true })));
        },
        [cmp, isInitialized]
    );

    const acceptService = useCallback(
        (serviceId: string): void => {
            if (!window) {
                return;
            }

            if (debug) {
                console.debug(`acceptServices() was called with('${serviceId}')`);

                if (!serviceId) {
                    console.error("Variable `serviceId` is empty.");
                }
            }

            if (!serviceId) {
                return;
            }

            acceptServices([serviceId]);
        },
        [acceptServices]
    );

    const isServiceAccepted = useCallback(
        (serviceId: string): boolean => {
            const service = consentDetails.current?.services[serviceId];

            if (!cmp || !isInitialized) {
                if (debug) {
                    console.debug(
                        `Function isServiceAccepted('${serviceId}') called before usercenrics was initialized.`
                    );
                }

                return false;
            }

            if (debug) {
                console.debug(
                    `serviceId('${serviceId}') consent is ${!!service?.consent?.given ? "true" : "false"}`
                );

                if (!service) {
                    console.error(`Service with serviceId='${serviceId}' doesn't exist.`);
                }
            }

            return !!service?.consent?.given;
        },
        [debug, cmp, isInitialized, consentDetails.current]
    );

    return {
        cmp,
        consentUpdate,
        isInitialized,
        showFirstLayer,
        showSecondLayer,
        showServiceDetails,
        acceptService,
        isServiceAccepted,
    };
};
