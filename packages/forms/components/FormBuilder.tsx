import { memo, useContext } from "react";
import { FormConfigContext } from "../context/data/context";
import { isFormFieldConfig } from "../guard";
import {
    DefaultBuilderWrapper,
    DefaultFieldWrapper,
    DefaultRowWrapper,
    DefaultSectionWrapper,
} from "../style";
import { FormBuilderComponents, FormBuilderProps, FormFieldConfig } from "../type";
import { FormEntry } from "./FormEntry";

const DefaultComponents: FormBuilderComponents = {
    BuilderWrapper: DefaultBuilderWrapper,
    SectionWrapper: DefaultSectionWrapper,
    RowWrapper: DefaultRowWrapper,
    FieldWrapper: DefaultFieldWrapper,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormBuilder = <T extends FormFieldConfig<string, any, any>>({
    Components = DefaultComponents,
    children,
}: FormBuilderProps<T>) => {
    return <FormBuilderComponent Components={Components}>{children}</FormBuilderComponent>;
};

const FormBuilderComponent = memo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends FormFieldConfig<string, any, any>>({
        Components = DefaultComponents,
        children,
    }: FormBuilderProps<T>) => {
        const { BuilderWrapper } = Components;
        const { config } = useContext(FormConfigContext);

        const Wrapper = BuilderWrapper ?? DefaultBuilderWrapper;

        return (
            <Wrapper>
                {config.map((entry, index) => (
                    <FormEntry
                        key={index + (isFormFieldConfig(entry) ? entry.name : "")}
                        entry={entry}
                        Components={{ ...DefaultComponents, ...Components }}>
                        {children}
                    </FormEntry>
                ))}
            </Wrapper>
        );
    }
);

FormBuilderComponent.displayName = "FormBuilderComponent";
