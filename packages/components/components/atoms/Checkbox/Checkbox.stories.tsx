import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox, CheckboxProps } from "./Checkbox";

const InteractiveStory = (args: CheckboxProps) => {
    const [checked, setChecked] = useState(args.checked ?? false);

    return (
        <div className="story-container">
            <Checkbox
                {...args}
                onChange={(check: boolean) => setChecked(check)}
                checked={checked}
            />
        </div>
    );
};

const meta: Meta<typeof Checkbox> = {
    title: "Atoms/Checkbox",
    component: Checkbox,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    render: args => <InteractiveStory {...args} />,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const CheckboxDefault: Story = {
    args: {
        name: "is-checked",
        label: "Is checked",
    },
};

export const CheckboxDisabled: Story = {
    args: {
        name: "is-checked",
        label: "Is checked",
        disabled: true,
    },
};

export const CheckboxDisabledChecked: Story = {
    args: {
        name: "is-checked",
        label: "Is checked",
        disabled: true,
        value: "is-checked",
        checked: true,
    },
};
