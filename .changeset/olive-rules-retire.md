---
"@becklyn/eslint": major
---

Replace `eslint-plugin-react` with `eslint-plugin-react-x`, unblocking ESLint 10

`eslint-plugin-react` has no release that supports ESLint 10 — its peer range
stops at `^9.7`, and the `next` dist-tag (`7.8.0-rc.0`) is semver *older* than
`latest`. Because this package declares `eslint: ^10`, any installer that
honours the declared graph (pnpm, yarn PnP) bound the plugin against ESLint 10
and every lint run crashed with:

```
TypeError: Error while loading rule 'react/display-name':
contextOrFilename.getFilename is not a function
```

npm's hoisting hid this by quietly serving ESLint 9 to the CLI and the plugin.
Consumers working around it with an `overrides` entry pinning `eslint` to
`9.39.5` — a version npm has deprecated and tagged `maintenance` — can drop
that override.

**Changes**

- `eslint-plugin-react` removed; `eslint-plugin-react-x` and
  `@stylistic/eslint-plugin` added. Every remaining dependency already
  supported ESLint 10.
- The React rule set grows from 22 to 37 rules (`react-x`'s
  `recommended-typescript`), of which 28 stay active — see the overlap note
  below. **Code that passes today can fail after upgrading.**
- `react/jsx-curly-brace-presence` is now `@stylistic/jsx-curly-brace-presence`,
  with identical options. `react-x` is deliberately non-stylistic and ships no
  equivalent.
- The `react/react-in-jsx-scope: "off"` override is gone — the rule no longer
  exists. **Consumers can delete their own `react-in-jsx-scope` overrides.**
- The `settings: { react: { version: "detect" } }` block is gone; nothing reads
  it any more. `react-x` carries its own `settings["react-x"].version: "detect"`.

**Overlap with `eslint-plugin-react-hooks`**

`react-x` reimplements twelve rules that `eslint-plugin-react-hooks` also
provides. The `react-hooks` versions win: they are the React team's
compiler-integrated implementation, and consumers of this package run with
`reactCompiler: true`. The twelve `react-x` counterparts
(`exhaustive-deps`, `rules-of-hooks`, `purity`, `use-memo`,
`static-components`, `set-state-in-render`, `set-state-in-effect`,
`error-boundaries`, `immutability`, `globals`, `refs`, `unsupported-syntax`)
are switched off. All twelve are active in `react-hooks/recommended`, so no
coverage is lost, and a dependency-array mistake is still reported exactly once.

Note that `react-x`'s own `disable-conflict-eslint-plugin-react-hooks` preset
resolves this the *other* way round — it disables the `react-hooks` side. We
derive the inverse from it rather than using it directly.

**Rule renames**

Every rule ID changed, so existing `// eslint-disable-next-line react/...`
comments silently stop working. Of the 22 rules in the old `recommended`:

| Old rule | Replacement |
| --- | --- |
| `react/jsx-key` | `react-x/no-missing-key` |
| `react/no-direct-mutation-state` | `react-x/no-direct-mutation-state` |
| `react/no-unsafe` | `react-x/no-unsafe-component-will-mount`, `-will-receive-props`, `-will-update` |
| `react/no-deprecated` | `react-x/no-component-will-mount`, `-will-receive-props`, `-will-update`, `react-x/no-create-ref`, `no-forward-ref`, `no-context-provider`, `no-use-context`, `no-clone-element` |

Dropped without a replacement in `recommended`:

- `react/prop-types`, `react/jsx-no-undef`, `react/jsx-uses-vars` — TypeScript
  and `@typescript-eslint/no-unused-vars` already cover these.
- `react/react-in-jsx-scope`, `react/jsx-uses-react` — obsolete under the new
  JSX transform.
- `react/display-name` — available as `react-x/no-missing-component-display-name`,
  but not part of `recommended`.
- `react/jsx-no-target-blank`, `react/no-find-dom-node`,
  `react/no-unknown-property`, `react/no-render-return-value`,
  `react/no-danger-with-children`, `react/no-children-prop`,
  `react/jsx-no-comment-textnodes` — these live in the `dom-*`/`jsx-*` rules of
  the `@eslint-react/eslint-plugin` umbrella, which this package deliberately
  does not pull in.
- `react/jsx-no-duplicate-props`, `react/no-is-mounted`, `react/no-string-refs`,
  `react/no-unescaped-entities`, `react/require-render-return` — no equivalent.

New rules most likely to fire on existing code: `react-x/no-use-context`,
`react-x/no-context-provider` (React 19 modernisation), `react-x/no-array-index-key`,
`react-x/use-state` (setter naming), `react-x/no-nested-component-definitions`.
