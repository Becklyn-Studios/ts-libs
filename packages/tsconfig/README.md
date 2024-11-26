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

## Usage for non nextjs projects:

Use in your `tsconfig.json`:

```json
{
  "extends": "@becklyn/tsconfig/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```
