import { FormEvent, FormEventHandler, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RangeSlider, RangeSliderProps } from "./RangeSlider";

const InteractiveControlledStory = (args: RangeSliderProps) => {
    const [value, setValue] = useState<number>(args.value || 0);

    return (
        <div className="story-container mobileDesktop">
            <RangeSlider
                {...args}
                value={value}
                setValue={setValue}
                defaultValue={undefined}
                name={undefined}
            />
            <p>Value: {value}</p>
        </div>
    );
};

const InteractiveUncontrolledStory = (args: RangeSliderProps) => {
    const [value, setValue] = useState<number>(args.defaultValue ?? 0);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const value = formData.get(args.name ?? "");

        if (value) {
            setValue(Number(value));
        }
    };

    return (
        <div className="story-container mobileDesktop">
            <form onSubmit={onSubmit}>
                <RangeSlider
                    {...args}
                    value={undefined}
                    setValue={undefined}
                    defaultValue={args.defaultValue ?? 0}
                    name={args.name ?? ""}
                />
                <button type="submit">Submit</button>
            </form>
            <p>Default Value: {value}</p>
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
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Controlled: Story = {
    args: {
        label: "Range Slider",
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        setValue: () => {},
    },
    render: args => <InteractiveControlledStory {...args} />,
};

export const Uncontrolled: Story = {
    args: {
        label: "Range Slider",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 10,
        name: "range-slider",
    },
    render: args => <InteractiveUncontrolledStory {...args} />,
};
