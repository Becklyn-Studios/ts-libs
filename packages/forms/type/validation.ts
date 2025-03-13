/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldConfig } from "./field";
import { FormData } from "./form";

export type FormValidationStrategy = "blur" | "input" | "manual";

export type FormError = string | boolean;

export type FormErrors = Record<string, FormError>;

export type FormFieldValidationFunction<T extends FormFieldConfig<string, any, any>> = (props: {
    value: any;
    data: FormData<T>;
}) => boolean;

export type FormFieldValidation<T extends FormFieldConfig<string, any, any>> =
    | boolean
    | RegExp
    | FormFieldValidationFunction<T>;

export interface FieldValidations<T extends FormFieldConfig<string, any, any>> {
    validation: FormFieldValidation<T>;
    message?: string;
}
