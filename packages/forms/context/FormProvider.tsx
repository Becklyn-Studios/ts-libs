import { PropsWithChildren, useContext, useMemo } from "react";
import { withFormData } from "../hoc/withFormData";
import { useFormValidations } from "../hook/useFormValidations";
import { fieldsFromConfig } from "../util";
import { FormContext, useForm } from "./context";
import { FormDataContext } from "./data/context";

export const FormProvider = withFormData<PropsWithChildren>(
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
