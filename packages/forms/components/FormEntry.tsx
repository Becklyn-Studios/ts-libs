import { useCallback, useEffect, useState } from "react";
import { fieldFulfillsConditions } from "../condition";
import { useForm } from "../context";
import { isFormCustomConfig, isFormRowConfig, isFormSectionConfig } from "../guard";
import { FormBuilderComponents, FormBuilderProps, FormEntryConfig, FormFieldConfig } from "../type";
import { someFieldConfigs } from "../util";
import { FormCustom } from "./FormCustom";
import { FormField } from "./FormField";
import { FormRow } from "./FormRow";
import { FormSection } from "./FormSection";

interface FormEntryProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
> {
    Components: FormBuilderComponents;
    entry: FormEntryConfig<T, GlobalFormData>;
    children: FormBuilderProps<T, GlobalFormData>["children"];
}

export const FormEntry = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
>({
    Components,
    entry,
    children,
}: FormEntryProps<T, GlobalFormData>) => {
    const { data, fieldConfigs } = useForm<T, GlobalFormData>();

    const getHasChildren = useCallback(
        (formData: GlobalFormData) => {
            switch (true) {
                case isFormRowConfig(entry):
                case isFormSectionConfig(entry):
                case isFormCustomConfig(entry):
                    return someFieldConfigs([entry], field =>
                        field ? fieldFulfillsConditions(field, fieldConfigs, formData) : false
                    );
                default:
                    return entry ? fieldFulfillsConditions(entry, fieldConfigs, formData) : false;
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
                entry && (
                    <FormField field={entry} Components={Components}>
                        {children}
                    </FormField>
                )
            );
    }
};
