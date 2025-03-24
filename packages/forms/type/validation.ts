/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormValidationStrategy = "blur" | "input" | "manual";

export type FormError = string | boolean;

export type FormErrors = Record<string, FormError>;

export type FormFieldValidationFunction<GlobalFormData extends Record<string, any>> = (props: {
    value: any;
    data: GlobalFormData;
}) => boolean;

export type FormFieldValidation<GlobalFormData extends Record<string, any>> =
    | boolean
    | RegExp
    | FormFieldValidationFunction<GlobalFormData>;

export interface FieldValidations<GlobalFormData extends Record<string, any>> {
    validation: FormFieldValidation<GlobalFormData>;
    message?: string;
}
