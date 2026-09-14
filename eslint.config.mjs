import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  // eslint-config-next already registers and configures the "jsx-a11y" plugin
  // instance (with a small subset of rules); re-declaring its `plugins` key here
  // would throw ESLint's "Cannot redefine plugin" error, so we only merge in the
  // plugin's full recommended *rules* map on top of the plugin it already registered.
  ...nextCoreWebVitals,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: jsxA11y.configs.recommended.rules,
  },
  {
    files: ["src/**/*.{ts,tsx}", "pages/**/*.{ts,tsx}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "prefer-const": "error",
      "no-var": "error",
      // TypeScript's own compiler already catches undefined identifiers; no-undef
      // produces false positives on ambient global namespaces (Express, NodeJS, ...).
      "no-undef": "off",
      "import/no-anonymous-default-export": "warn",
    },
  },
];
