import React, { PropsWithChildren, useContext, useRef } from "react";
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

export interface FormProviderProps {
    config: FormConfig;
    data?: FormStore<FormData>;
    errors?: FormStore<FormData>;
    editData?: FormStore<FormData>;
    initialData?: FormData;
    inheritData?: boolean;
    inheritErrors?: boolean;
    validationStrategy?: FormValidationStrategy;
    /**
     * @deprecated Use the field config's 'onInput' callback instead
     */
    onInput?: FormInputFunc<FormFieldConfig>;
}

export const FormDataProvider: React.FC<PropsWithChildren<FormProviderProps>> = ({
    config,
    initialData,
    children,
    ...props
}) => {
    if (!config) {
        throw new Error("Config is undefined");
    }

    const initialDataRef = useRef<FormData | undefined>({
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

const FormDataReadyProvider: React.FC<PropsWithChildren<Omit<FormProviderProps, "config">>> = ({
    initialData,
    inheritData,
    inheritErrors,
    children,
    data: inputData,
    editData: inputEditData,
    errors: inputErrors,
}) => {
    const externalContext = useContext(FormDataContext);

    const internalData = useFormStore<FormData>(initialData ?? {});
    const internalEditData = useFormStore<FormData>({});
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
