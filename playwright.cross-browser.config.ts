import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
    ...base,
    projects: (["firefox", "webkit"] as const).flatMap((browserName) =>
        [
            { name: "mobile", width: 390 },
            { name: "desktop", width: 1470 },
        ].map(({ name, width }) => ({
            name: `${name}-${browserName}`,
            use: { browserName, viewport: { width, height: 900 } },
        }))
    ),
});
