import { expect, test } from "@playwright/test";

// 화면은 공식 분할판(unicode-range 조각)만 받는다 — 한 파일 원본은 북마클릿 오버레이용(가이드 「테마 · 글꼴」)
const subsetPath = "/fonts/pretendard-jp/1.3.9/dynamic-subset/";
const samples = {
    ko: "한글 악곡 랭킹 0123456789",
    ja: "楽曲ランキング 日本語 0123456789",
    en: "Music Rankings 0123456789",
};

for (const locale of ["ko", "ja", "en"] as const) {
    test(`${locale} ordinary UI loads only the official JP font subsets across all implemented page families`, async ({
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
            "/music/bfdaadfb98501907925ecf41a076108d/expert",
            "/tiers",
            "/rankings",
            "/profile/1",
            "/bookmarklet",
            "/settings?category=experience",
            "/announcements",
            "/gamecenter",
            "/exams",
            "/bingo",
            "/privacy",
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
            expect(result.family.split(",")[0].replaceAll('"', "").trim()).toBe(
                "Pretendard JP Variable"
            );
            expect(result.feature).toBe(locale === "ko" ? '"ss05"' : "normal");
            // 조각마다 같은 가변 굵기 45–920 · 쓰인 조각만 받고 실패는 없다
            expect(result.faces.length).toBeGreaterThan(1);
            for (const face of result.faces) {
                expect(face.weight).toBe("45 920");
                expect(face.status).not.toBe("error");
            }
            expect(result.faces.some((face) => face.status === "loaded")).toBe(
                true
            );
            expect(result.weightsLoaded).toBe(true);
            expect(result.scrollWidth).toBeLessThanOrEqual(result.clientWidth);
        }
        expect(fontRequests.size).toBeGreaterThan(0);
        for (const pathname of fontRequests)
            expect(pathname.startsWith(subsetPath), pathname).toBe(true);
        expect(fontStatuses.has(200)).toBe(true);
        expect(fontFailures).toEqual([]);
        await page.screenshot({
            path: testInfo.outputPath(`single-font-${locale}.png`),
            fullPage: true,
        });
    });
}
