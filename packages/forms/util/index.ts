/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFormCustomConfig, isFormRowConfig, isFormSectionConfig } from "../guard";
import { FormConfig, FormEntryConfig, FormFieldConfig, FormInputFunc } from "../type";

export const generateInitialValue = <T>(
    value: Extract<T, { initialValue?: any }>["initialValue"]
): Extract<T, { initialValue?: any }>["initialValue"] => {
    return value;
};

export const generateOnInput = <
    T extends FormFieldConfig<string, any, any, any>,
    GlobalFormData extends Record<string, any>,
>(
    inputFunction: FormInputFunc<
        T,
        Extract<T, { initialValue?: any }>["initialValue"],
        GlobalFormData
    >
) => {
    return inputFunction;
};

export const generateFormFieldConfigFn = <
    T extends FormFieldConfig<string, any, any, any>,
    GlobalFormData extends Record<string, any>,
>(
    fieldConfig: (props: {
        value: Extract<T, { initialValue?: any }>["initialValue"];
        data: GlobalFormData;
    }) => T extends FormFieldConfig<string, infer U, any, any> ? U : never
) => {
    return fieldConfig;
};

export const generateValueFn = <GlobalFormData extends Record<string, any>>(
    valueFn: (data: GlobalFormData) => any
) => {
    return valueFn;
};

export function eitherOr<const T>(config: T | false | undefined | null | 0 | ""): T;
export function eitherOr<const Either, const Or>(
    condition: boolean,
    either: Either,
    or: Or
): Either | Or;
export function eitherOr<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    configOrCondition: boolean | FormConfig<T, GlobalFormData>,
    either?: FormConfig<T, GlobalFormData>,
    or?: FormConfig<T, GlobalFormData>
) {
    if (typeof configOrCondition === "boolean") {
        return configOrCondition ? either : or;
    } else {
        return configOrCondition;
    }
}

export const fieldConfigFromFormField = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    { name, fieldConfig }: T,
    data: GlobalFormData
): T["fieldConfig"] => {
    return typeof fieldConfig === "function"
        ? fieldConfig({ value: data[name], data })
        : fieldConfig;
};

export const fieldsFromConfig = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    config: FormConfig<T, GlobalFormData>
): {
    [K in T["name"]]: Extract<T, { name: K }>;
} => {
    return reduceFieldConfigs<
        {
            [K in T["name"]]: Extract<T, { name: K }>;
        },
        T,
        GlobalFormData
    >(config, (acc, field) => {
        // @ts-expect-error: ts does not understand this
        acc[field.name] = field;
        return acc;
    });
};

export const mapFieldConfigs = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>(
    entries: FormConfig<T, GlobalFormData>,
    callbackFn: (field: T, index: number) => T
): FormConfig<T, GlobalFormData> => {
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
    GlobalFormData extends Record<string, any>,
>(
    entries: FormConfig<U, GlobalFormData>,
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

export const someFieldConfigs = <
    T extends FormFieldConfig<string, any, any>,
    GlobalFormData extends Record<string, any>,
>(
    entries: readonly FormEntryConfig<T, GlobalFormData>[],
    callbackFn: <T extends FormFieldConfig<string, any, any, GlobalFormData>>(
        field: T,
        index: number
    ) => boolean
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
