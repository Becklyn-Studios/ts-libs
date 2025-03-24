/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldConditions } from "./condition";
import { FormInputFunc } from "./form";
import { FieldValidations, FormValidationStrategy } from "./validation";

export type FormFieldConfig<
    Type extends string,
    FieldConfig,
    DataType,
    GlobalFormData extends Record<string, any> = any,
> = {
    type: Type extends infer U ? U : never;
    name: string;
    initialValue?: DataType;
    conditions?: FormFieldConditions;
    validationStrategy?: FormValidationStrategy;
    validations?: readonly FieldValidations<GlobalFormData>[];
    columns?: number;
    categories?: readonly string[];
    valueFn?: (data: GlobalFormData) => any;
    onInput?: FormInputFunc<
        FormFieldConfig<Type, FieldConfig, DataType, GlobalFormData>,
        DataType,
        GlobalFormData
    >;
    fieldConfig: FormFieldConfigFunc<GlobalFormData, DataType, FieldConfig>;
    editStep?: number;
};

export type FormFieldConfigFunc<
    GlobalFormData extends Record<string, any>,
    DataType,
    FieldConfig,
> = FieldConfig | ((props: { value: DataType; data: GlobalFormData }) => FieldConfig);

export type ResolveFieldConfigFunc<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> = T extends {
    fieldConfig: infer U;
}
    ? U extends (...args: any[]) => any
        ? never
        : T & { fieldConfig: U }
    : never;
