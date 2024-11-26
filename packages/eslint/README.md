# eslint-config

The eslint-config base we use for our TypeScript apps.

## Usage

Use in your `.eslintrc.js`:

```js
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "@becklyn/eslint-config/eslint.js",
    "plugin:@dword-design/import-alias/recommended",
  ],
  rules: {
    "@dword-design/import-alias/prefer-alias": [
      "error",
      {
        alias: {
          "@": ".",
        },
      },
    ],
  },
};
```
