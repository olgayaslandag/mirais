import nextLint from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextLint,
  {
    rules: {
      "@next/next/no-img-element": "warn",
    },
    ignores: ["node_modules", ".next", "out", "data/catalog/*.json"],
  },
];

export default eslintConfig;