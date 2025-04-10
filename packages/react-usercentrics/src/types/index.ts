export interface UCConsent {
    status: boolean;
}

export interface UCService {
    id: string;
    name: string;
    consent: UCConsent;
}

export interface UC {
    timeStamp: number;
    isInitialized: () => boolean;
    showFirstLayer: () => void;
    showSecondLayer: (serviceId?: string) => void;
    acceptService: (serviceId: string) => void;
    getServicesBaseInfo: () => UCService[];
}

export type UCActionType =
    | "onUcImprintClick"
    | "onUcPrivacyClick"
    | "onInitialPageLoad"
    | "onAcceptAllServices"
    | "onDenyAllServices"
    | "onUpdateServices"
    | "onSessionRestored";

export type ServiceStates = Record<string, string | boolean>;

export interface UCCustomEventBase<T = {}>
    extends CustomEvent<
        {
            action: UCActionType;
            event: string;
            type: string;
        } & ServiceStates &
            T
    > {
    type: string;
}

export interface UCCustomEvent extends UCCustomEventBase {
    type: "ucEvent";
}

export interface UCInitializedEvent extends CustomEvent<null> {
    type: "UC_UI_INITIALIZED";
}

export interface UCCMPEvent
    extends CustomEvent<{
        source: "FIRST_LAYER" | "SECOND_LAYER";
        type:
            | "ACCEPT_ALL"
            | "DENY_ALL"
            | "SAVE"
            | "CMP_SHOWN"
            | "MORE_INFORMATION_LINK"
            | "IMPRINT_LINK"
            | "PRIVACY_POLICY_LINK";
    }> {
    type: "UC_UI_CMP_EVENT";
}

export interface UCViewChangedEvent
    extends CustomEvent<{
        previousView: "NONE" | "FIRST_LAYER" | "SECOND_LAYER";
        view: "NONE" | "FIRST_LAYER" | "SECOND_LAYER" | "PRIVACY_BUTTON";
    }> {
    type: "UC_UI_VIEW_CHANGED";
}
