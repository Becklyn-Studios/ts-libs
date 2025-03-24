/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import { FormStore } from "../../hook/useFormStore";
import { FormConfig, FormErrors, FormFieldConfig } from "../../type";

export type FormConfigContextProps<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> = {
    config: FormConfig<T, GlobalFormData>;
};

export const FormConfigContext = createContext<
    FormConfigContextProps<FormFieldConfig<string, any, any>, Record<string, any>>
>(
    undefined as unknown as FormConfigContextProps<
        FormFieldConfig<string, any, any>,
        Record<string, any>
    >
);

export interface FormDataContextProps<GlobalFormData extends Record<string, any>> {
    data: FormStore<GlobalFormData>;
    editData: FormStore<GlobalFormData>;
    errors: FormStore<FormErrors>;
}

export const FormDataContext = createContext<FormDataContextProps<any>>(
    undefined as unknown as FormDataContextProps<any>
);
