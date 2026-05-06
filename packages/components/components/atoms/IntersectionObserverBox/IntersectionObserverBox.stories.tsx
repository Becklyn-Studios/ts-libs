import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IntersectionObserverBox } from "./IntersectionObserverBox";
import styles from "./IntersectionObserverBox.stories.module.scss";

const meta: Meta<typeof IntersectionObserverBox> = {
    title: "Atoms/IntersectionObserverBox",
    component: IntersectionObserverBox,
    parameters: {
        layout: "padded",
    },
};

export default meta;
type Story = StoryObj<typeof IntersectionObserverBox>;

export const Default: Story = {};

export const WithThreshold: Story = {
    args: {
        options: { threshold: 0.5 },
        children: "Visible when 50% in viewport",
    },
};

export const Scrollable: Story = {
    render: args => (
        <div className={styles.scrollContainer}>
            <div className={styles.scrollHint}>↓ Scroll down ↓</div>
            <IntersectionObserverBox {...args} />
            <div className={styles.scrollHint}>↑ Scroll up ↑</div>
        </div>
    ),
};

export const WithCallback: Story = {
    render: args => (
        <IntersectionObserverBox
            {...args}
            callback={(_, isVisible) => console.log("Visibility changed:", isVisible)}>
            Watch the console when visibility changes
        </IntersectionObserverBox>
    ),
};

export const CustomFilter: Story = {
    args: {
        filter: entry => entry.intersectionRatio >= 0.75,
        options: { threshold: [0, 0.25, 0.5, 0.75, 1] },
        children: "Visible when ≥75% intersecting",
    },
};
