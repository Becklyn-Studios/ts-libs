import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import importAlias from "@limegrass/import-alias";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        plugins: {
            "@limegrass/import-alias": importAlias,
        },
        rules: {
            "@limegrass/import-alias/import-alias": [
                "error",
                {
                    relativeImportOverrides: [{ path: ".", depth: 0 }],
                },
            ],
        },
    },
    {
        plugins: {
            turbo: turboPlugin,
        },
        rules: {
            "turbo/no-undeclared-env-vars": "warn",
        },
    },
    {
        ignores: ["dist/**"],
    },
];
