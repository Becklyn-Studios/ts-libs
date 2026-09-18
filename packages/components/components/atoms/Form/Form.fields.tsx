import { FC } from "react";
import { TextInput } from "../TextInput/TextInput";
import { FieldComponent, FieldComponentRenderProps } from "./types";

const TextField: FC<FieldComponentRenderProps<string>> = ({
    name,
    label,
    defaultValue,
    className,
    error,
}) => {
    return (
        <TextInput
            label={label ?? ""}
            name={name}
            className={className}
            error={error}
            defaultValue={defaultValue}
        />
    );
};

export const TextFieldComponent: FieldComponent<"text", string> = {
    type: "text",
    parseValue: value => value as string,
    render: TextField,
};

const NumberField: FC<FieldComponentRenderProps<number>> = ({
    name,
    label,
    defaultValue,
    className,
    error,
}) => {
    return (
        <TextInput
            label={label ?? ""}
            type="number"
            name={name}
            className={className}
            error={error}
            defaultValue={defaultValue}
        />
    );
};

export const NumberFieldComponent: FieldComponent<"number", number> = {
    type: "number",
    parseValue: value => parseInt(value as string),
    render: NumberField,
};

export const FormFieldComponents = [TextFieldComponent, NumberFieldComponent];
export type DemoFieldType = (typeof FormFieldComponents)[number];
