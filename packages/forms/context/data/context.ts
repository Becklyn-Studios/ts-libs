/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import { FormStore } from "../../hook/useFormStore";
import { FormConfig, FormData, FormErrors, FormFieldConfig } from "../../type";

export type FormConfigContextProps<T extends FormFieldConfig<string, any, any>> = {
    config: FormConfig<T>;
};

export const FormConfigContext = createContext<
    FormConfigContextProps<FormFieldConfig<string, any, any>>
>(undefined as unknown as FormConfigContextProps<FormFieldConfig<string, any, any>>);

export interface FormDataContext<T extends FormFieldConfig<string, any, any>> {
    data: FormStore<FormData<T>>;
    editData: FormStore<FormData<T>>;
    errors: FormStore<FormErrors>;
}

export const FormDataContext = createContext<FormDataContext<FormFieldConfig<string, any, any>>>(
    undefined as unknown as FormDataContext<FormFieldConfig<string, any, any>>
);
