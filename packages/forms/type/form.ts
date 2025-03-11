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

export interface FormInputFuncProps {
    value: any;
    field: FormFieldConfig;
    previousData: FormData;
}

export type FormInputFunc = (props: FormInputFuncProps) => FormData;
