import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: [
        "../components/ui/**/*.stories.tsx",
        "../features/**/*.stories.tsx",
    ],
    addons: [
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-vitest",
    ],
    framework: "@storybook/nextjs-vite",
    staticDirs: ["../public"],
    core: { disableTelemetry: true },
};

export default config;
