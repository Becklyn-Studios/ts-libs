/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldConditions } from "./condition";
import { FormConfig } from "./config";
import { FormData, FormInputFunc } from "./form";
import { FieldValidations, FormValidationStrategy } from "./validation";

export type FormFieldConfig<
    Type extends string,
    FieldConfig,
    InitialValue,
    AllFields extends FormFieldConfig<string, unknown, unknown, AllFields>,
> = {
    type: Type;
    name: string;
    initialValue?: InitialValue;
    conditions?: FormFieldConditions;
    validationStrategy?: FormValidationStrategy;
    validations?: readonly FieldValidations[];
    columns?: number;
    categories?: readonly string[];
    valueFn?: (data: FormData<AllFields>) => any;
    // onInput?: FormInputFunc<
    //     FormFieldConfig<
    //         Type extends infer U ? U : never,
    //         Name extends infer V ? V : never,
    //         FieldConfig,
    //         InitialValue,
    //         AllFields
    //     >,
    //     AllFields,
    //     InitialValue
    // >;
    fieldConfig: FormFieldConfigFunc<AllFields, FieldConfig>;
};

export type FormFieldConfigFunc<
    AllFields extends FormFieldConfig<string, unknown, unknown, AllFields>,
    FieldConfig = unknown,
> = FieldConfig | ((props: { value: any; data: FormData<AllFields> }) => FieldConfig);

export type ResolveFieldConfigFunc<T extends FormFieldConfig<string, unknown, unknown, T>> =
    T extends {
        fieldConfig: infer U;
    }
        ? U extends (...args: any[]) => any
            ? never
            : T & { fieldConfig: U }
        : never;
