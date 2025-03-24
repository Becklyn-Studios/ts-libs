import { PropsWithChildren, useContext, useMemo } from "react";
import { FormFieldConfig } from "type";
import { useFormValidations } from "../hook/useFormValidations";
import { fieldsFromConfig } from "../util";
import { FormContext, useForm } from "./context";
import { FormDataProvider, FormProviderProps } from "./data/FormDataProvider";
import { FormDataContext } from "./data/context";

export const FormProvider = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
>({
    children,
    ...props
}: PropsWithChildren<FormProviderProps<T, GlobalFormData>>) => {
    const externalForm = useForm<T, GlobalFormData>();
    const { data, editData } = useContext(FormDataContext);
    const { config, validationStrategy = "blur", onInput: internalOnInput, inheritData } = props;

    const onInput = inheritData && externalForm ? externalForm.onInput : internalOnInput;

    const fieldConfigs = useMemo(() => {
        return fieldsFromConfig(config);
    }, [config]);

    const formValidations = useFormValidations(config, fieldConfigs);

    return (
        <FormDataProvider<T, GlobalFormData> {...props}>
            <FormContext.Provider
                value={{
                    ...formValidations,
                    data,
                    editData,
                    fieldConfigs,
                    validationStrategy,
                    // @ts-expect-error - ts is not able to infer the correct type
                    onInput,
                }}>
                {children}
            </FormContext.Provider>
        </FormDataProvider>
    );
};
