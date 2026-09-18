import { memo, use } from "react";
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
        const { config } = use(FormConfigContext);

        return (
            <BuilderWrapper>
                {config.map((entry, index) => (
                    <FormEntry
                        // eslint-disable-next-line react-x/no-array-index-key -- form config is static; row/section/custom entries carry no stable id
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
