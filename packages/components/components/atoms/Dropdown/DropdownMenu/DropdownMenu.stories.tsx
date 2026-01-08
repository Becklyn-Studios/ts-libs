import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropdownMenu, DropdownMenuProps } from "./DropdownMenu";

const InteractiveStory = (args: DropdownMenuProps) => {
    const [inputValue, setInputValue] = useState<string | number | string[] | number[]>(
        args.value ?? []
    );

    return (
        <div className="story-container large">
            <div style={{ position: "relative" }}>
                <DropdownMenu {...args} value={inputValue} setValue={setInputValue} />
            </div>
        </div>
    );
};

const meta: Meta<typeof DropdownMenu> = {
    title: "Atoms/Dropdown/DropdownMenu",
    component: DropdownMenu,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
    render: args => <InteractiveStory {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        options: [
            {
                label: "Option 1",
                value: "option1",
            },
            {
                label: "Option 2",
                value: "option2",
            },
        ],
        value: "",
        id: "",
        setValue: () => {},
    },
};

export const WithMultiSelect: Story = {
    args: {
        options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
        ],
        multiSelect: true,
        value: [],
        setValue: () => {},
    },
};
