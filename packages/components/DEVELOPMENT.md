# Development

## Adding a new component

To add a new component, you need to follow these steps:

1. Add a new component directory in the `components` directory. Example: `components/MyComponent`.
2. Add the component files to the directory. Example: `components/MyComponent/MyComponent.tsx`, `components/MyComponent/MyComponent.module.scss`, `components/MyComponent/MyComponent.stories.tsx`.
3. In case your component has dependencies, add them to the `components/MyComponent/dependencies.json` file. Example: `["react"]`. You do not need to add default dependencies like:
    - `@becklyn/next`
    - `@storybook/nextjs-vite`
    - `@types/react`
    - `@types/react-dom`
    - `clsx`
    - `next`
    - `react`
    - `react-dom`
    - `sass`
    - `typescript`
