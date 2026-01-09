import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Autocomplete } from "./Autocomplete";
import { AutocompleteProps } from "./Autocomplete";
import { autocompleteOptions } from "./Autocomplete.mock";

const InteractiveStory = (args: AutocompleteProps) => {
    const [value, setValue] = useState<string | number>(args.value || "");

    return (
        <div className="story-container large">
            <Autocomplete
                {...args}
                value={value}
                onChange={v => {
                    setValue(v);
                }}
            />
            <p>Selected: {value || "None"}</p>
        </div>
    );
};

const meta: Meta<typeof Autocomplete> = {
    title: "Atoms/Autocomplete",
    component: Autocomplete,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        disabled: {
            control: { type: "boolean" },
        },
    },
    render: args => <InteractiveStory {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "Label",
        placeholder: "Text Label",
        options: autocompleteOptions,
    },
};

export const DefaultDisabled: Story = {
    args: {
        placeholder: "Text Label",
        options: autocompleteOptions,
        disabled: true,
    },
};

export const WithPredefinedValue: Story = {
    args: {
        placeholder: "Text Label",
        options: autocompleteOptions,
        value: "volkswagen",
    },
};
