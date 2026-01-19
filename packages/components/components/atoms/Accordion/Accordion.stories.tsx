import { PropsWithChildren } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Accordion, AccordionProps } from "./Accordion";

const meta: Meta<typeof Accordion> = {
    title: "Atoms/Accordion",
    component: Accordion,
    parameters: {
        layout: "centered",
    },
    render: args => (
        <div style={{ maxWidth: 600 }}>
            <Accordion {...args} />
        </div>
    ),
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const defaultArgs: PropsWithChildren<AccordionProps> = {
    headline: "Headline",
    children: (
        <div>
            <h2>Headline 2</h2>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
                eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                ipsum dolor sit amet.s
            </p>
        </div>
    ),
};

export const Default: Story = {
    args: defaultArgs,
};

export const InitiallyOpen: Story = {
    args: { ...defaultArgs, isDefaultOpen: true },
};
