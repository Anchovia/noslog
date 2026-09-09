import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

test.skip(
    process.env.NOSLOG_ANNOUNCEMENTS_FIXTURE !== "true",
    "Requires the isolated local announcement presentation harness."
);
for (const locale of ["ko", "ja", "en"] as const) {
    test(`P11 ${locale} archive reflows with month groups and bounded pagination`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/p7-verification?fixture=announcements`);
        await expect(page.locator(".nl-announcement-row")).toHaveCount(20);
        await expect(page.locator(".nl-announcements__month")).toHaveCount(7);
        await expect(page.locator(".nl-pagination")).toBeVisible();
        await expect(
            page.locator('.nl-pagination [aria-current="page"]')
        ).toHaveText("1");
        await expect(
            page.getByRole("link", { name: t["common.nextPage"], exact: true })
        ).toHaveAttribute("href", `/${locale}/announcements?page=2`);
        for (const width of [320, 390, 520, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            const bounds = (await page
                .locator(".nl-announcements")
                .boundingBox())!;
            expect(bounds.width).toBeLessThanOrEqual(768);
            if (width === 1470)
                expect(
                    Math.abs(bounds.x - (width - bounds.width) / 2)
                ).toBeLessThan(10);
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`archive-${width}.png`),
                    fullPage: true,
                });
        }
        await page.setViewportSize({ width: 320, height: 600 });
        expect(
            (
                await new AxeBuilder({ page })
                    .include(".nl-announcements")
                    .analyze()
            ).violations
        ).toEqual([]);
        for (const state of ["twenty", "empty"]) {
            await page.goto(
                `/${locale}/p7-verification?fixture=announcements&state=${state}`
            );
            await expect(page.locator(".nl-pagination")).toHaveCount(0);
            await expect(page.locator(".nl-announcement-row")).toHaveCount(
                state === "twenty" ? 20 : 0
            );
            if (state === "empty") {
                await expect(
                    page.getByText(t["announcements.empty"], { exact: true })
                ).toBeVisible();
                await expect(
                    page.locator(".nl-announcements__month")
                ).toHaveCount(0);
            }
        }
        expect(errors).toEqual([]);
    });
    test(`P11 ${locale} detail preserves semantic Markdown, dates and long content`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=announcements&state=detail`
        );
        await page.setViewportSize({ width: 390, height: 900 });
        await expect(page.locator("article h1")).toHaveCount(1);
        await expect(page.locator("article h2")).toHaveCount(1);
        await expect(page.locator("article h3")).toHaveCount(1);
        await expect(page.locator(".nl-announcement-body")).toHaveCSS(
            "font-weight",
            "400"
        );
        await expect(page.locator(".nl-announcement-body")).toHaveCSS(
            "font-family",
            /Pretendard JP Variable/
        );
        expect(
            await page.evaluate(async () => {
                await document.fonts.ready;
                return Array.from(document.fonts).some(
                    (font) =>
                        font.family.includes("Pretendard") &&
                        font.status === "loaded"
                );
            })
        ).toBe(true);
        await expect(page.locator("article strong")).toHaveCSS(
            "font-weight",
            "600"
        );
        await expect(page.locator("article time")).toHaveCount(1);
        await expect(
            page.locator(`article a[href="/${locale}/bookmarklet"]`)
        ).toBeVisible();
        const external = page.locator('article a[href="https://discord.com/"]');
        await expect(external).toHaveAccessibleName(
            new RegExp(t["shell.externalLink"])
        );
        await expect(external.locator("svg")).toHaveCount(1);
        await expect(external).toHaveCSS("text-decoration-line", "underline");
        await page.screenshot({
            path: testInfo.outputPath("detail-390.png"),
            fullPage: true,
        });
        await page.goto(
            `/${locale}/p7-verification?fixture=announcements&state=long`
        );
        await expect(page.locator("article time")).toHaveCount(2);
        for (const width of [320, 390, 520, 768, 1470]) {
            await page.setViewportSize({ width, height: 600 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
        }
        await page.setViewportSize({ width: 320, height: 600 });
        expect(
            (await new AxeBuilder({ page }).include("article").analyze())
                .violations
        ).toEqual([]);
        const back = page.getByRole("link", {
            name: t["home.announcements"],
            exact: true,
        });
        await back.focus();
        await expect(back).toBeFocused();
        await back.press("Enter");
        await expect(page).toHaveURL(new RegExp(`/${locale}/announcements$`));
        await expect(
            page.getByRole("heading", {
                name: t["home.announcements"],
                exact: true,
            })
        ).toBeVisible();
        const missing = await page.goto(
            `/${locale}/announcements/not-a-public-announcement`
        );
        expect(missing?.status()).toBe(404);
    });
    test(`P11 ${locale} Home keeps critical and routine notices separate`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=announcements&state=home`
        );
        await expect(page.locator(".nl-home-critical")).toHaveCount(1);
        await expect(page.locator(".nl-home-critical a")).toHaveAttribute(
            "href",
            `/${locale}/announcements/fixture-1`
        );
        await expect(
            page.locator(".nl-home-announcements .nl-announcement-row")
        ).toHaveCount(3);
        await expect(
            page.locator('.nl-home-announcements a[href$="/fixture-1"]')
        ).toHaveCount(0);
        await expect(
            page.getByText(t["announcements.critical"], { exact: true })
        ).toBeVisible();
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            const critical = (await page
                .locator(".nl-home-critical")
                .boundingBox())!;
            const routine = (await page
                .locator(".nl-home-updates")
                .boundingBox())!;
            expect(critical.width).toBeLessThanOrEqual(640);
            expect(critical.x).toBe(routine.x);
            expect(critical.width).toBe(routine.width);
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
        }
        expect(
            (await new AxeBuilder({ page }).include(".nl-home").analyze())
                .violations
        ).toEqual([]);
        await page.goto(
            `/${locale}/p7-verification?fixture=announcements&state=home-empty`
        );
        await expect(page.locator(".nl-home-critical")).toHaveCount(0);
        await expect(page.locator(".nl-home-announcements")).toHaveCount(0);
    });
}
