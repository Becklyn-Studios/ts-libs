import { ReactNode } from "react";
import { FormFieldConfig } from "./field";

export interface FormRowConfig<T extends FormFieldConfig> {
    type: "row";
    content: readonly FormEntryConfig<T>[];
}

export interface FormSectionConfig<T extends FormFieldConfig> {
    type: "section";
    content: readonly FormEntryConfig<T>[];
}

export interface FormCustomConfig<T extends FormFieldConfig> {
    type: "custom";
    wrapper: (children: ReactNode) => ReactNode;
    content: readonly FormEntryConfig<T>[];
}

export type FormEntryConfig<T extends FormFieldConfig = FormFieldConfig> =
    | FormCustomConfig<T>
    | FormSectionConfig<T>
    | FormRowConfig<T>
    | T;

export type FormConfig<T extends FormFieldConfig = FormFieldConfig> = readonly FormEntryConfig<T>[];
