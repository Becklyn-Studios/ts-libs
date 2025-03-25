/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { NotRenderedElement } from "../util";
import { FormFieldConfig } from "./field";

export interface FormRowConfig<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> {
    type: "row";
    content: readonly FormEntryConfig<T, GlobalFormData>[];
}

export interface FormSectionConfig<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> {
    type: "section";
    content: readonly FormEntryConfig<T, GlobalFormData>[];
}

export interface FormCustomConfig<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> {
    type: "custom";
    wrapper: (children: ReactNode) => ReactNode;
    content: readonly FormEntryConfig<T, GlobalFormData>[];
}

export type FormElementWithContent<
    T extends FormConfig<FormFieldConfig<string, any, any, GlobalFormData>, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> = {
    content: T;
};

export type FormEntryConfig<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> =
    | FormCustomConfig<T, GlobalFormData>
    | FormSectionConfig<T, GlobalFormData>
    | FormRowConfig<T, GlobalFormData>
    | T
    | NotRenderedElement;

export type FormConfig<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> = readonly FormEntryConfig<T, GlobalFormData>[];
