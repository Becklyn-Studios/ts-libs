import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination, PaginationProps } from "./Pagination";

const InteractivePagination = (args: PaginationProps) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);

    return <Pagination {...args} currentPage={currentPage} onGoTo={setCurrentPage} />;
};

const meta: Meta<typeof Pagination> = {
    title: "Atoms/Pagination",
    component: Pagination,
    parameters: {
        layout: "centered",
    },
    render: args => <InteractivePagination {...args} />,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const defaultArgs: PaginationProps = {
    totalPages: 125,
    currentPage: 0,
    onGoTo: () => {},
};

export const Default: Story = {
    args: defaultArgs,
};
