# eslint

The eslint base config we use for our TypeScript apps.

## Usage

### NextJs Projects

Use in your `eslint.config.js`:

```js
import { nextJsConfig } from "@becklyn/eslint/next-js";

/** @type {import("eslint").Linter.Config} */
export default nextJsConfig;
```


### React Projects

Use in your `eslint.config.mjs`:

```js
import { config } from "@becklyn/eslint/react-internal";

/** @type {import("eslint").Linter.Config} */
export default config;
```

### JS Projects

Use in your `eslint.config.mjs`:

```js
import { config } from "@becklyn/eslint/base";

/** @type {import("eslint").Linter.Config} */
export default config;
```


## Turborepo

When using turborepo you might want to check for undeclared env variables.

Install `eslint-plugin-turbo`: `npm install -D eslint-plugin-turbo`

```js
import { config } from "@becklyn/eslint/base";
import turboPlugin from "eslint-plugin-turbo";

/** @type {import("eslint").Linter.Config} */
export default [...nextJsConfig, {
  plugins: {
    turbo: turboPlugin,
  },
  rules: {
      "turbo/no-undeclared-env-vars": "warn",
  },
}];
```
