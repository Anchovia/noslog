import { expect, test } from "@playwright/test";

import {
    expectNoHorizontalOverflow,
    expectPageLoaded,
    readPerformanceSnapshot,
} from "./helpers";

test("핵심 화면에서 처리되지 않은 브라우저 오류가 발생하지 않는다", async ({
    page,
}) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    for (const path of ["/ko", "/ja/music", "/en/rankings", "/ko/tiers"]) {
        await page.goto(path);
        await expectPageLoaded(page);
        await expectNoHorizontalOverflow(page);
    }

    expect(pageErrors).toEqual([]);
});

test("데스크톱 핵심 화면이 완화된 성능 안전선을 넘지 않는다", async ({
    page,
}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");

    for (const path of ["/ko", "/en/music"]) {
        await page.goto(path);
        await expectPageLoaded(page);
        const snapshot = await readPerformanceSnapshot(page);

        expect(snapshot.domContentLoadedMs).toBeLessThan(10_000);
        expect(snapshot.loadMs).toBeLessThan(12_000);
        expect(snapshot.firstContentfulPaintMs).toBeLessThan(8_000);
        expect(snapshot.requestCount).toBeLessThan(250);
        expect(snapshot.transferBytes).toBeLessThan(20 * 1024 * 1024);
    }
});
