import { defineConfig } from "@playwright/test";

if (process.platform !== "linux" || process.arch !== "x64") {
    throw new Error(
        "시각 비교는 Linux amd64 기준입니다. npm run test:visual:docker를 사용하세요."
    );
}

const port = Number(process.env.STORYBOOK_VISUAL_PORT ?? 6010);
export default defineConfig({
    testDir: "./visual",
    fullyParallel: false,
    workers: 1,
    forbidOnly: Boolean(process.env.CI),
    retries: 0,
    updateSnapshots: "none",
    outputDir:
        process.env.STORYBOOK_VISUAL_RESULTS ??
        "/tmp/noslog-storybook-visual-results",
    reporter: "list",
    snapshotPathTemplate: "{testDir}/snapshots/{projectName}/{arg}{ext}",
    expect: {
        timeout: 10000,
        toHaveScreenshot: {
            animations: "disabled",
            caret: "hide",
            scale: "css",
            maxDiffPixels: 0,
        },
    },
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        browserName: "chromium",
        colorScheme: "dark",
        contextOptions: { reducedMotion: "reduce" },
        timezoneId: "Asia/Seoul",
        deviceScaleFactor: 1,
    },
    projects: [
        { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
        { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
    ],
    webServer: {
        command: "node tooling/storybook/serve.mjs",
        url: `http://127.0.0.1:${port}`,
        reuseExistingServer: false,
        timeout: 30000,
    },
});
