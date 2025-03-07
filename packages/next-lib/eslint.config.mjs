import { nextJsConfig } from "@becklyn/eslint/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
    ...nextJsConfig,
    {
        rules: {
            "react/display-name": "off",
        },
    },
];
