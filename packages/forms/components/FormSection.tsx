import {
    FormBuilderComponents,
    FormBuilderProps,
    FormFieldConfig,
    FormSectionConfig,
} from "../type";
import { FormEntry } from "./FormEntry";

interface FormSectionProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
> {
    Components: FormBuilderComponents;
    section: FormSectionConfig<T, GlobalFormData>;
    children: FormBuilderProps<T, GlobalFormData>["children"];
}

export const FormSection = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
>({
    Components,
    section,
    children,
}: FormSectionProps<T, GlobalFormData>) => {
    const { SectionWrapper } = Components;

    if (!SectionWrapper) {
        throw new Error(`No section component found.`);
    }

    return (
        <SectionWrapper>
            {section.content.map((entry, index) => (
                <FormEntry key={index} entry={entry} Components={Components}>
                    {children}
                </FormEntry>
            ))}
        </SectionWrapper>
    );
};
