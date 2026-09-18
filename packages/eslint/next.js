import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";
import { config as baseConfig } from "./base.js";
import { reactXConfig } from "./react-x.js";

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
    ...baseConfig,
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    ...reactXConfig,
    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.serviceworker,
            },
        },
    },
    {
        plugins: {
            "@next/next": pluginNext,
        },
        rules: {
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs["core-web-vitals"].rules,
        },
    },
    {
        plugins: {
            "react-hooks": pluginReactHooks,
            "@stylistic": stylistic,
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
            "@stylistic/jsx-curly-brace-presence": [
                "error",
                { props: "never", children: "never", propElementValues: "ignore" },
            ],
        },
    },
    {
        files: ["next-env.d.ts"],
        rules: {
            "@typescript-eslint/triple-slash-reference": "off",
        }
    },
];
