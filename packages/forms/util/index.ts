import merge from "lodash.merge";
import { isFormCustomConfig, isFormRowConfig, isFormSectionConfig } from "../guard";
import { FormConfig, FormData, FormFieldConfig } from "../type";

export function eitherOr<const T>(config: T | false | undefined | null | 0 | ""): T;
export function eitherOr<const Either, const Or>(
    condition: boolean,
    either: Either,
    or: Or
): Either | Or;
export function eitherOr<T extends FormFieldConfig<string, unknown, unknown, T>>(
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

export const createFormConfig = <const T extends FormFieldConfig<string, unknown, unknown, T>>(
    config: FormConfig<T>
) => mapFieldConfigs(config, entry => entry);

export const fieldConfigFromFormField = <T extends FormFieldConfig<string, unknown, unknown, T>>(
    { name, fieldConfig }: T,
    data: FormData<FormConfig<T>>
): T["fieldConfig"] => {
    return typeof fieldConfig === "function"
        ? fieldConfig({ value: data[name], data })
        : fieldConfig;
};

// export type FormData<T extends FormDataFieldConfig<string, unknown>[]> = {
//     [K in T[number]["name"]]: Extract<T[number], { name: K }>["initialValue"];
// };

export const fieldsFromConfig = <T extends FormFieldConfig<string, unknown, unknown, T>>(
    config: FormConfig<T>
): {
    [K in T["name"]]: Extract<T, { name: K }>;
} => {
    return reduceFieldConfigs<Record<string, T>, T>(config, (acc, field) => {
        acc[field.name] = field;
        return acc;
    });
};

// export const initialValuesFromConfig = <
//     T extends FormFieldConfig<string, string, unknown, unknown>,
// >(
//     config: FormConfig<T>
// ): FormData<FormConfig<T>> => {
//     return reduceFieldConfigs(config, (acc, field) => {
//         if (field.initialValue !== undefined) {
//             if (field.onInput) {
//                 acc = merge(
//                     acc,
//                     field.onInput({ field, value: field.initialValue, previousData: acc })
//                 );
//             } else {
//                 acc[field.name] = field.initialValue;
//             }
//         }

//         return acc;
//     });
// };

export const mapFieldConfigs = <T extends FormFieldConfig<string, string, unknown, unknown, T>>(
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
    T extends Record<string | number, unknown>,
    U extends FormFieldConfig<string, string, unknown, unknown, never>,
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

// export const someFieldConfigs = (
//     entries: readonly FormEntryConfig[],
//     callbackFn: <T extends FormFieldConfig>(field: T, index: number) => boolean
// ): boolean => {
//     return entries.some((entry, index) => {
//         switch (true) {
//             case isFormRowConfig(entry):
//             case isFormSectionConfig(entry):
//             case isFormCustomConfig(entry):
//                 return someFieldConfigs(entry.content, callbackFn);
//             default:
//                 return callbackFn(entry, index);
//         }
//     });
// };
