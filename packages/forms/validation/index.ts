import { fieldFulfillsConditions } from "../condition";
import {
    FormConfig,
    FormData,
    FormEntryConfig,
    FormErrors,
    FormFieldBasicConfig,
    FormFieldConfig,
} from "../type";

export const handleValidateConfig = (
    config: FormConfig,
    fieldConfigs: Record<string, FormFieldConfig>,
    data: FormData
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

const handleValidateEntry = (
    entry: FormEntryConfig,
    fieldConfigs: Record<string, FormFieldConfig>,
    data: FormData
): FormErrors => {
    switch (entry.type) {
        case "custom":
        case "section":
        case "row":
            return handleValidateConfig(entry.content, fieldConfigs, data);
        default:
            return handleValidateField(entry, fieldConfigs, data);
    }
};

export const handleValidateField = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name, validations, conditions, valueFn }: FormFieldBasicConfig<any>,
    fieldConfigs: Record<string, FormFieldConfig>,
    data: FormData
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
