/* eslint-disable @typescript-eslint/no-explicit-any */
import merge from "lodash.merge";
import { isFormCustomConfig, isFormRowConfig, isFormSectionConfig } from "../guard";
import { FormConfig, FormData, FormEntryConfig, FormFieldConfig } from "../type";

export function eitherOr<const T>(config: T | false | undefined | null | 0 | ""): T;
export function eitherOr<const Either, const Or>(
    condition: boolean,
    either: Either,
    or: Or
): Either | Or;
export function eitherOr<T extends FormFieldConfig<string, any, any>>(
    configOrCondition: boolean | FormConfig<T>,
    either?: FormConfig<T>,
    or?: FormConfig<T>
) {
    if (typeof configOrCondition === "boolean") {
        return configOrCondition ? either : or;
    } else {
        return configOrCondition;
    }
}

export const createFormConfig = <const T extends FormFieldConfig<string, any, any>>(
    config: FormConfig<T>
) => mapFieldConfigs(config, entry => entry);

export const fieldConfigFromFormField = <T extends FormFieldConfig<string, any, any>>(
    { name, fieldConfig }: T,
    data: FormData<T>
): T["fieldConfig"] => {
    return typeof fieldConfig === "function"
        ? // @ts-expect-error: ts does not understand this
          fieldConfig({ value: data[name], data })
        : fieldConfig;
};

export const fieldsFromConfig = <T extends FormFieldConfig<string, any, any>>(
    config: FormConfig<T>
): {
    [K in T["name"]]: Extract<T, { name: K }>;
} => {
    return reduceFieldConfigs<
        {
            [K in T["name"]]: Extract<T, { name: K }>;
        },
        T
    >(config, (acc, field) => {
        // @ts-expect-error: ts does not understand this
        acc[field.name] = field;
        return acc;
    });
};

export const initialValuesFromConfig = <T extends FormFieldConfig<string, any, any>>(
    config: FormConfig<T>
): FormData<T> => {
    return reduceFieldConfigs(config, (acc, field) => {
        if (field.initialValue !== undefined) {
            if (field.onInput) {
                acc = merge(
                    acc,
                    field.onInput({ field, value: field.initialValue, previousData: acc })
                );
            } else {
                // @ts-expect-error: ts does not understand this
                acc[field.name] = field.initialValue;
            }
        }

        return acc;
    });
};

export const mapFieldConfigs = <T extends FormFieldConfig<string, any, any>>(
    entries: FormConfig<T>,
    callbackFn: (field: T, index: number) => T
): FormConfig<T> => {
    return entries.flatMap((entry, index) => {
        if (!entry) {
            return [];
        }

        switch (true) {
            case isFormRowConfig(entry):
            case isFormSectionConfig(entry):
            case isFormCustomConfig(entry):
                return {
                    ...entry,
                    content: mapFieldConfigs(entry.content, callbackFn),
                };
            default:
                return callbackFn(entry, index);
        }
    });
};

export const reduceFieldConfigs = <
    T extends Record<string | number, any>,
    U extends FormFieldConfig<string, any, any>,
>(
    entries: FormConfig<U>,
    callbackFn: (acc: T, field: U, index: number) => T
): T => {
    return entries.reduce((acc, entry, index) => {
        switch (true) {
            case isFormRowConfig(entry):
            case isFormSectionConfig(entry):
            case isFormCustomConfig(entry):
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
    entries: readonly FormEntryConfig<any>[],
    callbackFn: <T extends FormFieldConfig<string, any, any>>(field: T, index: number) => boolean
): boolean => {
    return entries.some((entry, index) => {
        switch (true) {
            case isFormRowConfig(entry):
            case isFormSectionConfig(entry):
            case isFormCustomConfig(entry):
                return someFieldConfigs(entry.content, callbackFn);
            default:
                return callbackFn(entry, index);
        }
    });
};
