import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle, ToggleProps } from "./Toggle";

const InteractiveStory = (args: ToggleProps) => {
    const [active, setActive] = useState(args.active ?? false);

    return (
        <div className="story-container">
            <Toggle {...args} active={active} onToggle={() => setActive(!active)} />
        </div>
    );
};

const meta: Meta<typeof Toggle> = {
    title: "Atoms/Toggle/Toggle",
    component: Toggle,
    parameters: {
        layout: "centered",
    },
    render: args => <InteractiveStory {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "Toggle",
    },
};

export const Active: Story = {
    args: {
        active: true,
    },
};
