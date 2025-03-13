/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, PropsWithChildren, ReactNode } from "react";
// import { FormConfig } from "./config";
import { FormFieldConfig } from "./field";
import { FormError } from "./validation";

export type FormData<T extends FormFieldConfig<string, any, any>> = {
    [K in T["name"]]: Extract<T, { name: K }>["initialValue"];
};

export interface FormBuilderComponents {
    BuilderWrapper: JSXElementConstructor<PropsWithChildren>;
    SectionWrapper: JSXElementConstructor<PropsWithChildren>;
    RowWrapper: JSXElementConstructor<PropsWithChildren>;
    FieldWrapper: JSXElementConstructor<PropsWithChildren<{ columns?: number }>>;
}

export interface FormBuilderChildrenProps<T extends FormFieldConfig<string, any, any>> {
    value: any;
    error: FormError | undefined;
    onInput: (value: any) => void;
    onBlur: () => void;
    field: T;
}

export interface FormBuilderProps<T extends FormFieldConfig<string, any, any>> {
    Components?: Partial<FormBuilderComponents>;
    children(props: FormBuilderChildrenProps<T>): ReactNode;
}

export interface FormInputFuncProps<Field extends FormFieldConfig<string, any, any>, InitialValue> {
    value: InitialValue;
    field: Field;
    previousData: FormData<Field>;
}

export type FormInputFunc<Field extends FormFieldConfig<string, any, any>, InitialValue> = (
    props: FormInputFuncProps<Field, InitialValue>
) => FormData<FormFieldConfig<string, any, any>>;

// Type 'FormFieldText' is not assignable to type 'FormEntryConfig<FormFieldConfig<string, unknown, unknown, FormFieldText | FormFieldNumber>>'.
//   Type 'FormFieldText' is not assignable to type 'FormFieldConfig<string, unknown, unknown, FormFieldText | FormFieldNumber>'.
//     Types of property 'onInput' are incompatible.
//       Type 'FormInputFunc<FormFieldConfig<"text", { label: string; }, string, never>, never, string> | undefined' is not assignable to type 'FormInputFunc<FormFieldConfig<string, unknown, unknown, FormFieldText | FormFieldNumber>, FormFieldText | FormFieldNumber, unknown> | undefined'.
//         Type 'FormInputFunc<FormFieldConfig<"text", { label: string; }, string, never>, never, string>' is not assignable to type 'FormInputFunc<FormFieldConfig<string, unknown, unknown, FormFieldText | FormFieldNumber>, FormFieldText | FormFieldNumber, unknown>'.
//           Types of parameters 'props' and 'props' are incompatible.
//             Type 'FormInputFuncProps<FormFieldConfig<string, unknown, unknown, FormFieldText | FormFieldNumber>, FormFieldText | FormFieldNumber, unknown>' is not assignable to type 'FormInputFuncProps<FormFieldConfig<"text", { label: string; }, string, never>, never, string>'.
//               Types of property 'value' are incompatible.
//                 Type 'unknown' is not assignable to type 'string'.ts(2322)
