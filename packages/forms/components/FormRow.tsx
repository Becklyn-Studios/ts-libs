import { FormBuilderComponents, FormBuilderProps, FormFieldConfig, FormRowConfig } from "../type";
import { FormEntry } from "./FormEntry";

interface FormRowProps<T extends FormFieldConfig> {
    Components: FormBuilderComponents;
    row: FormRowConfig<T>;
    children: FormBuilderProps["children"];
}

export const FormRow = <T extends FormFieldConfig>({
    Components,
    row,
    children,
}: FormRowProps<T>) => {
    const { RowWrapper } = Components;

    if (!RowWrapper) {
        throw new Error(`No row component found.`);
    }

    return (
        <RowWrapper>
            {row.content.map((entry, index) => (
                <FormEntry key={index} entry={entry} Components={Components}>
                    {children}
                </FormEntry>
            ))}
        </RowWrapper>
    );
};
