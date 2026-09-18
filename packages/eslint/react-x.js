import reactX from "eslint-plugin-react-x";

/**
 * react-x ships `disable-conflict-eslint-plugin-react-hooks`, but that preset
 * resolves the overlap the wrong way round for us: it switches the twelve
 * `react-hooks/*` rules off and lets react-x win.
 *
 * We want the opposite. `eslint-plugin-react-hooks` carries the React team's
 * compiler-integrated implementation, and our consumers run with
 * `reactCompiler: true`, so its rules take precedence over react-x's
 * reimplementations.
 *
 * Mirroring that preset's rule list onto the `react-x/*` namespace keeps the
 * set of disabled rules derived from the plugin instead of hand-maintained, so
 * new overlaps are picked up on the next react-x update. All twelve are active
 * in `react-hooks/recommended`, so nothing loses coverage.
 */
const deferToReactHooks = Object.fromEntries(
    Object.keys(reactX.configs["disable-conflict-eslint-plugin-react-hooks"].rules).map(rule => [
        rule.replace("react-hooks/", "react-x/"),
        "off",
    ])
);

/**
 * The shared React rule set, used by both the Next.js and the React config.
 *
 * `recommended-typescript` over `recommended`: identical rule sets today, but it
 * is the variant meant for TypeScript-only codebases. `*-type-checked` is
 * deliberately avoided — it would force every consumer to set up
 * `parserOptions.project`.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const reactXConfig = [
    reactX.configs["recommended-typescript"],
    {
        name: "becklyn/react-x-defers-to-react-hooks",
        rules: deferToReactHooks,
    },
];
