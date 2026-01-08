import { FC, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { TextInput, TextInputProps } from "./TextInput";

const InteractiveInput: FC<TextInputProps> = args => {
    const [value, setValue] = useState("");

    return <TextInput {...args} value={value} onChange={setValue} />;
};

const meta: Meta<typeof TextInput> = {
    title: "Atoms/TextInput",
    component: TextInput,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        label: { control: "text" },
        placeholder: { control: "text" },
        disabled: { control: "boolean" },
        error: { control: "text" },
    },
    render: args => <InteractiveInput {...args} />,
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
    args: {
        label: "Label",
        placeholder: "Text Label",
    },
};

export const WithoutLabel: Story = {
    args: {
        placeholder: "Text Label",
    },
};

export const Error: Story = {
    args: {
        label: "Label",
        placeholder: "Text Label",
        error: "Lorem ipsum",
    },
};

export const Disabled: Story = {
    args: {
        label: "Label",
        placeholder: "Text Label",
        disabled: true,
    },
};
