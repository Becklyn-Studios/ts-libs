/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, createContext, useContext } from "react";
import { FormStore } from "../hook/useFormStore";
import { FormValidations } from "../hook/useFormValidations";
import {
    DeepPartial,
    FormData,
    FormFieldConfig,
    FormInputFunc,
    FormValidationStrategy,
} from "../type";

interface FormContextProps<U extends FormFieldConfig<string, any, any>, TData = FormData<U>>
    extends FormValidations {
    data: FormStore<TData>;
    editData: FormStore<DeepPartial<TData>>;
    fieldConfigs: Record<string, U>;
    validationStrategy: FormValidationStrategy;
    onInput?: FormInputFunc<U, U extends { initialValue?: infer V } ? V : never>;
}

export const FormContext = createContext<FormContextProps<FormFieldConfig<string, any, any>>>(
    undefined as unknown as FormContextProps<FormFieldConfig<string, any, any>>
);

export const useForm = <U extends FormFieldConfig<string, any, any>, TData = FormData<U>>() =>
    useContext(FormContext as unknown as Context<FormContextProps<U, TData>>);
