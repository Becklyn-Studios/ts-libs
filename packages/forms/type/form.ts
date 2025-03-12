/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, PropsWithChildren, ReactNode } from "react";
import { FormFieldConfig, ResolveFieldConfigFunc } from "./field";
import { FormError } from "./validation";

export type FormData = Record<string, any>;

export interface FormBuilderComponents {
    BuilderWrapper: JSXElementConstructor<PropsWithChildren>;
    SectionWrapper: JSXElementConstructor<PropsWithChildren>;
    RowWrapper: JSXElementConstructor<PropsWithChildren>;
    FieldWrapper: JSXElementConstructor<PropsWithChildren<{ columns?: number }>>;
}

export interface FormBuilderChildrenProps {
    value: any;
    error: FormError | undefined;
    onInput: (value: any) => void;
    onBlur: () => void;
    field: ResolveFieldConfigFunc<FormFieldConfig>;
}

export interface FormBuilderProps {
    Components?: Partial<FormBuilderComponents>;
    children(props: FormBuilderChildrenProps): ReactNode;
}

export interface FormInputFuncProps<T extends FormFieldConfig> {
    value: T extends FormFieldConfig<any, any, infer V> ? V : any;
    field: T;
    previousData: FormData;
}

export type FormInputFunc<T extends FormFieldConfig = FormFieldConfig> = (
    props: FormInputFuncProps<T>
) => FormData;
