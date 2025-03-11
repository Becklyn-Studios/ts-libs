import { createContext } from "react";
import { FormStore } from "../../hook/useFormStore";
import { FormConfig, FormData, FormErrors } from "../../type";

export type FormConfigContext = {
    config: FormConfig;
};

export const FormConfigContext = createContext<FormConfigContext>(
    undefined as unknown as FormConfigContext
);

export interface FormDataContext {
    data: FormStore<FormData>;
    editData: FormStore<FormData>;
    errors: FormStore<FormErrors>;
}

export const FormDataContext = createContext<FormDataContext>(
    undefined as unknown as FormDataContext
);
