import { ReactNode } from "react";
import { FormFieldConfig } from "./field";

export interface FormRowConfig {
    type: "row";
    content: readonly FormEntryConfig[];
}

export interface FormSectionConfig {
    type: "section";
    content: readonly FormEntryConfig[];
}

export interface FormCustomConfig {
    type: "custom";
    wrapper: (children: ReactNode) => ReactNode;
    content: readonly FormEntryConfig[];
}

export type FormEntryConfig =
    | FormCustomConfig
    | FormSectionConfig
    | FormRowConfig
    | FormFieldConfig;

export type FormConfig = readonly FormEntryConfig[];
