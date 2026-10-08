import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import storybook from "eslint-plugin-storybook";

import architecture from "./tooling/eslint/architecture.mjs";

export default defineConfig([
    globalIgnores(["storybook-static/**"]),
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
            "app/**/*.{ts,tsx}",
            "features/**/*.{ts,tsx}",
            "components/ui/**/*.{ts,tsx}",
            "lib/**/*.{ts,tsx}",
        ],
        plugins: { noslog: architecture },
        rules: { "noslog/boundaries": "error" },
    },
    {
        files: ["features/**/*.{ts,tsx}", "components/ui/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["../**"],
                            message:
                                "폴더 간 참조는 @/ 절대 경로를 사용하세요.",
                        },
                    ],
                },
            ],
        },
    },
    {
        files: [
            "components/ui/**/*.{ts,tsx}",
            ".storybook/**/*.{ts,tsx}",
            "vitest.storybook.config.ts",
            "tooling/**/*.mjs",
        ],
        plugins: { "simple-import-sort": simpleImportSort },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
    {
        files: [
            "lib/services/**/*.{js,ts}",
            "prisma/**/*.{js,mjs,ts}",
            "scripts/**/*.{js,mjs,ts}",
        ],
        rules: {
            "no-console": "off",
        },
    },
    ...storybook.configs["flat/recommended"],
    prettierConfig,
]);
