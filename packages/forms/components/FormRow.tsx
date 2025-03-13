import { FormBuilderComponents, FormBuilderProps, FormFieldConfig, FormRowConfig } from "../type";
import { FormEntry } from "./FormEntry";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormRowProps<T extends FormFieldConfig<string, any, any>> {
    Components: FormBuilderComponents;
    row: FormRowConfig<T>;
    children: FormBuilderProps<T>["children"];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormRow = <T extends FormFieldConfig<string, any, any>>({
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
