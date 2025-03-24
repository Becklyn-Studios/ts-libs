/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsWithChildren, useContext, useRef } from "react";
import { FormStore, useFormStore } from "../../hook/useFormStore";
import {
    FormConfig,
    FormErrors,
    FormFieldConfig,
    FormInputFunc,
    FormValidationStrategy,
} from "../../type";
import { FormConfigContext, FormDataContext } from "./context";

export interface FormProviderProps<
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
> {
    config: FormConfig<T, GlobalFormData>;
    initialData: GlobalFormData;
    data?: FormStore<GlobalFormData>;
    errors?: FormStore<FormErrors>;
    editData?: FormStore<GlobalFormData>;
    inheritData?: boolean;
    inheritErrors?: boolean;
    validationStrategy?: FormValidationStrategy;
    /**
     * @deprecated Use the field config's 'onInput' callback instead
     */
    onInput?: FormInputFunc<
        T,
        T extends FormFieldConfig<string, any, infer V, any> ? V : never,
        GlobalFormData
    >;
}

export const FormDataProvider = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>({
    config,
    initialData,
    children,
    ...props
}: PropsWithChildren<FormProviderProps<T, GlobalFormData>>) => {
    if (!config) {
        throw new Error("Config is undefined");
    }

    const initialDataRef = useRef<GlobalFormData>({
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

const FormDataReadyProvider = <
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    GlobalFormData extends Record<string, any>,
>({
    initialData,
    inheritData,
    inheritErrors,
    children,
    data: inputData,
    editData: inputEditData,
    errors: inputErrors,
}: PropsWithChildren<Omit<FormProviderProps<T, GlobalFormData>, "config">>) => {
    const externalContext = useContext(FormDataContext);

    const internalData = useFormStore<Partial<GlobalFormData>>(initialData ?? {});
    const internalEditData = useFormStore<Partial<GlobalFormData>>({});
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
