import { FormData } from "./form";

export type FormValidationStrategy = "blur" | "input" | "manual";

export type FormError = string | boolean;

export type FormErrors = Record<string, FormError>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormFieldValidationFunction = (props: { value: any; data: FormData }) => boolean;

export type FormFieldValidation = boolean | RegExp | FormFieldValidationFunction;

export interface FieldValidations {
    validation: FormFieldValidation;
    message?: string;
}
