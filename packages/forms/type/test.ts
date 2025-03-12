import { FormConfig } from "./config";
import { FormFieldConfig } from "./field";

export interface TextConfigProps {
    type: "text";
    placeholder: string;
    label?: string;
    editLabel?: string;
    maxLength?: number;
    info?: string;
    suffix?: string;
    hideValidation?: boolean;
    hasCapsLockDetection?: boolean;
    isSecret?: boolean;
    disabled?: boolean;
}

type FormFieldTypes =
    | FormFieldConfig<"text", TextConfigProps>
    | FormFieldConfig<"button", TextConfigProps>;

const configAllFields: FormConfig<FormFieldTypes> = [
    {
        type: "button",
        name: "text",
        validations: [{ validation: true }],
        fieldConfig: {
            placeholder: "text",
            type: "text",
        },
    },
];
console.log(configAllFields);
