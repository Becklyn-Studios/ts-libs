/** @type {import("eslint").Linter.Config} */
module.exports = {
    plugins: ["react"],
    extends: ["next"],
    rules: {
        "react/jsx-curly-brace-presence": [
            2,
            { props: "never", children: "never", propElementValues: "ignore" },
        ],
    },
    ignorePatterns: ["node_modules/", "dist/"],
};
