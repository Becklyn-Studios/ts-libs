# @becklyn/components

A collection of reusable React components built with TypeScript and SCSS modules. This library provides a shadcn-ui-like experience but uses SCSS modules instead of Tailwind CSS for styling.

## Before using this library

This library is designed to be used with Next.js. You won't be able to use all components properly without Next.js.

We also add storybook stories to the components. You need to have storybook installed in your project to use them.

## CLI Commands

### `init`

Initialize your project with the necessary configuration.

```bash
npx becklyn-components init [options]
```

This command will:

- Install required dependencies

### `add`

Add components to your project by copying them from the library.

```bash
npx becklyn-components add <component> [component...] [options]
```

**Options:**

- `--components <path>` - Components directory (default: "src/components")
- `--overwrite` - Overwrite existing files
- `-y, --yes` - Skip confirmation prompts

**Examples:**

```bash
# Add a single component
npx becklyn-components add button

# Add multiple components
npx becklyn-components add button card dialog

# Specify custom directories
npx becklyn-components add button --components src/ui
```
