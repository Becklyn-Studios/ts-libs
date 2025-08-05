import "@becklyn/next/scss/reset";
import type { Preview } from "@storybook/nextjs";

const preview: Preview = {
    parameters: {
        nextjs: {
            appDirectory: true,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        viewport: {
            options: {
                mobile: { name: "Mobile", styles: { width: "393px", height: "852px" } },
                tablet: { name: "Tablet", styles: { width: "1024px", height: "100%" } },
                desktop: { name: "Desktop", styles: { width: "100%", height: "100%" } },
            },
        },
        layout: "fullscreen",
        options: {
            storySort: {
                order: ["Introduction", "Atoms", "Molecules", "Organisms", "Templates", "Pages"],
            },
        },
    },
    tags: ["autodocs"],
};

export default preview;
