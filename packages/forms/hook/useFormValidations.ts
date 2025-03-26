import { useCallback, useContext } from "react";
import { FormDataContext } from "../context/data/context";
import { FormConfig, FormError, FormErrors, FormFieldConfig } from "../type";
import { handleValidateConfig, handleValidateField } from "../validation";
import { FormStore } from "./useFormStore";
import { useRefEffect } from "./useRefEffect";

export interface FormValidations<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
> {
    errors: FormStore<FormErrors>;
    validateField: (field: T, skipUpdate?: boolean) => FormError | null;
    validateCategory: (category: string) => FormErrors;
    validateForm: (
        input?: FormConfig<T, GlobalFormData>,
        skipUpdate?: boolean
    ) => FormErrors | null;
}

export const useFormValidations = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
>(
    config: FormConfig<T, GlobalFormData>,
    fieldConfigs: Record<string, T>
): FormValidations<T, GlobalFormData> => {
    const configRef = useRefEffect(config);
    const fieldConfigsRef = useRefEffect(fieldConfigs);
    const { data, errors } = useContext(FormDataContext);

    const validateForm = useCallback(
        (
            input: FormConfig<T, GlobalFormData> = configRef.current,
            skipUpdate?: boolean
        ): FormErrors | null => {
            const formErrors = handleValidateConfig(input, fieldConfigsRef.current, data.get());

            if (!skipUpdate) {
                errors.set(formErrors);
            }

            const filteredErrors = Object.keys(formErrors).reduce((acc, key) => {
                const error = formErrors[key];

                if (error !== false && error !== undefined) {
                    acc[key] = error;
                }

                return acc;
            }, {} as FormErrors);

            return Object.keys(filteredErrors).length ? filteredErrors : null;
        },
        [configRef, fieldConfigsRef, data, errors]
    );

    const validateCategory = useCallback(
        (category: string) => {
            const fieldConfigs = fieldConfigsRef.current;

            const formErrors = handleValidateConfig(
                Object.keys(fieldConfigs).flatMap(key => {
                    const fieldConfig = fieldConfigs[key]!;

                    return fieldConfig.categories && fieldConfig.categories.includes(category)
                        ? fieldConfig
                        : [];
                }),
                fieldConfigs,
                data.get()
            );

            errors.set(formErrors);

            return formErrors;
        },
        [fieldConfigsRef, data, errors]
    );

    const validateField = useCallback(
        (field: T, skipUpdate?: boolean): FormError | null => {
            const formErrors = handleValidateField(field, fieldConfigsRef.current, data.get());

            if (!skipUpdate) {
                errors.set(formErrors);
            }

            return formErrors[field.name] || null;
        },
        [fieldConfigsRef, data, errors]
    );

    return { errors, validateField, validateCategory, validateForm };
};
