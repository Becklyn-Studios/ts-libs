import React from "react";
import { FormBuilderComponents, FormBuilderProps, FormCustomConfig } from "../type";
import { FormEntry } from "./FormEntry";

interface FormCustomProps {
    Components: FormBuilderComponents;
    custom: FormCustomConfig;
    children: FormBuilderProps["children"];
}

export const FormCustom: React.FC<FormCustomProps> = ({ Components, custom, children }) => {
    return (
        <React.Fragment>
            {custom.wrapper(
                custom.content.map((entry, index) => (
                    <FormEntry key={index} entry={entry} Components={Components}>
                        {children}
                    </FormEntry>
                ))
            )}
        </React.Fragment>
    );
};
