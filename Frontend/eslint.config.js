import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist"], // Ignore dist folder
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Apply to JS, JSX, TS, TSX files
    languageOptions: {
      ecmaVersion: 2020, // Use the latest ECMAScript version
      globals: globals.browser, // Set global variables for browser
      parserOptions: {
        ecmaVersion: "latest", // Use the latest ECMAScript version
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
        sourceType: "module", // Use modules (ESM)
      },
    },
    settings: {
      react: {
        version: "18.3", // Set React version to 18.3
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // ESLint recommended rules
      ...react.configs.recommended.rules, // React recommended rules
      ...react.configs["jsx-runtime"].rules, // JSX runtime rules
      ...reactHooks.configs.recommended.rules, // React hooks recommended rules
      "react/jsx-no-target-blank": "off", // Disable warning for <a> with target="_blank"
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ], // Only export components for better hot reloading
    },
  },
];
