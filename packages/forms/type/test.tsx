import { FC, ReactNode } from "react";
import { createFormConfig, fieldsFromConfig } from "../util";
import { FormFieldConfig } from "./field";
import { FormBuilderChildrenProps, FormData } from "./form";

type FieldTypes = FormFieldText | FormFieldNumber | FormField2Number;

type FormFieldText = FormFieldConfig<"text", { label: string }, string>;
type FormFieldNumber = FormFieldConfig<"number", { label: string }, number>;
type FormField2Number = FormFieldConfig<"number", { label: string }, number>;

const textFieldConfig: FormFieldText = {
    type: "text",
    name: "textName",
    validations: [],
    fieldConfig: {
        label: "Name",
    },
    initialValue: "",
};
const numberFieldConfig: FormFieldNumber = {
    type: "number",
    name: "numberName",
    validations: [],
    fieldConfig: {
        label: "Name",
    },
    initialValue: 123,
};
const number2FieldConfig: FormField2Number = {
    type: "number",
    name: "numberName2",
    validations: [],
    fieldConfig: {
        label: "Name",
    },
    initialValue: 123,
};

export const userFormConfig = createFormConfig([
    textFieldConfig,
    numberFieldConfig,
    {
        type: "row",
        content: [number2FieldConfig],
    },
]);

const a = fieldsFromConfig(userFormConfig);

const x: FormData<FieldTypes> = {
    textName: "",
    numberName: true,
    g: "",
};

// const b = initialValuesFromConfig(userFormConfig);
console.log(x);

export const FieldComponent: FC<FormBuilderChildrenProps<FieldTypes>> = ({
    value,
    error,
    field,
    onInput,
    onBlur,
}): ReactNode => {
    const id = useId();

    switch (field.type) {
        case "text": {
            // const { fieldConfig } = field;
            return <div>text</div>;
        }
        case "number": {
            // const { fieldConfig } = field;
            return <div>nubmer</div>;
        }
    }
};
