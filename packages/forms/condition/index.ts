/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormConditions, FormData, FormFieldConfig } from "../type";

export const fieldFulfillsConditions = <T extends FormFieldConfig<string, any, any>>(
    { conditions }: Pick<T, "conditions">,
    fieldConfigs: Record<string, T>,
    data: FormData<T>
): boolean => {
    if (!conditions) {
        return true;
    }

    return conditions.every(condition => {
        return condition instanceof Array
            ? condition.some(c => fulfillsConditions(c, fieldConfigs, data))
            : fulfillsConditions(condition, fieldConfigs, data);
    });
};

const fulfillsConditions = <T extends FormFieldConfig<string, any, any>>(
    conditions: FormConditions,
    fieldConfigs: Record<string, T>,
    data: FormData<T>
) => {
    return Object.entries(conditions).every(([key, condition]) => {
        const { valueFn } = fieldConfigs[key] ?? {};

        const value = valueFn ? valueFn(data) : data[key];

        switch (typeof condition) {
            case "function":
                return condition(value);
            case "string":
                return value === condition;
            default:
                return !!value === condition;
        }
    });
};
