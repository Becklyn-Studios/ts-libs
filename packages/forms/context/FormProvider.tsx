import { PropsWithChildren, useContext, useMemo } from "react";
import { FormFieldConfig } from "type";
import { withFormData } from "../hoc/withFormData";
import { useFormValidations } from "../hook/useFormValidations";
import { fieldsFromConfig } from "../util";
import { FormContext, useForm } from "./context";
import { FormDataContext } from "./data/context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormProvider = withFormData<FormFieldConfig<string, any, any>, PropsWithChildren>(
    ({ config, validationStrategy = "blur", onInput: internalOnInput, inheritData, children }) => {
        const externalForm = useForm();
        const { data, editData } = useContext(FormDataContext);

        const onInput = inheritData && externalForm ? externalForm.onInput : internalOnInput;

        const fieldConfigs = useMemo(() => {
            return fieldsFromConfig(config);
        }, [config]);

        const formValidations = useFormValidations(config, fieldConfigs);

        return (
            <FormContext.Provider
                value={{
                    ...formValidations,
                    data,
                    editData,
                    fieldConfigs,
                    validationStrategy,
                    onInput,
                }}>
                {children}
            </FormContext.Provider>
        );
    }
);
