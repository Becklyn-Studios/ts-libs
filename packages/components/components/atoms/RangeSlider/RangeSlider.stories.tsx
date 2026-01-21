import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RangeSlider, RangeSliderProps } from "./RangeSlider";

const InteractiveStory = (args: RangeSliderProps) => {
    const [value, setValue] = useState<number>(args.value || 0);

    return (
        <div className="story-container mobileDesktop">
            <RangeSlider {...args} value={value} setValue={setValue} />
            <p>Value: {value}</p>
        </div>
    );
};

const meta: Meta<typeof RangeSlider> = {
    title: "Atoms/RangeSlider",
    component: RangeSlider,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    render: args => <InteractiveStory {...args} />,
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
    args: {
        label: "Range Slider",
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        setValue: () => {},
    },
};
