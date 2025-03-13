import { FC, useCallback, useEffect, useState } from "react";
import { fieldFulfillsConditions } from "../condition";
import { useForm } from "../context";
import { isFormCustomConfig, isFormRowConfig, isFormSectionConfig } from "../guard";
import { FormBuilderComponents, FormBuilderProps, FormData, FormEntryConfig } from "../type";
import { someFieldConfigs } from "../util";
import { FormCustom } from "./FormCustom";
import { FormField } from "./FormField";
import { FormRow } from "./FormRow";
import { FormSection } from "./FormSection";

interface FormEntryProps {
    Components: FormBuilderComponents;
    entry: FormEntryConfig;
    children: FormBuilderProps["children"];
}

export const FormEntry: FC<FormEntryProps> = ({ Components, entry, children }) => {
    const { data, fieldConfigs } = useForm();

    const getHasChildren = useCallback(
        (formData: FormData) => {
            switch (true) {
                case isFormRowConfig(entry):
                case isFormSectionConfig(entry):
                case isFormCustomConfig(entry):
                    return someFieldConfigs([entry], field =>
                        fieldFulfillsConditions(field, fieldConfigs, formData)
                    );
                default:
                    return fieldFulfillsConditions(entry, fieldConfigs, formData);
            }
        },
        [entry, fieldConfigs]
    );

    const [hasChildren, setHasChildren] = useState(getHasChildren(data.get()));

    useEffect(() => {
        const remove = data.subscribe(() => {
            setHasChildren(getHasChildren(data.get()));
        });

        return () => remove();
    }, [getHasChildren, data]);

    if (!hasChildren) {
        return null;
    }

    switch (true) {
        case isFormCustomConfig(entry):
            return (
                <FormCustom custom={entry} Components={Components}>
                    {children}
                </FormCustom>
            );
        case isFormSectionConfig(entry):
            return (
                <FormSection section={entry} Components={Components}>
                    {children}
                </FormSection>
            );
        case isFormRowConfig(entry):
            return (
                <FormRow row={entry} Components={Components}>
                    {children}
                </FormRow>
            );
        default:
            return (
                <FormField field={entry} Components={Components}>
                    {children}
                </FormField>
            );
    }
};
