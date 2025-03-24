import { FormBuilderComponents, FormBuilderProps, FormFieldConfig, FormRowConfig } from "../type";
import { FormEntry } from "./FormEntry";

interface FormRowProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
> {
    Components: FormBuilderComponents;
    row: FormRowConfig<T, GlobalFormData>;
    children: FormBuilderProps<T, GlobalFormData>["children"];
}

export const FormRow = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
>({
    Components,
    row,
    children,
}: FormRowProps<T, GlobalFormData>) => {
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
