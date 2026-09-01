import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import tanstackQuery from "@tanstack/eslint-plugin-query";

export default defineConfig([
    ...tanstackQuery.configs["flat/recommended"],
    {
        extends: [...nextCoreWebVitals, ...nextTypescript],
    },
    prettierConfig,
]);
