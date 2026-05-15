import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Додаємо всю папку prisma та скрипти в корень в ігнор
    ignores: [
      "make-admin.ts",
      "seed.ts",
      "prisma/**", // Ігноруємо абсолютно все в папці prisma
      ".svelte-kit/**",
      "build/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
    ],
  },
  prettier,
  {
    files: ["**/*.ts"],
    plugins: { "@typescript-eslint": ts },
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: "./tsconfig.json" },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
    },
  },
  {
    files: ["**/*.svelte"],
    plugins: { svelte },
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      "svelte/valid-compile": "off",
      "svelte/no-dupe-style-properties": "off",
      "svelte/no-dupe-else-if-blocks": "error",
      "svelte/no-unused-svelte-ignore": "off", // Вимкнув, щоб не сварився на старі коментарі
      "svelte/a11y-label-has-associated-control": "off",
      "svelte/a11y-consider-explicit-label": "off",
      "svelte/a11y-click-events-have-key-events": "off",
      "svelte/a11y-no-static-element-interactions": "off",
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": "off",
    },
  },
];
