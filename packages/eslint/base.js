import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
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
        ignores: ["dist/**"],
    },
];
