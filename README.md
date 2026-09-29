# TS Frontend

Collection of frontend development libraries we use to build UI apps based on TypeScript.

## List

-   [eslint](./packages/eslint/README.md)
-   [tsconfig](./packages/tsconfig/README.md)
-   [prettier](./packages/prettier/README.md)
-   [forms](./packages/forms/README.md)
-   [react-usercentrics](./packages/react-usercentrics/README.md)
-   [deployment-protection](./packages/deployment-protection/README.md)

## Development

Requirements: Node.js >= 22.13 and pnpm (the exact version is pinned in `package.json` → `packageManager`).

```bash
npm install -g pnpm@11.27.1   # or: corepack enable pnpm (Node <= 24)
pnpm install
pnpm run build
pnpm run lint
pnpm run test
```

Switching from an old npm checkout: delete all `node_modules` folders first (`rm -rf node_modules docs/node_modules packages/*/node_modules`).

Dependency build scripts are blocked by default. If `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`, decide per package in `pnpm-workspace.yaml` → `allowBuilds` (`true` = run, `false` = skip).

## Contributing

-   Please read the [changeset docs](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md) to get familiar with the changeset tooling
-   Use PRs for updates

## Git Hooks

To activate the Git hooks checked into the repository, execute the following command:

```bash
git config core.hooksPath .git-hooks
```
