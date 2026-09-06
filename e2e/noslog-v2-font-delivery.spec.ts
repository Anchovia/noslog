import { expect, test } from "@playwright/test";

const fontPath = "/fonts/pretendard-jp/1.3.9/PretendardJPVariable.woff2";
const samples = {
    ko: "한글 악곡 랭킹 0123456789",
    ja: "楽曲ランキング 日本語 0123456789",
    en: "Music Rankings 0123456789",
};

for (const locale of ["ko", "ja", "en"] as const) {
    test(`${locale} ordinary UI loads one complete JP font across all implemented page families`, async ({
        page,
    }, testInfo) => {
        const fontRequests = new Set<string>();
        const fontStatuses = new Set<number>();
        const fontFailures: string[] = [];
        page.on("request", (request) => {
            const pathname = new URL(request.url()).pathname;
            if (pathname.includes("/fonts/pretendard-jp/"))
                fontRequests.add(pathname);
        });
        page.on("requestfailed", (request) => {
            if (request.url().includes("/fonts/pretendard-jp/"))
                fontFailures.push(
                    `${request.failure()?.errorText}: ${request.url()}`
                );
        });
        page.on("response", (response) => {
            if (!response.url().includes("/fonts/pretendard-jp/")) return;
            fontStatuses.add(response.status());
            if (!response.ok() && response.status() !== 304)
                fontFailures.push(`${response.status()}: ${response.url()}`);
        });

        for (const route of [
            "",
            "/music",
            "/music/e2e-music-001/expert",
            "/tiers",
            "/rankings",
        ]) {
            await page.goto(`/${locale}${route}`);
            await expect(page.locator(".noslog-ui.nl-app")).toBeVisible();
            await page.evaluate(() =>
                document.fonts.ready.then(() => undefined)
            );
            const result = await page
                .locator(".noslog-ui.nl-app")
                .evaluate((element, sample) => {
                    const style = getComputedStyle(element);
                    return {
                        family: style.fontFamily,
                        feature: style.fontFeatureSettings,
                        faces: [...document.fonts]
                            .filter(
                                (face) =>
                                    face.family.replaceAll('"', "") ===
                                    "Pretendard JP Variable"
                            )
                            .map((face) => ({
                                status: face.status,
                                weight: face.weight,
                            })),
                        weightsLoaded: [400, 500, 600, 700].every((weight) =>
                            document.fonts.check(
                                `${weight} 16px "Pretendard JP Variable"`,
                                sample
                            )
                        ),
                        clientWidth: document.documentElement.clientWidth,
                        scrollWidth: document.documentElement.scrollWidth,
                    };
                }, samples[locale]);
            expect(result.family).toMatch(/^"Pretendard JP Variable"/);
            expect(result.feature).toBe(locale === "ko" ? '"ss05"' : "normal");
            expect(result.faces).toEqual([
                { status: "loaded", weight: "45 920" },
            ]);
            expect(result.weightsLoaded).toBe(true);
            expect(result.scrollWidth).toBeLessThanOrEqual(result.clientWidth);
        }
        expect([...fontRequests]).toEqual([fontPath]);
        expect(fontStatuses.has(200)).toBe(true);
        expect(fontFailures).toEqual([]);
        await page.screenshot({
            path: testInfo.outputPath(`single-font-${locale}.png`),
            fullPage: true,
        });
    });
}
