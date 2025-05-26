# tsconfig

The tsconfig base we use for our TypeScript apps.

## Usage for nextjs projects

Use in your `tsconfig.json`:

```json
{
    "extends": "@becklyn/tsconfig/nextjs.json",
    "compilerOptions": {
        "plugins": [
            {
                "name": "next"
            }
        ],
        "baseUrl": ".",
        "paths": {
            "@/*": ["./*"]
        }
    },
    "include": ["**/*.ts", "**/*.tsx", "**/*.scss"],
    "exclude": ["node_modules"]
}
```

## Usage for react projects:

Use in your `tsconfig.json`:

```json
{
    "extends": "@becklyn/tsconfig/react-library.json",
    "compilerOptions": {
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "@/*": ["./*"]
        }
    },
    "include": ["**/*.ts"],
    "exclude": ["node_modules", "dist"]
}
```

## Usage for js projects:

Use in your `tsconfig.json`:

```json
{
    "extends": "@becklyn/tsconfig/base.json",
    "compilerOptions": {
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "@/*": ["./*"]
        }
    },
    "include": ["**/*.ts"],
    "exclude": ["node_modules", "dist"]
}
```

## Storybook

If you use storybook you will need to use the `TsconfigPathsPlugin` plugin.

Install it using `npm install --save tsconfig-paths-webpack-plugin`.

Use it in `.storybook/main.ts`:

```typescript
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
    // ...

    webpackFinal: async config => {
        if (!config.resolve) {
            config.resolve = {};
        }

        config.resolve.plugins = [
            new TsconfigPathsPlugin({
                extensions: [".tsx", ".ts", ".scss"],
            }),
        ];
        return config;
    },
};
export default config;
```
