import { createContext } from "react";
import { FormStore } from "../../hook/useFormStore";
import { FormConfig, FormData, FormErrors } from "../../type";

export type FormConfigContextProps = {
    config: FormConfig;
};

export const FormConfigContext = createContext<FormConfigContextProps>(
    undefined as unknown as FormConfigContextProps
);

export interface FormDataContext {
    data: FormStore<FormData>;
    editData: FormStore<FormData>;
    errors: FormStore<FormErrors>;
}

export const FormDataContext = createContext<FormDataContext>(
    undefined as unknown as FormDataContext
);
