module.exports = {
    "$schema": "http://json.schemastore.org/prettierrc",
    "trailingComma": "es5",
    "tabWidth": 4,
    "semi": true,
    "printWidth": 100,
    "singleQuote": false,
    "bracketSameLine": true,
    "arrowParens": "avoid",
    "importOrder": [
        "^react$",
        "^next(.*)$",
        "^styled-components",
        "^@fr(e|a)ym/(.*)$",
        "^@mayd/(.*)$",
        "^[^.@].*",
        "^@(.*)$",
        "^[./]"
    ],
    "importOrderSeparation": false,
    "importOrderSortSpecifiers": true,
    "plugins": [
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-css-order"
    ]
}
