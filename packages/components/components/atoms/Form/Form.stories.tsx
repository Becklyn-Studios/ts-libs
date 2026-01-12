import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Clickable } from "../Clickable/Clickable";
import { Form } from "./Form";
import { DemoFieldType, FormFieldComponents } from "./Form.fields";
import styles from "./Form.stories.module.scss";
import { FormConditions } from "./conditions";
import { TypedFormData } from "./data";
import { FormStep, FormStructure, InferStepsFromStructure } from "./structure";
import { SubmitResponse } from "./types";

const isEmailValid = (email: string) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const meta: Meta<typeof Form> = {
    title: "Atoms/Form",
    component: Form,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
    render: () => {
        return (
            <Form
                className={styles.form}
                fields={FormFieldComponents}
                activeStepClassName=""
                structure={{
                    steps: [
                        {
                            name: "form",
                            fields: [
                                {
                                    type: "text",
                                    name: "email",
                                    label: "Email",
                                },
                                {
                                    name: "submit",
                                    render: ({ className, error, loading }) => (
                                        <Clickable
                                            type="submit"
                                            className={className}
                                            disabled={!!error || loading}>
                                            Submit
                                        </Clickable>
                                    ),
                                },
                            ],
                        },
                    ],
                }}
                validate={async data => {
                    const email = data.email ?? "";
                    const isValid = isEmailValid(email);

                    return {
                        fields: {
                            email: !isValid && "Email is invalid",
                        },
                        form: !isValid ? "Please check the form for errors" : null,
                    };
                }}
                onSubmit={async data => {
                    "use server";
                    const email = data.email ?? "";

                    return isEmailValid(email)
                        ? {
                              success: true,
                          }
                        : {
                              errors: {
                                  fields: {
                                      email: "Email is invalid",
                                  },
                                  form: "Please check the form for errors",
                              },
                          };
                }}
                onError={errors => {
                    console.log("errors", errors);
                }}
                onSuccess={success => {
                    console.log("success", success);
                }}
            />
        );
    },
};

const formStructure = {
    steps: [
        {
            name: "personalInformation",
            className: styles.step,
            fields: [
                {
                    type: "text",
                    name: "firstName",
                    label: "First Name",
                },
                {
                    type: "text",
                    name: "lastName",
                    label: "Last Name",
                },
                {
                    type: "number",
                    name: "age",
                    label: "Age",
                    className: styles.fullWidth,
                    default: 18,
                },
                {
                    name: "next",
                    render: ({ nextStep, className }) => (
                        <Clickable type="button" onClick={nextStep} className={className}>
                            Next
                        </Clickable>
                    ),
                },
            ],
        },
        {
            name: "comment",
            className: styles.step,
            fields: [
                {
                    type: "text",
                    name: "comment",
                    label: "Comment",
                    className: styles.fullWidth,
                },
                {
                    name: "error",
                    render: ({ error, className }) => (
                        <div
                            className={clsx(
                                className,
                                styles.fullWidth,
                                styles.error,
                                !error && styles.hidden
                            )}>
                            {error}
                        </div>
                    ),
                },
                {
                    name: "back",
                    render: ({ prevStep, className }) => (
                        <Clickable type="button" onClick={prevStep} className={className}>
                            Back
                        </Clickable>
                    ),
                },
                {
                    name: "submit",
                    render: ({ className }) => (
                        <Clickable type="submit" className={className}>
                            Submit
                        </Clickable>
                    ),
                },
            ],
        },
    ],
} as const satisfies FormStructure<readonly FormStep<string, DemoFieldType>[]>;

const validateForm = async (data: TypedFormData<DemoFieldType, typeof formStructure>) => {
    const age = data.age ?? 0;

    return {
        fields: {
            age: age <= 1 && "Age must be greater than 1",
        },
        form: age <= 1 ? "Please check the form for errors" : null,
    };
};

const formConditions: FormConditions<
    DemoFieldType,
    InferStepsFromStructure<typeof formStructure>
> = {
    fields: {
        lastName: async data => data.age && data.age >= 18,
    },
};

const onSubmitForm = async (
    data: TypedFormData<DemoFieldType, typeof formStructure>
): Promise<SubmitResponse<FormStructure<InferStepsFromStructure<typeof formStructure>>>> => {
    "use server";

    return data.age && data.age > 2
        ? {
              success: true,
          }
        : {
              errors: {
                  fields: {
                      age: "Age must be greater than 2",
                  },
                  form: "Please check the form for errors",
              },
          };
};

export const AdvancedForm: Story = {
    render: () => {
        return (
            <Form
                className={styles.form}
                fields={FormFieldComponents}
                activeStepClassName={styles.active}
                hiddenStepClassName={styles.hidden}
                hiddenFieldClassName={styles.hidden}
                structure={formStructure}
                validate={validateForm}
                conditions={formConditions}
                onSubmit={onSubmitForm}
                onError={errors => {
                    console.log("errors", errors);
                }}
                onSuccess={success => {
                    console.log("success", success);
                }}
            />
        );
    },
};

export const AdvancedFormWithState: Story = {
    render: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [data, setData] = useState<TypedFormData<DemoFieldType, typeof formStructure> | null>(
            null
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            console.log("data", data);
        }, [data]);

        return (
            <Form
                className={styles.form}
                fields={FormFieldComponents}
                activeStepClassName={styles.active}
                hiddenStepClassName={styles.hidden}
                hiddenFieldClassName={styles.hidden}
                structure={formStructure}
                validate={validateForm}
                conditions={formConditions}
                onSubmit={onSubmitForm}
                onError={errors => {
                    console.log("errors", errors);
                }}
                onSuccess={success => {
                    console.log("success", success);
                }}
                onChange={data => {
                    setData(data);
                }}
            />
        );
    },
};
