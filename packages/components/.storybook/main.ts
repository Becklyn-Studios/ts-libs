import { createRequire } from "module";
import { dirname, join } from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const localRequire = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
    return dirname(localRequire.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
    stories: ["../**/*.mdx", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    addons: [
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("@storybook/addon-designs"),
        getAbsolutePath("@storybook/addon-docs"),
    ],

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

    webpackFinal: async config => {
        if (!config.resolve) {
            config.resolve = {};
        }

        config.resolve.plugins = [
            new TsconfigPathsPlugin({
                extensions: [".tsx", ".ts", ".scss"],
            }),
        ];
        return config;
    },
};
export default config;
