import {
    FormBuilderComponents,
    FormBuilderProps,
    FormFieldConfig,
    FormSectionConfig,
} from "../type";
import { FormEntry } from "./FormEntry";

interface FormSectionProps<T extends FormFieldConfig> {
    Components: FormBuilderComponents;
    section: FormSectionConfig<T>;
    children: FormBuilderProps["children"];
}

export const FormSection = <T extends FormFieldConfig>({
    Components,
    section,
    children,
}: FormSectionProps<T>) => {
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
