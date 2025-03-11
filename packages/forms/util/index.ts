import merge from "lodash.merge";
import {
    FormConfig,
    FormData,
    FormEntryConfig,
    FormFieldBasicConfig,
    FormFieldConfig,
    ResolveFieldConfigFunc,
} from "../type";

export function eitherOr<const T>(config: T | false | undefined | null | 0 | ""): T;
export function eitherOr<const Either, const Or>(
    condition: boolean,
    either: Either,
    or: Or
): Either | Or;
export function eitherOr(
    configOrCondition: boolean | FormConfig,
    either?: FormConfig,
    or?: FormConfig
) {
    if (typeof configOrCondition === "boolean") {
        return configOrCondition ? either : or;
    } else {
        return configOrCondition;
    }
}

export const createFormConfig = <const T extends FormConfig>(config: T) =>
    mapFieldConfigs(config, entry => entry) as unknown as T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fieldConfigFromFormField = <T extends FormFieldBasicConfig<any>>(
    { name, fieldConfig }: T,
    data: FormData
): ResolveFieldConfigFunc<T>["fieldConfig"] => {
    return typeof fieldConfig === "function"
        ? fieldConfig({ value: data[name], data })
        : fieldConfig;
};

export const fieldsFromConfig = (config: FormConfig): Record<string, FormFieldConfig> => {
    return reduceFieldConfigs(config, (acc, field) => {
        acc[field.name] = field;
        return acc;
    });
};

export const initialValuesFromConfig = (config: FormConfig): FormData => {
    return reduceFieldConfigs(config, (acc, field) => {
        if (field.initialValue !== undefined) {
            if (field.onInput) {
                acc = merge(
                    acc,
                    field.onInput({ field, value: field.initialValue, previousData: acc })
                );
            } else {
                acc[field.name] = field.initialValue;
            }
        }

        return acc;
    });
};

export const mapFieldConfigs = (
    entries: FormConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackFn: <T extends FormFieldBasicConfig<any>>(field: T, index: number) => T
): FormConfig => {
    return entries.flatMap((entry, index) => {
        if (!entry) {
            return [];
        }

        switch (entry.type) {
            case "custom":
            case "section":
            case "row":
                return {
                    ...entry,
                    content: mapFieldConfigs(entry.content, callbackFn),
                };
            default:
                return callbackFn(entry, index);
        }
    });
};

export const reduceFieldConfigs = <T extends Record<string | number, unknown>>(
    entries: readonly FormEntryConfig[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackFn: <F extends FormFieldBasicConfig<any>>(acc: T, field: F, index: number) => T
): T => {
    return entries.reduce((acc, entry, index) => {
        switch (entry.type) {
            case "custom":
            case "section":
            case "row":
                acc = { ...acc, ...reduceFieldConfigs(entry.content, callbackFn) };
                break;
            default:
                callbackFn(acc, entry, index);
                break;
        }

        return acc;
    }, {} as T);
};

export const someFieldConfigs = (
    entries: readonly FormEntryConfig[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackFn: <T extends FormFieldBasicConfig<any>>(field: T, index: number) => boolean
): boolean => {
    return entries.some((entry, index) => {
        switch (entry.type) {
            case "custom":
            case "section":
            case "row":
                return someFieldConfigs(entry.content, callbackFn);
            default:
                return callbackFn(entry, index);
        }
    });
};
