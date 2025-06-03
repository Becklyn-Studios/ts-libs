import { memo, useContext } from "react";
import { FormConfigContext } from "../context/data/context";
import { isFormFieldConfig } from "../guard";
import { FormBuilderProps, FormFieldConfig } from "../type";
import { FormEntry } from "./FormEntry";

export const FormBuilder = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
>({
    Components,
    children,
}: FormBuilderProps<T, GlobalFormData>) => {
    return <FormBuilderComponent Components={Components}>{children}</FormBuilderComponent>;
};

const FormBuilderComponent = memo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends FormFieldConfig<string, any, any, any>, GlobalFormData extends Record<string, any>>({
        Components,
        children,
    }: FormBuilderProps<T, GlobalFormData>) => {
        const { BuilderWrapper } = Components;
        const { config } = useContext(FormConfigContext);

        return (
            <BuilderWrapper>
                {config.map((entry, index) => (
                    <FormEntry
                        key={index + (isFormFieldConfig(entry) ? entry.name : "")}
                        entry={entry}
                        Components={Components}>
                        {children}
                    </FormEntry>
                ))}
            </BuilderWrapper>
        );
    }
);

FormBuilderComponent.displayName = "FormBuilderComponent";
