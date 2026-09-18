import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import { config as baseConfig } from "./base.js";
import { reactXConfig } from "./react-x.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config} */
export const config = [
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
                ...globals.browser,
            },
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
];
