import {
    FormBuilderComponents,
    FormBuilderProps,
    FormFieldConfig,
    FormSectionConfig,
} from "../type";
import { FormEntry } from "./FormEntry";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormSectionProps<T extends FormFieldConfig<string, any, any>> {
    Components: FormBuilderComponents;
    section: FormSectionConfig<T>;
    children: FormBuilderProps<T>["children"];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormSection = <T extends FormFieldConfig<string, any, any>>({
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
