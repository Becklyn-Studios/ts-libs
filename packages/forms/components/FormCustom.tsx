import React from "react";
import {
    FormBuilderComponents,
    FormBuilderProps,
    FormCustomConfig,
    FormFieldConfig,
} from "../type";
import { FormEntry } from "./FormEntry";

interface FormCustomProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
> {
    Components: FormBuilderComponents;
    custom: FormCustomConfig<T, GlobalFormData>;
    children: FormBuilderProps<T, GlobalFormData>["children"];
}

export const FormCustom = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends FormFieldConfig<string, any, any, GlobalFormData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalFormData extends Record<string, any>,
>({
    Components,
    custom,
    children,
}: FormCustomProps<T, GlobalFormData>) => {
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
