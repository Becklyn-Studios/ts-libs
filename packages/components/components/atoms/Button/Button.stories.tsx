import clsx from "clsx";
import styles from "@becklyn/components/.storybook/Story.module.scss";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "Atoms/Button/Button",
    component: Button,
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
            <div className={clsx(styles.storyContainer, styles.large, styles.flex)}>
                <Button {...args} onClick={handleOnClick} />
                <Button {...args} href="#">
                    Button as Link
                </Button>
            </div>
        );
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

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
