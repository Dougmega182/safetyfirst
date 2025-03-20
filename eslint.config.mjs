import globals from "globals";
import jsPlugin from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json"
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@next/next": nextPlugin
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    },
    ignorePatterns: ["next.config.js", "v0-user-next.config.js"] // Ignore Next.js config files
  },
  jsPlugin.configs.recommended,
  ...tseslint.configs.recommended
];
