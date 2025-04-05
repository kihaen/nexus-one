import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import esPluginNext from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  ...compat.config({
    extends: ["next", "prettier"],
  }),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@next/eslint-plugin-next": esPluginNext,
      "@typescript-eslint": tsPlugin,
    },
    rules: [
      {
        trailingComma: "es5",
        tabWidth: 2,
        semi: false,
      },
    ],
  },
];

export default eslintConfig;
