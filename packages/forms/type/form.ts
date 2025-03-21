/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, PropsWithChildren, ReactNode } from "react";
import { FormFieldConfig } from "./field";
import { FormError } from "./validation";

export type FormData<T extends FormFieldConfig<string, any, any>> = Record<
    string,
    T extends { initialValue?: infer K } ? K : never
>;

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
