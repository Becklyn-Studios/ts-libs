import React from "react";
import {
    FormBuilderComponents,
    FormBuilderProps,
    FormCustomConfig,
    FormFieldConfig,
} from "../type";
import { FormEntry } from "./FormEntry";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormCustomProps<T extends FormFieldConfig<string, any, any>> {
    Components: FormBuilderComponents;
    custom: FormCustomConfig<T>;
    children: FormBuilderProps<T>["children"];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormCustom = <T extends FormFieldConfig<string, any, any>>({
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
