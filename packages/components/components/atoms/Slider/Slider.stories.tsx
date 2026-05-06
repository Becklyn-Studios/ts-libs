import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slide, Slider } from "./Slider";
import styles from "./Slider.stories.module.scss";

const SLIDE_COLORS = ["#4f86c6", "#6abf69", "#f0a500", "#e05c5c", "#a97cc7"];

const SampleSlides = ({ count = 3 }: { count?: number }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <Slide key={i}>
                <div
                    style={{
                        background: SLIDE_COLORS[i % SLIDE_COLORS.length],
                    }}
                    className={styles.exampleSlide}>
                    Slide {i + 1}
                </div>
            </Slide>
        ))}
    </>
);

const meta: Meta<typeof Slider> = {
    title: "Atoms/Slider",
    component: Slider,
    parameters: {
        layout: "padded",
    },
    decorators: [
        Story => (
            <div className={styles.storyContainer}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: args => (
        <Slider {...args}>
            <SampleSlides count={3} />
        </Slider>
    ),
};

export const ManySlides: Story = {
    render: args => (
        <Slider {...args}>
            <SampleSlides count={5} />
        </Slider>
    ),
};

export const WithoutNav: Story = {
    render: args => (
        <Slider {...args} showNav={false}>
            <SampleSlides count={3} />
        </Slider>
    ),
};

export const Loop: Story = {
    render: args => (
        <Slider {...args} loop>
            <SampleSlides count={3} />
        </Slider>
    ),
};

export const AutoDisable: Story = {
    name: "Auto Disable (single slide)",
    render: args => (
        <Slider {...args} shouldAutoDisable>
            <SampleSlides count={1} />
        </Slider>
    ),
};
