import {
    FormCustomConfig,
    FormEntryConfig,
    FormFieldConfig,
    FormRowConfig,
    FormSectionConfig,
} from "../type";

export const isFormRowConfig = <T extends FormFieldConfig>(
    config: FormEntryConfig<T>
): config is FormRowConfig<T> => {
    return config && config.type === "row";
};

export const isFormSectionConfig = <T extends FormFieldConfig>(
    config: FormEntryConfig<T>
): config is FormSectionConfig<T> => {
    return config && config.type === "section";
};

export const isFormCustomConfig = <T extends FormFieldConfig>(
    config: FormEntryConfig<T>
): config is FormCustomConfig<T> => {
    return config && config.type === "custom";
};

export const isFormFieldConfig = <T extends FormFieldConfig>(
    config: FormEntryConfig<T>
): config is T => {
    return !isFormRowConfig(config) && !isFormSectionConfig(config) && !isFormCustomConfig(config);
};
