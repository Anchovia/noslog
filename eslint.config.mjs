import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import tanstackQuery from "@tanstack/eslint-plugin-query";

export default defineConfig([
    ...tanstackQuery.configs["flat/recommended"],
    {
        extends: [...nextCoreWebVitals, ...nextTypescript],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },
    {
        files: ["features/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
        },
    },
    {
        files: [
            "app/api/getPlayerData.js",
            "lib/services/**/*.{js,ts}",
            "prisma/**/*.{js,mjs,ts}",
            "scripts/**/*.{js,mjs,ts}",
        ],
        rules: {
            "no-console": "off",
        },
    },
    prettierConfig,
]);
