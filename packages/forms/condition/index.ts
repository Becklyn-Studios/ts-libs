import { FormConditions, FormData, FormFieldConfig } from "../type";

export const fieldFulfillsConditions = (
    { conditions }: Pick<FormFieldConfig, "conditions">,
    fieldConfigs: Record<string, FormFieldConfig>,
    data: FormData
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

const fulfillsConditions = (
    conditions: FormConditions,
    fieldConfigs: Record<string, FormFieldConfig>,
    data: FormData
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
