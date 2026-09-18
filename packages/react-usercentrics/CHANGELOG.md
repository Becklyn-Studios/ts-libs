# @becklyn/react-usercentrics

## 6.0.0

### Major Changes

- e730cb8: Drop React 18 — these packages now require React 19

    The React packages in this repo standardise on React 19. `@becklyn/forms`,
    `@becklyn/next` and `@becklyn/react-usercentrics` use React 19-only APIs
    internally — `use(Context)` in place of `useContext(Context)`, and `<Context>`
    in place of `<Context.Provider>`. `@becklyn/components` follows the same policy
    so the set stays consistent — but as a minor bump (0.4.8 → 0.5.0), not a
    major one. The package is not ready to claim a 1.0; on 0.x a minor is the
    conventional way to signal a breaking change.

    Peer ranges:

    - `@becklyn/forms`: `react`/`react-dom` `^18.3.1 || ^19.0.0` → `^19.0.0`
    - `@becklyn/components`: `react`/`react-dom` `^18.3.1 || ^19.0.0` → `^19.0.0`
    - `@becklyn/next`: `react` `^18.3.1 || ^19.0.0` → `^19.0.0`
    - `@becklyn/react-usercentrics`: `react`/`react-dom`/`@types/react`
      `^17.0.0 || ^18.0.0 || ^19.0.0` → `^19.0.0`

    `@becklyn/next` additionally drops Next.js 14: `next`
    `^14.0.0 || ^15.0.0 || ^16.0.0` → `^15.0.0 || ^16.0.0`. Next 14 declares
    `react: ^18.2.0` as its only peer and cannot run React 19, so the old range
    combined with a React 19 peer was unsatisfiable. Next 15 is the first release
    that supports React 19.

    There is no public API change. Consumers already on React 19 (and Next 15+)
    need to do nothing; consumers on React 18 or 17 must stay on the previous major.

    `@becklyn/deployment-protection` is unaffected — it contains no React and keeps
    its `next: ^14.0.0 || ^15.0.0 || ^16.0.0` peer.

    The React 19 migration was prompted by the `react-x/no-use-context` and
    `react-x/no-context-provider` rules that arrive with `@becklyn/eslint` 3.0.0.

## 5.0.4

### Patch Changes

- 22425b2: update dependencies

## 5.0.3

### Patch Changes

- db251c6: update dependencies

## 5.0.2

### Patch Changes

- 39b73f3: update dependencies

## 5.0.1

### Patch Changes

- fd15683: update dependencies

## 5.0.0

### Major Changes

- 2955f8f: - Compatibility for usercentrics v2 was removed.
    - Compatibility for usercentrics v3 was added instead.
    - Update all types.
    - `cmp` type changed from `UC` to `UCCmp`.
    - `showSecondLayer()` no longer supports the `serviceId` as a parameter.
    - removed `forceReload` from the props of `UsercentricsProvider`.
    - Add `showServiceDetails()` with `serviceId` as a parameter which shows the details of a specific service. However unlike the old way of doing it with `showSecondLayer()` you don't get the option to accept that service in this window.
    - Add more debugging logs to `console` when `debug` is set to `true` in the props of `UsercentricsProvider` e.g.: `<UsercentricsProvider debug={true}></UsercentricsProvider>`.

## 4.0.1

### Patch Changes

- a962342: fix new return type of getServicesBaseInfo

## 4.0.0

### Major Changes

- b96a640: update dependencies
  supported node version changed to 20.19.0

## 3.0.10

### Patch Changes

- 65753b9: update dependencies

## 3.0.9

### Patch Changes

- 63d3139: Security fixes in next and react packages.

## 3.0.8

### Patch Changes

- 5573f12: update dependencies

## 3.0.7

### Patch Changes

- 94e9217: update dependencies

## 3.0.6

### Patch Changes

- 42f2b79: update dependencies

## 3.0.5

### Patch Changes

- 41a0fd4: update dependencies

## 3.0.4

### Patch Changes

- d8b104f: Add/update homepage and repsitory urls for all packages

## 3.0.3

### Patch Changes

- c6d3fce: Update dependencies

## 3.0.2

### Patch Changes

- d926849: update dependencies

## 3.0.1

### Patch Changes

- 2c5fd1f: update README and add license

## 3.0.0

### Major Changes

- 3eb3553: change name of package and add support for react@19

## 2.1.2

### Patch Changes

- 8556683: (internal) Move export of "types" from root into "exports"-object
- 8556683: (internal) update github-actions-packages to newest version. Old ones were deprecated

## 2.1.1

### Patch Changes

- 54c8238: (bug) Fix `consentUpdate` to update it's value.
- 54c8238: (internal) Update code owners.
- 54c8238: (internal) Add additional node version to ci.

## 2.1.0

### Minor Changes

- d142d55: (improvement) Add `@trivago/prettier-plugin-sort-imports` for import sorting.
- d142d55: (improvement) Add usercentrics types and events to window to improve autocompletion.
- d142d55: (feature) Add `consentUpdate` variable to track possible consent changes.

## 2.0.3

### Patch Changes

- b92ee7d: (bug) Fix force reload.

## 2.0.2

### Patch Changes

- ea421ae: (bug) Export types.

## 2.0.1

### Patch Changes

- d460335: (bug) Fix types.

## 2.0.0

### Major Changes

- 6a55a5d: (bc) Improve api.

## 1.1.2

### Patch Changes

- 4715eff: (improvement) Remove `@becklyn/prettier` from dependencies.
- 4715eff: (improvement) Make react a peer dependency.

## 1.1.1

### Patch Changes

- 809814b: (improvement) Make initialize true if debug.

## 1.1.0

### Minor Changes

- b807df5: (feature) Always return service to be accepted if debug.

## 1.0.0

### Major Changes

- 83cba2c: (bc) Rename project.
- 83cba2c: (improvement) Also return cmp object from hook.

## 0.2.0

### Minor Changes

- 455e3f5: (feature) Add debug mode.
- 455e3f5: (feature) Allow custom service IDs.

## 0.1.0

### Minor Changes

- fd80ecf: (feature) Add hook.

## 0.0.2

### Patch Changes

- c8ddb2e: (improvement) Export from `index.ts`.

## 0.0.1

### Patch Changes

- 1f09446: (feature) Initial release.
