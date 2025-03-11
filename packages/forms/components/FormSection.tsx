import React from "react";
import { FormBuilderComponents, FormBuilderProps, FormSectionConfig } from "../type";
import { FormEntry } from "./FormEntry";

interface FormSectionProps {
    Components: FormBuilderComponents;
    section: FormSectionConfig;
    children: FormBuilderProps["children"];
}

export const FormSection: React.FC<FormSectionProps> = ({ Components, section, children }) => {
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
