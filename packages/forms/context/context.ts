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

interface FormContext<TData = FormData> extends FormValidations {
    data: FormStore<TData>;
    editData: FormStore<DeepPartial<TData>>;
    fieldConfigs: Record<string, FormFieldConfig>;
    validationStrategy: FormValidationStrategy;
    onInput?: FormInputFunc<FormFieldConfig>;
}

export const FormContext = createContext<FormContext>(undefined as unknown as FormContext);

export const useForm = <T = FormData>() => useContext(FormContext as Context<FormContext<T>>);
