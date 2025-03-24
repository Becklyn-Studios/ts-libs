import { FC, useId, useMemo, useState } from "react";
import { FormBuilder } from "../components/FormBuilder";
import { FormProvider, useForm } from "../context";
import {
    eitherOr,
    generateFormFieldConfigFn,
    generateInitialValue,
    generateOnInput,
    generateValueFn,
} from "../util";
import { FormConfig } from "./config";
import { FormFieldConfig, FormFieldConfigFunc } from "./field";
import { FormBuilderChildrenProps } from "./form";

interface BaseFieldConfig {
    placeholder: string;
    label?: string;
    maxLength?: number;
}

type StringFieldConfig = FormFieldConfig<"string", BaseFieldConfig, string | null>;
type NumberFieldConfig = FormFieldConfig<"number", BaseFieldConfig, number>;

type AllConfigs = StringFieldConfig | NumberFieldConfig;

const initialState = {
    Firstname: generateInitialValue<StringFieldConfig>(""),
    Lastname: generateInitialValue<StringFieldConfig>(""),
    Age: generateInitialValue<NumberFieldConfig>(undefined),
};

type FormData = typeof initialState;

const userFormConfig = [
    {
        type: "row",
        content: [
            {
                type: "string",
                name: "Firstname",
                fieldConfig: {
                    placeholder: "Enter your firstname",
                    label: "Firstname",
                },
            },
            {
                type: "string",
                name: "Lastname",
                valueFn: generateValueFn<FormData>(data => data.Lastname || "default value"),
                onInput: generateOnInput<StringFieldConfig, FormData>(
                    ({ field, value, previousData }) => {
                        console.log("value", value);
                        console.log("field", field);

                        return { ...previousData };
                    }
                ),
                fieldConfig: generateFormFieldConfigFn<StringFieldConfig, FormData>(
                    ({ data, value }) => {
                        console.log("data", data);
                        console.log("value", value);

                        return {
                            placeholder: "Enter your lastname",
                            label: "Lastname",
                        };
                    }
                ),
            },
        ],
    },
    {
        type: "number",
        name: "Age",
        fieldConfig: {
            placeholder: "Enter your age",
            label: "Age",
        },
    },
] as const satisfies FormConfig<AllConfigs, FormData>;

// type FormType = typeof testFormConfig;

// type Flat = FlattenForm<FormType, GlobalFormData>;

// type Data = FormData<Flat, GlobalFormData>;

interface TextProps {
    id: string;
    value?: string | null;
    onBlur: () => void;
    name: string;
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fieldConfig: FormFieldConfigFunc<FormData, string | null, BaseFieldConfig>;
}

const Text = ({ id, value, onBlur, name, onInput, fieldConfig }: TextProps) => {
    return (
        <input
            {...fieldConfig}
            id={id}
            value={value ?? ""}
            onBlur={onBlur}
            name={name}
            type="text"
            onChange={onInput}
        />
    );
};

interface NumberProps {
    id: string;
    value?: number;
    onBlur: () => void;
    name: string;
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fieldConfig: FormFieldConfigFunc<FormData, number, BaseFieldConfig>;
}

const Number = ({ id, value, onBlur, name, onInput, fieldConfig }: NumberProps) => {
    return (
        <input
            {...fieldConfig}
            id={id}
            value={value ?? ""}
            onBlur={onBlur}
            name={name}
            type="number"
            onChange={onInput}
        />
    );
};

const FieldComponent: FC<FormBuilderChildrenProps<AllConfigs, FormData>> = ({
    value,
    field,
    onBlur,
    onInput,
}) => {
    const id = useId();

    switch (field.type) {
        case "string": {
            const { name, fieldConfig } = field;

            return (
                <Text
                    id={id}
                    value={value}
                    onBlur={onBlur}
                    name={name}
                    onInput={onInput}
                    fieldConfig={fieldConfig}
                />
            );
        }
        case "number": {
            const { name, fieldConfig } = field;

            return (
                <Number
                    id={id}
                    value={value}
                    onBlur={onBlur}
                    name={name}
                    onInput={onInput}
                    fieldConfig={fieldConfig}
                />
            );
        }
    }
};

export const FormRenderer: React.FC = () => {
    return (
        <FormBuilder<AllConfigs, FormData>>{props => <FieldComponent {...props} />}</FormBuilder>
    );
};

export const LoginFormHandler = () => {
    const { validateForm } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (formErrors) {
            return;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormRenderer />
            <button type="submit">Submit</button>
        </form>
    );
};

export const Component = () => {
    const [someCondition] = useState(false);
    useMemo(() => {
        return [
            {
                type: "row",
                content: [
                    eitherOr(
                        someCondition,
                        {
                            type: "string",
                            name: "email",
                            fieldConfig: {
                                placeholder: "Email address",
                                label: "Email",
                            },
                        },
                        {
                            type: "string",
                            name: "phone",
                            fieldConfig: {
                                placeholder: "Phone number",
                                label: "Phone",
                            },
                        }
                    ),
                    eitherOr(
                        someCondition && {
                            type: "string",
                            name: "phone",
                            fieldConfig: {
                                placeholder: "Phone number",
                                label: "Phone",
                            },
                        }
                    ),
                ],
            },
        ] as const satisfies FormConfig<AllConfigs, FormData>;
    }, [someCondition]);

    return (
        <FormProvider<AllConfigs, FormData> config={userFormConfig} initialData={initialState}>
            <LoginFormHandler />
        </FormProvider>
    );
};
