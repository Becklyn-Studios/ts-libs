import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioGroupProps } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
    title: "Atoms/RadioGroup",
    component: RadioGroup,
    parameters: {
        layout: "centered",
    },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const defaultArgs: RadioGroupProps = {
    name: "vegetables",
    label: "Choose a vegetable",
    items: [
        { value: "Pickle" },
        { value: "Tomato" },
        { value: "Carrot" },
        { value: "Disabled field", disabled: true },
    ],
};

export const Default: Story = {
    args: defaultArgs,
};

export const Horizontal: Story = {
    args: { ...defaultArgs, orientation: "horizontal" },
};

export const WithDefaultValue: Story = {
    args: { ...defaultArgs, defaultValue: "Pickle" },
};

export const Disabled: Story = {
    args: { ...defaultArgs, defaultValue: "Pickle", disabled: true },
};

export const Required: Story = {
    args: { ...defaultArgs, required: true },
};
