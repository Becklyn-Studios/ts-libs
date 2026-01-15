import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImageWithFocalPoint } from "./ImageWithFocalPoint";

const meta: Meta<typeof ImageWithFocalPoint> = {
    title: "Atoms/ImageWithFocalPoint",
    component: ImageWithFocalPoint,
};

export default meta;
type Story = StoryObj<typeof ImageWithFocalPoint>;

export const Default: Story = {
    args: {
        asset: {
            src: "https://picsum.photos/1600/1000",
            width: 1600,
            height: 1000,
        },
    },
};
