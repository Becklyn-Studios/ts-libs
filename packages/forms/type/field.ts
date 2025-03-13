/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldConditions } from "./condition";
import { FormData, FormInputFunc } from "./form";
import { FieldValidations, FormValidationStrategy } from "./validation";

export type FormFieldConfig<Type extends string, FieldConfig, InitialValue> = {
    type: Type extends infer U ? U : never;
    name: string;
    initialValue?: InitialValue extends infer U ? U : never;
    conditions?: FormFieldConditions;
    validationStrategy?: FormValidationStrategy;
    validations?: readonly FieldValidations[];
    columns?: number;
    categories?: readonly string[];
    valueFn?: (data: FormData<FormFieldConfig<string, any, any>>) => any;
    onInput?: FormInputFunc<
        FormFieldConfig<
            Type extends infer U ? U : never,
            FieldConfig extends infer U ? U : never,
            InitialValue extends infer U ? U : never
        >,
        InitialValue extends infer U ? U : never
    >;
    fieldConfig: FormFieldConfigFunc<FieldConfig>;
};

export type FormFieldConfigFunc<FieldConfig = unknown> =
    | FieldConfig
    | ((props: { value: any; data: FormData<FormFieldConfig<string, any, any>> }) => FieldConfig);

export type ResolveFieldConfigFunc<T extends FormFieldConfig<string, any, any>> = T extends {
    fieldConfig: infer U;
}
    ? U extends (...args: any[]) => any
        ? never
        : T & { fieldConfig: U }
    : never;
