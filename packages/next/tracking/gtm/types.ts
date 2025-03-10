export type DataLayer = unknown[] | undefined;

export type DataLayerData =
    | (() => Record<string, string | number | undefined> | null)
    | Record<string, string | number | undefined>
    | null;

export type Gtag = (
    event: string,
    name: string,
    payload:
        | {
              ad_personalization: "granted" | "denied";
              ad_storage: "granted" | "denied";
              ad_user_data: "granted" | "denied";
              analytics_storage: "granted" | "denied";
              functionality_storage: "granted" | "denied";
              personalization_storage: "granted" | "denied";
              security_storage: "granted" | "denied";
              wait_for_update: number;
          }
        | null
        | boolean
) => void;

declare global {
    interface Window {
        dataLayer?: DataLayer;
        gtag?: Gtag;
    }
}
