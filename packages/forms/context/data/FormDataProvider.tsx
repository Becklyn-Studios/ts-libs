/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsWithChildren, useContext, useRef } from "react";
import { FormStore, useFormStore } from "../../hook/useFormStore";
import {
    FormConfig,
    FormData,
    FormErrors,
    FormFieldConfig,
    FormInputFunc,
    FormValidationStrategy,
} from "../../type";
import { initialValuesFromConfig } from "../../util";
import { FormConfigContext, FormDataContext } from "./context";

export interface FormProviderProps<T extends FormFieldConfig<string, any, any>> {
    config: FormConfig<T>;
    data?: FormStore<FormData<T>>;
    errors?: FormStore<FormErrors>;
    editData?: FormStore<FormData<T>>;
    initialData?: FormData<T>;
    inheritData?: boolean;
    inheritErrors?: boolean;
    validationStrategy?: FormValidationStrategy;
    /**
     * @deprecated Use the field config's 'onInput' callback instead
     */
    onInput?: FormInputFunc<T, any>;
}

export const FormDataProvider = <T extends FormFieldConfig<string, any, any>>({
    config,
    initialData,
    children,
    ...props
}: PropsWithChildren<FormProviderProps<T>>) => {
    if (!config) {
        throw new Error("Config is undefined");
    }

    const initialDataRef = useRef<FormData<T> | undefined>({
        ...initialValuesFromConfig(config),
        ...(initialData ?? {}),
    });

    return (
        <FormConfigContext.Provider value={{ config }}>
            <FormDataReadyProvider {...props} initialData={initialDataRef.current}>
                {children}
            </FormDataReadyProvider>
        </FormConfigContext.Provider>
    );
};

const FormDataReadyProvider = <T extends FormFieldConfig<string, any, any>>({
    initialData,
    inheritData,
    inheritErrors,
    children,
    data: inputData,
    editData: inputEditData,
    errors: inputErrors,
}: PropsWithChildren<Omit<FormProviderProps<T>, "config">>) => {
    const externalContext = useContext(FormDataContext);

    const internalData = useFormStore<FormData<T>>(initialData ?? {});
    const internalEditData = useFormStore<FormData<T>>({});
    const internalErrors = useFormStore<FormErrors>({});

    const data =
        inputData || (inheritData && externalContext ? externalContext.data : internalData);
    const editData =
        inputEditData ||
        (inheritData && externalContext ? externalContext.editData : internalEditData);
    const errors =
        inputErrors || (inheritErrors && externalContext ? externalContext.errors : internalErrors);

    return (
        <FormDataContext.Provider value={{ data, editData, errors }}>
            {children}
        </FormDataContext.Provider>
    );
};
