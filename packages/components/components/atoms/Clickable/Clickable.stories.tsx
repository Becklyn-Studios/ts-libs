import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Clickable } from "./Clickable";

const meta: Meta<typeof Clickable> = {
    title: "Atoms/Clickable",
    component: Clickable,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["primary", "secondary", "tertiary"],
        },
        disabled: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
    },
    render: args => {
        const handleOnClick = () => {
            alert("Button clicked!");
        };

        return (
            <div className="story-container large flex">
                <Clickable {...args} onClick={handleOnClick} />
                <Clickable {...args} href="#">
                    Button as Link
                </Clickable>
            </div>
        );
    },
};

export default meta;
type Story = StoryObj<typeof Clickable>;

export const Primary: Story = {
    args: {
        variant: "primary",
        children: "Button",
    },
};

export const PrimaryDisabled: Story = {
    args: {
        variant: "primary",
        children: "Button",
        disabled: true,
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        children: "Button",
    },
};

export const SecondaryDisabled: Story = {
    args: {
        variant: "secondary",
        children: "Button",
        disabled: true,
    },
};

export const Tertiary: Story = {
    args: {
        variant: "tertiary",
        children: "Button",
    },
};

export const TertiaryDisabled: Story = {
    args: {
        variant: "tertiary",
        children: "Button",
        disabled: true,
    },
};
