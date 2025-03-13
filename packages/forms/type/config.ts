/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { FormFieldConfig } from "./field";

export interface FormRowConfig<T extends FormFieldConfig<string, any, any>> {
    type: "row";
    content: readonly FormEntryConfig<T>[];
}

export interface FormSectionConfig<T extends FormFieldConfig<string, any, any>> {
    type: "section";
    content: readonly FormEntryConfig<T>[];
}

export interface FormCustomConfig<T extends FormFieldConfig<string, any, any>> {
    type: "custom";
    wrapper: (children: ReactNode) => ReactNode;
    content: readonly FormEntryConfig<T>[];
}

export type FormEntryConfig<T extends FormFieldConfig<string, any, any>> =
    | FormCustomConfig<T>
    | FormSectionConfig<T>
    | FormRowConfig<T>
    | T;

export type FormConfig<T extends FormFieldConfig<string, any, any>> = readonly FormEntryConfig<T>[];
