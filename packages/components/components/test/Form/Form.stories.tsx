import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field, Form, FormStructure } from "./Form";

const TextField: Field<"text", string> = {
    type: "text",
    render: ({ name, defaultValue }) => (
        <input type="text" name={name} defaultValue={defaultValue} />
    ),
};

const ObjectField: Field<"object", { age: number }> = {
    type: "object",
    render: ({ name, defaultValue }) => (
        <input type="number" name={name} defaultValue={defaultValue.age} />
    ),
};

// @todo:
// - validation on field level, including references to other fields
// - field validation errors
// - submit errors
// - nextjs server action support
// - proper steps support
// - maybe get rid of the as const stuff in the form structure while keeping the type safety
// - no controlled inputs

const meta: Meta<typeof Form> = {
    title: "Form/Form",
    component: Form,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    render: () => {
        return (
            <Form
                fields={[TextField, ObjectField]}
                structure={
                    {
                        steps: [
                            {
                                rows: [
                                    {
                                        fields: [
                                            { name: "name", type: "text", default: "1232" },
                                            { name: "name2", type: "object", default: { age: 3 } },
                                        ],
                                    },
                                ],
                            },
                        ],
                    } as const satisfies FormStructure<typeof TextField | typeof ObjectField>
                }
                onSubmit={data => console.log(data.name2)}
            />
        );
    },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
    args: {},
};
