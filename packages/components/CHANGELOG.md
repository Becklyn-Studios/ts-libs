# @becklyn/components

## 0.5.0

### Minor Changes

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

## 0.4.8

### Patch Changes

- 22425b2: update dependencies

## 0.4.7

### Patch Changes

- db251c6: update dependencies

## 0.4.6

### Patch Changes

- 36f9512: make build script more robust

## 0.4.5

### Patch Changes

- 39b73f3: update dependencies

## 0.4.4

### Patch Changes

- fd15683: update dependencies

## 0.4.3

### Patch Changes

- b113e67: update dependencies

## 0.4.2

### Patch Changes

- b5aa92e: update dependencies

## 0.4.1

### Patch Changes

- d25896b: update dependencies

## 0.4.0

### Minor Changes

- b96a640: update dependencies
  supported node version changed to 20.19.0

## 0.3.1

### Patch Changes

- 65753b9: update dependencies

## 0.3.0

### Minor Changes

- e2b5401: Add TextInput component

## 0.2.2

### Patch Changes

- 5f57110: update dependencies

## 0.2.1

### Patch Changes

- e9e51ac: update dependencies

## 0.2.0

### Minor Changes

- 9788e08: Rename Button to Clickable

## 0.1.6

### Patch Changes

- cea81a8: Fix vulnerability CVE-2025-55183 and CVE-2025-55184

## 0.1.5

### Patch Changes

- 63d3139: Security fixes in next and react packages.

## 0.1.4

### Patch Changes

- 5573f12: update dependencies

## 0.1.3

### Patch Changes

- 42f2b79: update dependencies

## 0.1.2

### Patch Changes

- a65ba39: update next dependency

## 0.1.1

### Patch Changes

- 41a0fd4: update dependencies

## 0.1.0

### Minor Changes

- c82a6fa: Add init and add command and a basic button component
