# @becklyn/forms

## 5.0.0

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

## 4.0.5

### Patch Changes

- 22425b2: update dependencies

## 4.0.4

### Patch Changes

- db251c6: update dependencies

## 4.0.3

### Patch Changes

- 39b73f3: update dependencies

## 4.0.2

### Patch Changes

- fd15683: update dependencies

## 4.0.1

### Patch Changes

- b5aa92e: update dependencies

## 4.0.0

### Major Changes

- b96a640: update dependencies
  supported node version changed to 20.19.0

## 3.0.10

### Patch Changes

- 65753b9: update dependencies

## 3.0.9

### Patch Changes

- 9788e08: Update packages

## 3.0.8

### Patch Changes

- 63d3139: Security fixes in next and react packages.

## 3.0.7

### Patch Changes

- 94e9217: update dependencies

## 3.0.6

### Patch Changes

- d8b104f: Add/update homepage and repsitory urls for all packages

## 3.0.5

### Patch Changes

- d926849: update dependencies
- d926849: remove default components for FormBuilder. Legacy for react 19

## 3.0.4

### Patch Changes

- cc87667: update dependencies and packageManager

## 3.0.3

### Patch Changes

- f4271ee: Fix validateForm function signature

## 3.0.2

### Patch Changes

- bfb7704: Fix type system and update readme

## 3.0.1

### Patch Changes

- d2cdb55: Fix form provider

## 3.0.0

### Major Changes

- fc7bf8f: Defnitly typed forms

## 2.0.4

### Patch Changes

- 8108809: Fix type system

## 2.0.3

### Patch Changes

- 674de8c: add optional editStep for FormFieldConfig for MultiStepConfigs

## 2.0.2

### Patch Changes

- Fix type system

## 2.0.1

### Patch Changes

- f2d6669: Fix onInput types

## 2.0.0

### Major Changes

- c602cb8: Remove need of module augmentation

### Patch Changes

- c602cb8: Better type checks

## 1.0.0

### Major Changes

- 4eefadd: Initial release (from @fraym/forms)
