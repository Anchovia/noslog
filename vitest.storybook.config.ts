import { fileURLToPath, URL } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
    },
    plugins: [
        storybookTest({
            configDir: fileURLToPath(new URL("./.storybook", import.meta.url)),
            storybookScript: "npm run storybook -- --ci",
        }),
    ],
    test: {
        name: "storybook",
        browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
        },
    },
});
