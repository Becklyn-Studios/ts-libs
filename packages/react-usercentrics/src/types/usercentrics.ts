import { UC, UCCMPEvent, UCCustomEvent, UCInitializedEvent, UCViewChangedEvent } from "./index";

declare global {
    interface Window {
        UC_UI?: UC;
        addEventListener(
            type: "ucEvent",
            listener: (event: UCCustomEvent) => void,
            options?: boolean | AddEventListenerOptions
        ): void;
        addEventListener(
            type: "UC_UI_INITIALIZED",
            listener: (event: UCInitializedEvent) => void,
            options?: boolean | AddEventListenerOptions
        ): void;
        addEventListener(
            type: "UC_UI_CMP_EVENT",
            listener: (event: UCCMPEvent) => void,
            options?: boolean | AddEventListenerOptions
        ): void;
        addEventListener(
            type: "UC_UI_VIEW_CHANGED",
            listener: (event: UCViewChangedEvent) => void,
            options?: boolean | AddEventListenerOptions
        ): void;
        removeEventListener(
            type: "ucEvent",
            listener: (event: UCCustomEvent) => any,
            options?: boolean | EventListenerOptions
        ): void;
        removeEventListener(
            type: "UC_UI_INITIALIZED",
            listener: (event: UCInitializedEvent) => any,
            options?: boolean | EventListenerOptions
        ): void;
        removeEventListener(
            type: "UC_UI_CMP_EVENT",
            listener: (event: UCCMPEvent) => any,
            options?: boolean | EventListenerOptions
        ): void;
        removeEventListener(
            type: "UC_UI_VIEW_CHANGED",
            listener: (event: UCViewChangedEvent) => any,
            options?: boolean | EventListenerOptions
        ): void;
        dispatchEvent<K extends keyof UCCustomEvent>(event: UCCustomEvent[K]): void;
        dispatchEvent<K extends keyof UCInitializedEvent>(event: UCInitializedEvent[K]): void;
        dispatchEvent<K extends keyof UCCMPEvent>(event: UCCMPEvent[K]): void;
        dispatchEvent<K extends keyof UCViewChangedEvent>(event: UCViewChangedEvent[K]): void;
    }
}
