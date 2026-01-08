import { useState } from "react";
import clsx from "clsx";
import styles from "@becklyn/next/.storybook/Story.module.scss";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dropdown } from "./Dropdown";
import { DropdownProps } from "./Dropdown";

const InteractiveStorySingle = (args: DropdownProps & { multiSelect: false }) => {
    const [value, setValue] = useState(args.value);

    return (
        <div className={clsx(styles.storyContainer, styles.gray)}>
            <Dropdown {...args} value={value} setValue={setValue} multiSelect={false} />

            <p>Value: {value}</p>
        </div>
    );
};

const InteractiveStoryMulti = (args: DropdownProps & { multiSelect: true }) => {
    const [value, setValue] = useState(args.value);

    return (
        <div className={clsx(styles.storyContainer)}>
            <Dropdown {...args} value={value} setValue={setValue} multiSelect={true} />

            <p>Value: {value.join(", ")}</p>
        </div>
    );
};

const meta: Meta<typeof Dropdown> = {
    title: "Atoms/Dropdown/Dropdown",
    component: Dropdown,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        options: {
            control: "object",
            description: "Array of dropdown options",
        },
    },
    render: args => {
        // Needed to apply default theme on theme: undefined
        switch (args.multiSelect) {
            case true:
                return <InteractiveStoryMulti {...args} />;
            case false:
            default:
                return <InteractiveStorySingle {...args} multiSelect={false} />;
        }
    },
};

export default meta;
type Story = StoryObj<DropdownProps>;

export const Default: Story = {
    args: {
        options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" },
        ],
        value: "",
        setValue: () => {},
    },
};

export const WithLabel: Story = {
    args: {
        label: "Dropdown Label",
        options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
        ],
        value: "",
        setValue: () => {},
    },
};

export const WithSelectedValue: Story = {
    args: {
        options: [
            { label: "Red", value: "red" },
            { label: "Green", value: "green" },
            { label: "Blue", value: "blue" },
        ],
        value: "green",
        setValue: () => {},
    },
};

export const WithManyOptions: Story = {
    args: {
        options: [
            {
                label: "Audi Mühlheim",
                value: "audi-muhlheim",
            },
            {
                label: "Volkswagen Mühlheim",
                value: "volkswagen-muhlheim",
            },
            {
                label: "Škoda Plus Mühlheim",
                value: "skoda-plus-muhlheim",
            },
            {
                label: "Volkswagen Nutzfahrzeuge Mühlheim",
                value: "volkswagen-nutzfahrzeuge-muhlheim",
            },
            {
                label: "Audi Gebrauchtwagen :plus Mühlheim",
                value: "audi-gebrauchtwagen-plus-muhlheim",
            },
            {
                label: "Audi Zentrum Hanau",
                value: "audi-zentrum-hanau",
            },
            {
                label: "Škoda Offenbach",
                value: "skoda-offenbach",
            },
            {
                label: "Audi Linsengericht",
                value: "audi-linsengericht",
            },
            {
                label: "Volkswagen Linsengericht",
                value: "volkswagen-linsengericht",
            },
            {
                label: "Volkswagen Freigericht",
                value: "volkswagen-freigericht",
            },
            {
                label: "Volkswagen Büdingen",
                value: "volkswagen-budingen",
            },
            {
                label: "Audi Bad Kissingen",
                value: "audi-bad-kissingen",
            },
            {
                label: "Volkswagen Bad Kissingen",
                value: "volkswagen-bad-kissingen",
            },
            {
                label: "Škoda Bad Kissingen",
                value: "skoda-bad-kissingen",
            },
            {
                label: "Ebern",
                value: "ebern",
            },
            {
                label: "Audi Haßfurt",
                value: "audi-hafurt",
            },
            {
                label: "Volkswagen Haßfurt",
                value: "volkswagen-hafurt",
            },
        ],
        value: "",
        setValue: () => {},
    },
};

export const WithDisabledOptions: Story = {
    args: {
        options: [
            { label: "Available Option", value: "available" },
            { label: "Disabled Option", value: "disabled", disabled: true },
            { label: "Another Available", value: "another" },
        ],
        value: "",
        setValue: () => {},
    },
};

export const WithMultiSelect: Story = {
    args: {
        label: "Multi Select Label",
        multiSelect: true,
        options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
        ],
        value: [],
        setValue: () => {},
    },
};
