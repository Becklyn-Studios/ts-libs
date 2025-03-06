const baseConfig = require("@becklyn/eslint/eslint.js");

/** @type {import("eslint").Linter.Config} */
module.exports = {
    ...baseConfig,
    extends: ["plugin:@dword-design/import-alias/recommended"],
    rules: {
        "react/display-name": "off",
        "@dword-design/import-alias/prefer-alias": [
            "error",
            {
                alias: {
                    "@ui": ".",
                },
            },
        ],
    },
};
