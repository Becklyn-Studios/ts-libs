---
"@becklyn/react-usercentrics": major
"@becklyn/components": minor
"@becklyn/forms": major
"@becklyn/next": major
---

Drop React 18 — these packages now require React 19

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
