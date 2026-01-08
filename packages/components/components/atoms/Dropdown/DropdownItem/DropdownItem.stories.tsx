import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropdownItem, DropdownItemProps } from "./DropdownItem";

const InteractiveStory = (args: DropdownItemProps) => {
    const [selected, setSelected] = useState(args.selected);

    return (
        <div className="story-container large flex">
            <DropdownItem {...args} selected={selected} onClick={() => setSelected(!selected)} />
        </div>
    );
};

const meta: Meta<typeof DropdownItem> = {
    title: "Atoms/Dropdown/DropdownItem",
    component: DropdownItem,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        selected: {
            control: { type: "select" },
            options: ["Off", "On"],
        },
    },
    render: args => <InteractiveStory {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic dropdown item
export const Default: Story = {
    args: {
        label: "Text Label",
    },
};

export const OutlineThemeWithMultiSelect: Story = {
    args: {
        label: "Multi Select Option",
        multiSelect: true,
    },
};
