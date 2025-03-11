import React from "react";
import { FormBuilderComponents, FormBuilderProps, FormRowConfig } from "../type";
import { FormEntry } from "./FormEntry";

interface FormRowProps {
    Components: FormBuilderComponents;
    row: FormRowConfig;
    children: FormBuilderProps["children"];
}

export const FormRow: React.FC<FormRowProps> = ({ Components, row, children }) => {
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
