import { dirname } from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

function getAbsolutePath(value: string): string {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
    stories: ["../components/**/*.mdx", "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    addons: [getAbsolutePath("@storybook/addon-docs")],

    framework: {
        name: getAbsolutePath("@storybook/nextjs-vite"),
        options: {
            builder: {
                useSWC: true,
            },
        },
    },

    docs: {},

    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
};
export default config;
