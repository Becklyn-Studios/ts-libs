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
