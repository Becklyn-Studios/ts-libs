/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldConditions } from "./condition";
import { FormData, FormInputFunc } from "./form";
import { FieldValidations, FormValidationStrategy } from "./validation";

export type CustomFormFieldConfig = object;

export type FormFieldConfig = CustomFormFieldConfig extends { [P in "fields"]: infer U }
    ? U
    : FormFieldBasicConfig<"placeholder">;

export interface FormFieldBasicConfig<
    Type extends string,
    FieldConfig = unknown,
    InitialValue = any,
> {
    type: Type;
    name: string;
    initialValue?: InitialValue;
    conditions?: FormFieldConditions;
    validationStrategy?: FormValidationStrategy;
    validations?: readonly FieldValidations[];
    columns?: number;
    categories?: readonly string[];
    valueFn?: (data: FormData) => any;
    onInput?: FormInputFunc;
    fieldConfig: FormFieldConfigFunc<FieldConfig>;
}

export type FormFieldConfigFunc<FieldConfig = unknown> =
    | FieldConfig
    | ((props: { value: any; data: FormData }) => FieldConfig);

export type ResolveFieldConfigFunc<T extends FormFieldBasicConfig<any>> = T extends {
    fieldConfig: infer U;
}
    ? U extends (...args: any[]) => any
        ? never
        : T & { fieldConfig: U }
    : never;
