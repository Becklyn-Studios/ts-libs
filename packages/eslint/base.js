import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import importAlias from "@limegrass/eslint-plugin-import-alias";

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
            "unused-imports": unusedImports,
        },
        rules: {
            "unused-imports/no-unused-imports": "error",
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    },
    {
        ignores: ["dist/**"],
    },
];
