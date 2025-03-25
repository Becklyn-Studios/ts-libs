/* eslint-disable @typescript-eslint/no-explicit-any */
import { fieldFulfillsConditions } from "../condition";
import { isFormCustomConfig, isFormRowConfig, isFormSectionConfig } from "../guard";
import { FormConfig, FormEntryConfig, FormErrors, FormFieldConfig } from "../type";

export const handleValidateConfig = <GlobalFormData extends Record<string, any>>(
    config: FormConfig<FormFieldConfig<string, any, any, GlobalFormData>, GlobalFormData>,
    fieldConfigs: Record<string, FormFieldConfig<string, any, any, GlobalFormData>>,
    data: GlobalFormData
): FormErrors => {
    const errors: FormErrors = {};

    config.forEach(entry => {
        const entryErrors = handleValidateEntry(entry, fieldConfigs, data);

        if (entryErrors && Object.keys(entryErrors).length) {
            Object.assign(errors, entryErrors);
        }
    });

    return errors;
};

const handleValidateEntry = <GlobalFormData extends Record<string, any>>(
    entry: FormEntryConfig<FormFieldConfig<string, any, any, GlobalFormData>, GlobalFormData>,
    fieldConfigs: Record<string, FormFieldConfig<string, any, any, GlobalFormData>>,
    data: GlobalFormData
): FormErrors => {
    switch (true) {
        case isFormRowConfig(entry):
        case isFormSectionConfig(entry):
        case isFormCustomConfig(entry):
            return handleValidateConfig(entry.content, fieldConfigs, data);
        default:
            if (!entry) {
                return {};
            }
            return handleValidateField(entry, fieldConfigs, data);
    }
};

export const handleValidateField = <GlobalFormData extends Record<string, any>>(
    { name, validations, conditions, valueFn }: FormFieldConfig<string, any, any, GlobalFormData>,
    fieldConfigs: Record<string, FormFieldConfig<string, any, any, GlobalFormData>>,
    data: GlobalFormData
): FormErrors => {
    if (
        !validations ||
        (conditions && !fieldFulfillsConditions({ conditions }, fieldConfigs, data))
    ) {
        return { [name]: false };
    }

    const value = valueFn ? valueFn(data) : data[name];

    const error = validations.find(({ validation }) => {
        switch (typeof validation) {
            case "function":
                return !validation({ value, data });
            case "string":
                return !new RegExp(validation).test(value);
            default:
                if (validation instanceof RegExp) {
                    return !validation.test(value);
                } else if (Array.isArray(value)) {
                    return value.length === 0;
                } else if (typeof value === "number") {
                    return isNaN(value);
                } else {
                    return !value;
                }
        }
    });

    return { [name]: error && error.message ? error.message : !!error };
};
