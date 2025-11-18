// region docs
// region docs emums
export enum CLOSE_OPTION {
    ICON = "ICON",
    LINK = "LINK",
}
// endregion

// region docs types
export type ConsentType = "IMPLICIT" | "EXPLICIT";

export type SettingType = "TCF" | "GDPR" | "CCPA";

export type ConsentActionType =
    | "onAcceptAllServices"
    | "onDenyAllServices"
    | "onEssentialChange"
    | "onInitialPageLoad"
    | "onNonEURegion"
    | "onSessionRestored"
    | "onTcfStringChange"
    | "onUpdateServices"
    | "onMobileSessionRestore";

export type EmbeddingsTheme = CmpTheme;

export type OptionalSettingsData = string | null | undefined;

export type CmpButtonsType = "accept" | "deny" | "more" | "save" | "ok";

export type ThemeType = {
    colors: {
        black: string;
        white: string;
        layout: {
            mainPage: {
                left: {
                    background: string;
                };
                right: {
                    background: string;
                };
            };
            managePage: {
                left: {
                    background: string;
                };
                right: {
                    background: string;
                };
            };
            qrCode: {
                left: {
                    background: string;
                };
                right: {
                    background: string;
                };
            };
        };
        toggle: {
            on: {
                background: string;
            };
            off: {
                background: string;
            };
        };
        text: {
            color: string;
            color95: string;
            color90: string;
            color08: string;
        };
    };
    padding: {
        leftContainer: {
            mainPage: {
                vertical: number;
                horizontal: number;
            };
            managePage: {
                vertical: number;
                horizontal: number;
            };
            qrCode: {
                vertical: number;
                horizontal: number;
            };
        };
        rightContainer: {
            mainPage: {
                vertical: number;
                horizontal: number;
            };
            managePage: {
                vertical: number;
                horizontal: number;
            };
            qrCode: {
                vertical: number;
                horizontal: number;
            };
        };
        card: {
            vertical: number;
            horizontal: number;
        };
        dpsInfoCard: {
            vertical: number;
            horizontal: number;
        };
        qrCodeModal: {
            vertical: number;
            horizontal: number;
        };
    };
    font: {
        size: {
            layout: {
                large: number;
                medium: number;
            };
            button: {
                large: number;
                medium: number;
            };
            card: {
                large: number;
                medium: number;
            };
            cardList: {
                large: number;
                medium: number;
            };
            dpsInfoCard: {
                large: number;
                medium: number;
            };
            qrCodeModal: {
                large: number;
                medium: number;
            };
        };
        weight: {
            regular: number;
            semiBold: number;
        };
    };
    metrics: {
        mainPage: {
            leftContainer: {
                width: string;
            };
            rightContainer: {
                width: string;
            };
        };
        managePage: {
            leftContainer: {
                width: string;
            };
            rightContainer: {
                width: string;
            };
        };
    };
};

type TCFUserDecisionOnVendor = TCFUserDecisionOnPurpose;
// endregion

// region docs interfaces
export interface CategoryData {
    essential?: boolean;
    state: "ALL_DENIED" | "SOME_ACCEPTED" | "ALL_ACCEPTED";
    dps: Record<string, boolean> | null;
    hidden?: boolean;
}

export interface ServiceData {
    name: string;
    version: string;
    category: string;
    essential: boolean;
    consent?: {
        given: boolean;
        type: "IMPLICIT" | "EXPLICIT";
    };
    gcm?: {
        analyticsStorage?: true;
        adStorage?: true;
    };
    subservices?: Record<string, ServiceData>;
    thirdCountryDataTransfer?: boolean;
    status?: "added";
}

export interface SettingData {
    id: string;
    type: SettingType;
    version: string;
    abVariant?: string;
    sandbox?: true;
}

export interface ConsentData {
    status: "ALL_ACCEPTED" | "ALL_DENIED" | "SOME_ACCEPTED" | "SOME_DENIED";
    serviceIds?: string[];
    required: boolean;
    version: number;
    controllerId: string;
    language: string;
    createdAt: number;
    updatedAt: number;
    updatedBy: ConsentActionType;
    setting: SettingData;
    type: ConsentType;
    hash: string;
    gpcSignal?: boolean;
    isBot?: true;
    isOutsideEu?: true;
}

export interface ConsentDetails {
    consent: ConsentData;
    services: Record<string, ServiceData>;
    categories: Record<string, CategoryData>;
}

export interface PrivacyButtonTheme {
    position: "left" | "right";
    size: number;
    backgroundColor: string;
    pages: string[];
    iconUrl: string;
    iconColor: string;
}

export interface CmpTheme {
    border: {
        radius: string;
    };
    borderRadiusLayer: OptionalSettingsData;
    borderRadiusButton: OptionalSettingsData;
    buttons: CmpButtonsType[][];
    colors: {
        acceptBg?: OptionalSettingsData;
        acceptTxt?: OptionalSettingsData;
        background?: OptionalSettingsData;
        border?: OptionalSettingsData;
        denyBg?: OptionalSettingsData;
        denyTxt?: OptionalSettingsData;
        link?: OptionalSettingsData;
        moreBg?: OptionalSettingsData;
        moreTxt?: OptionalSettingsData;
        neutral?: OptionalSettingsData;
        overlay?: OptionalSettingsData;
        primary?: OptionalSettingsData;
        privacyBg?: OptionalSettingsData;
        privacyIcon?: OptionalSettingsData;
        saveBg?: OptionalSettingsData;
        saveTxt?: OptionalSettingsData;
        tabActive?: OptionalSettingsData;
        tabInactive?: OptionalSettingsData;
        toggleActive?: OptionalSettingsData;
        toggleInactive?: OptionalSettingsData;
        toggleDisabled?: OptionalSettingsData;
        toggleActiveIcon?: OptionalSettingsData;
        toggleInactiveIcon?: OptionalSettingsData;
        toggleDisabledIcon?: OptionalSettingsData;
        tertiary?: OptionalSettingsData;
        text?: OptionalSettingsData;
        ccpaButtonColor?: OptionalSettingsData;
        ccpaButtonTextColor?: OptionalSettingsData;
    };
    scrollbar: {
        thumbColor?: OptionalSettingsData;
    };
    direction: "ltr" | "rtl";
    fonts: {
        family: string;
    };
    hideDenyBtn: boolean;
    hideLanguageSwitch: boolean;
    logo: {
        url: string;
        alt: string;
        position: "left" | "center" | "right";
    };
    footer: {
        isCentered: boolean;
    };
    maxBannerWidth: string;
    name: string;
    overlayOpacity: string;
    position: "left" | "center" | "right" | "bottom";
    removeCcpaToggle?: boolean;
    secondLayerTrigger: string;
    spacing: Spacing;
    typography: {
        color?: OptionalSettingsData;
        font?: OptionalSettingsData;
        size?: number | undefined;
    };
    useBackgroundShadow: boolean;
    useOverlay?: boolean;
    closeOption?: CLOSE_OPTION | null;
    tcf?: {
        showDescriptions?: boolean;
        hideNonIab?: boolean;
        hideToggles?: boolean;
        showSharedOutsideEu?: boolean;
    };
    showCategoriesToggles: boolean;
    showMoreInformationLink?: boolean;
    hideDataProcessingServices?: boolean;
    hideServicesToggles?: boolean;
    defaultTab: "FIRST" | "SECOND";
}

export interface LayerTheme {
    base?: Partial<CmpTheme>;
    first?: Partial<CmpTheme>;
    second?: Partial<CmpTheme>;
}

export interface ScreenTypes<ThemeType> {
    desktop?: ThemeType;
    tablet?: ThemeType;
    mobile?: ThemeType;
    xs?: ThemeType;
}

export interface ThemeData {
    breakPoints?: {
        desktop: number;
        tablet: number;
        mobile: number;
    };
    layers?: ScreenTypes<LayerTheme>;
    privacyButton?: ScreenTypes<Partial<PrivacyButtonTheme>>;
    embeddings?: ScreenTypes<EmbeddingsTheme>;
}

export interface BaseTCFUserDecision {
    consent?: boolean;
    id: number;
}

export interface TCFUserDecisionOnPurpose extends BaseTCFUserDecision {
    legitimateInterestConsent?: boolean;
}

export interface TCFUserDecisionOnSpecialFeature extends BaseTCFUserDecision {
    consent: boolean;
}

export interface TCFDecisions {
    purposes?: TCFUserDecisionOnPurpose[];
    specialFeatures?: TCFUserDecisionOnSpecialFeature[];
    vendors?: TCFUserDecisionOnVendor[];
}
// endregion
// endregion

type Letter =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z";
export type UcLanguage = `${Letter}${Letter}`;

// Docs don't specify what these types are.
export type Spacing = any;

export interface UCConsent {
    id: string;
    consent: boolean;
}

export interface ServiceConsent extends UCConsent {}

export interface CategoryConsent extends UCConsent {
    id: "marketing" | "functional" | "essential";
}

export type CategoriesConsents = CategoryConsent[];
export type ServiceConsents = ServiceConsent[];

export interface UCCmp {
    // region UI
    closeCmp: () => Promise<void>;
    refreshScripts: () => Promise<void>;
    showFirstLayer: () => Promise<void>;
    showSecondLayer: () => Promise<void>;
    showServiceDetails: (serviceId: string) => Promise<void>;
    updateThemes: (themeData: ThemeData) => Promise<void>;
    // endregion
    // region controls
    acceptAllConsents: () => Promise<void>;
    changeLanguage: (language: UcLanguage) => Promise<void>;
    clearUserSession: () => Promise<void>;
    denyAllConsents: () => Promise<void>;
    getActiveLanguage: () => Promise<UcLanguage>;
    getConsentDetails: () => Promise<ConsentDetails>;
    getControllerId: () => Promise<string>;
    isConsentRequired: () => Promise<boolean>;
    isInitialized: () => Promise<boolean>;
    saveConsents: () => Promise<void>;
    updateCategoriesConsents: (categoriesConsents: CategoriesConsents) => Promise<void>;
    updateServicesConsents: (categoriesConsents: ServiceConsents) => Promise<void>;
    updateTcfConsents: (decisions: TCFDecisions) => Promise<void>;
    // endregion
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

export interface UCConsentEvent extends CustomEvent<ConsentDetails> {
    type: "UC_CONSENT";
}
