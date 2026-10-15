import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P8 ${locale} guest explanation has no personal data and reflows with shared margins`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/bookmarklet`);
        const main = page.getByRole("main");
        await expect(main.getByRole("heading", { level: 1 })).toHaveText(
            t["sync.title"]
        );
        await expect(
            main.getByRole("heading", { name: t["sync.whatSent"], exact: true })
        ).toBeVisible();
        await expect(
            main.getByRole("heading", {
                name: t["sync.latestResult"],
                exact: true,
            })
        ).toHaveCount(0);
        await expect(main.locator('a[href^="javascript:"]')).toHaveCount(0);
        await expect(
            main.getByRole("link", { name: t["common.login"], exact: true })
        ).toHaveAttribute("href", `/${locale}/login?returnTo=/bookmarklet`);
        for (const width of [320, 390, 520, 768, 1024, 1470]) {
            await page.setViewportSize({ width, height: 844 });
            await expect
                .poll(() =>
                    page.evaluate(
                        () => document.documentElement.scrollWidth <= innerWidth
                    )
                )
                .toBe(true);
            const heading = await main
                .getByRole("heading", { level: 1 })
                .boundingBox();
            const logo = await page
                .getByRole("banner")
                .getByRole("link", { name: "NosLog", exact: true })
                .boundingBox();
            // 페이지 = 읽기 폭 768 · 가운데(가이드 「데이터 동기화」, PageContainer width="reading") —
            // 768 보다 좁으면 공용 여백에 붙고, 넓으면 가운데에 놓인다
            const container = (await main
                .locator(".nl-container--reading")
                .boundingBox())!;
            if (container.width < 768)
                expect(Math.abs(heading!.x - logo!.x)).toBeLessThan(1);
            else {
                expect(container.x + container.width / 2).toBeCloseTo(
                    width / 2,
                    0
                );
                expect(heading!.x).toBeCloseTo(container.x, 0);
            }
        }
        expect(
            (await new AxeBuilder({ page }).include(".nl-app").analyze())
                .violations
        ).toEqual([]);
        expect(errors).toEqual([]);
        const api = await page.request.get("/api/sync/status");
        expect(api.status()).toBe(401);
        await main
            .getByRole("link", { name: t["common.login"], exact: true })
            .click();
        await expect(
            page.locator('a[href^="/discord/start?"]')
        ).toHaveAttribute(
            "href",
            `/discord/start?returnTo=${encodeURIComponent(`/${locale}/bookmarklet`)}`
        );
    });
}
