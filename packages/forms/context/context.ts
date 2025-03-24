/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, createContext, useContext } from "react";
import { FormStore } from "../hook/useFormStore";
import { FormValidations } from "../hook/useFormValidations";
import { FormFieldConfig, FormInputFunc, FormValidationStrategy } from "../type";

interface FormContextProps<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> extends FormValidations<T, GlobalFormData> {
    data: FormStore<GlobalFormData>;
    editData: FormStore<Partial<GlobalFormData>>;
    fieldConfigs: Record<string, T>;
    validationStrategy: FormValidationStrategy;
    onInput?: FormInputFunc<
        T,
        T extends FormFieldConfig<string, any, infer V, any> ? V : never,
        GlobalFormData
    >;
}

export const FormContext = createContext<FormContextProps<FormFieldConfig<string, any, any>, any>>(
    undefined as unknown as FormContextProps<FormFieldConfig<string, any, any>, any>
);

export const useForm = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>() => useContext(FormContext as unknown as Context<FormContextProps<T, GlobalFormData>>);
