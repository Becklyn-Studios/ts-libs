/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormCustomConfig,
    FormEntryConfig,
    FormFieldConfig,
    FormRowConfig,
    FormSectionConfig,
} from "../type";

export const isFormRowConfig = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    config: FormEntryConfig<T, GlobalFormData>
): config is FormRowConfig<T, GlobalFormData> => {
    return config && config.type === "row";
};

export const isFormSectionConfig = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    config: FormEntryConfig<T, GlobalFormData>
): config is FormSectionConfig<T, GlobalFormData> => {
    return config && config.type === "section";
};

export const isFormCustomConfig = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    config: FormEntryConfig<T, GlobalFormData>
): config is FormCustomConfig<T, GlobalFormData> => {
    return config && config.type === "custom";
};

export const isFormFieldConfig = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    config: FormEntryConfig<T, GlobalFormData>
): config is T => {
    return !isFormRowConfig(config) && !isFormSectionConfig(config) && !isFormCustomConfig(config);
};
