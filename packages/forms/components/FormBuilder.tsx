import { memo, useContext } from "react";
import { FormConfigContext } from "../context/data/context";
import { entryIsField } from "../guard";
import {
    DefaultBuilderWrapper,
    DefaultFieldWrapper,
    DefaultRowWrapper,
    DefaultSectionWrapper,
} from "../style";
import { FormBuilderComponents, FormBuilderProps } from "../type";
import { FormEntry } from "./FormEntry";

const DefaultComponents: FormBuilderComponents = {
    BuilderWrapper: DefaultBuilderWrapper,
    SectionWrapper: DefaultSectionWrapper,
    RowWrapper: DefaultRowWrapper,
    FieldWrapper: DefaultFieldWrapper,
};

export const FormBuilder = memo<FormBuilderProps>(
    ({ Components = DefaultComponents, children }: FormBuilderProps) => {
        const { BuilderWrapper } = Components;
        const { config } = useContext(FormConfigContext);

        const Wrapper = BuilderWrapper ?? DefaultBuilderWrapper;

        return (
            <Wrapper>
                {config.map((entry, index) => (
                    <FormEntry
                        key={index + (entryIsField(entry) ? entry.name : "")}
                        entry={entry}
                        Components={{ ...DefaultComponents, ...Components }}>
                        {children}
                    </FormEntry>
                ))}
            </Wrapper>
        );
    }
);

FormBuilder.displayName = "FormBuilder";
