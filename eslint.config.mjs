import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", "/.expo/*", "node_modules/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // 1. Existing basic rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // 2. Import Sorting Rules
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
]);
