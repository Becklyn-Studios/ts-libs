import React from "react";
import {
    FormBuilderComponents,
    FormBuilderProps,
    FormCustomConfig,
    FormFieldConfig,
} from "../type";
import { FormEntry } from "./FormEntry";

interface FormCustomProps<T extends FormFieldConfig> {
    Components: FormBuilderComponents;
    custom: FormCustomConfig<T>;
    children: FormBuilderProps["children"];
}

export const FormCustom = <T extends FormFieldConfig>({
    Components,
    custom,
    children,
}: FormCustomProps<T>) => {
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
