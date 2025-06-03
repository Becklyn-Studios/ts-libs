/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, PropsWithChildren, ReactNode } from "react";
import { FormFieldConfig } from "./field";
import { FormError } from "./validation";

export interface FormBuilderComponents {
    BuilderWrapper: JSXElementConstructor<PropsWithChildren>;
    SectionWrapper: JSXElementConstructor<PropsWithChildren>;
    RowWrapper: JSXElementConstructor<PropsWithChildren>;
    FieldWrapper: JSXElementConstructor<PropsWithChildren<{ columns?: number }>>;
}

type FormBuilderChildrenFieldConfig<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> = Omit<T, "fieldConfig"> & {
    fieldConfig: T extends FormFieldConfig<string, infer F, any, GlobalFormData> ? F : never;
};

export interface FormBuilderChildrenProps<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> {
    value: any;
    error: FormError | undefined;
    onInput: (value: any) => void;
    onBlur: () => void;
    field: FormBuilderChildrenFieldConfig<T, GlobalFormData>;
}

export interface FormBuilderProps<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> {
    Components: FormBuilderComponents;
    children(props: FormBuilderChildrenProps<T, GlobalFormData>): ReactNode;
}

export interface FormInputFuncProps<
    Field extends FormFieldConfig<string, any, any, GlobalFormData>,
    DataType,
    GlobalFormData extends Record<string, any>,
> {
    value: DataType | undefined;
    field: Field;
    previousData: GlobalFormData;
}

export type FormInputFunc<
    Field extends FormFieldConfig<string, any, any, GlobalFormData>,
    DataType,
    GlobalFormData extends Record<string, any>,
> = (props: FormInputFuncProps<Field, DataType, GlobalFormData>) => GlobalFormData;
