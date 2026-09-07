import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const locale of ["ko", "ja", "en"])
    test(`${locale} dark P1–P5 cross-browser navigation and reflow`, async ({
        page,
    }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        for (const path of [
            "",
            "/music",
            "/music/bfdaadfb98501907925ecf41a076108d/expert",
            "/tiers",
            "/rankings",
        ]) {
            await page.goto(`/${locale}${path}`);
            await expect(page.locator("main h1").first()).toBeVisible();
            await expect(page.locator("html")).toHaveAttribute("lang", locale);
            await expect(page.locator("html")).toHaveAttribute(
                "data-theme",
                "dark"
            );
            for (const width of [320, 390, 768, 1470]) {
                await page.setViewportSize({ width, height: 900 });
                await expect
                    .poll(
                        () =>
                            page.evaluate(() => ({
                                viewport: innerWidth,
                                overflow:
                                    document.documentElement.scrollWidth -
                                    innerWidth,
                            })),
                        {
                            message: `${locale}${path} must reflow at ${width}px`,
                        }
                    )
                    .toEqual({ viewport: width, overflow: 0 });
            }
            const scan = await new AxeBuilder({ page })
                .include("main")
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
            expect(scan.violations).toEqual([]);
        }
        expect(errors).toEqual([]);
    });
