import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, localeCopy } from "./helpers";

const widths = [
    320, 390, 672, 768, 1000, 1055, 1056, 1173, 1174, 1280, 1440, 1470, 1512,
    1600, 1920, 2560,
];
const routes = [
    "",
    "/music",
    "/music/bfdaadfb98501907925ecf41a076108d/expert",
    "/tiers",
    "/rankings",
    "/bingo",
    "/bingo/1",
    "/exams",
    "/profile/1",
    "/privacy",
    "/gamecenter",
    "/bookmarklet",
];

test.beforeEach(({}, testInfo) => {
    test.skip(
        testInfo.project.name !== "desktop-chromium",
        "This matrix explicitly covers mobile through ultrawide viewports."
    );
});

for (const locale of ["ko", "ja", "en"] as const) {
    test(`${locale} ordinary routes share a centered 1000px shell and content alignment`, async ({
        page,
    }, testInfo) => {
        test.setTimeout(120_000);
        for (const route of routes) {
            await page.goto(`/${locale}${route}`);
            await expect(page.locator(".nl-footer__content")).toHaveCount(1);
            for (const width of widths) {
                await page.setViewportSize({ width, height: 900 });
                const layout = await page.evaluate(() => {
                    const box = (selector: string) => {
                        const element = document.querySelector(selector)!;
                        const rect = element.getBoundingClientRect();
                        const style = getComputedStyle(element);
                        return {
                            x: rect.x,
                            width: rect.width,
                            paddingLeft: parseFloat(style.paddingLeft),
                            paddingRight: parseFloat(style.paddingRight),
                        };
                    };
                    return {
                        viewport: document.documentElement.clientWidth,
                        header: box(".nl-header__bar"),
                        main: box(".nl-main"),
                        footer: box(".nl-footer__content"),
                        headerSurface: box(".nl-header"),
                        footerSurface: box(".nl-footer"),
                        content: box(".nl-main__content"),
                        pageRoot: box(
                            ".nl-main__content > :not(script):not(style)"
                        ),
                    };
                });
                const expectedWidth = Math.min(layout.viewport, 1000);
                const expectedX = (layout.viewport - expectedWidth) / 2;
                for (const box of [layout.header, layout.main, layout.footer]) {
                    expect(box.width, `${route} at ${width}`).toBeCloseTo(
                        expectedWidth,
                        1
                    );
                    expect(box.x, `${route} at ${width}`).toBeCloseTo(
                        expectedX,
                        1
                    );
                }
                for (const surface of [
                    layout.headerSurface,
                    layout.footerSurface,
                ]) {
                    expect(surface.width).toBe(layout.viewport);
                    expect(surface.x).toBe(0);
                }
                const padding = expectedWidth < 672 ? 16 : 24;
                for (const box of [layout.header, layout.footer]) {
                    expect(box.paddingLeft).toBe(padding);
                    expect(box.paddingRight).toBe(padding);
                }
                expect(layout.content.paddingLeft).toBe(padding);
                expect(layout.content.paddingRight).toBe(padding);
                expect(layout.pageRoot.paddingLeft).toBe(0);
                expect(layout.pageRoot.paddingRight).toBe(0);
                expect(layout.pageRoot.x).toBeCloseTo(expectedX + padding, 1);
                expect(layout.pageRoot.width).toBeCloseTo(
                    expectedWidth - padding * 2,
                    1
                );
                await expectNoHorizontalOverflow(page);
                if (route === "") {
                    const content = await page
                        .locator(".nl-home")
                        .boundingBox();
                    expect(content?.width).toBeCloseTo(
                        expectedWidth - padding * 2,
                        1
                    );
                    await expectNoHorizontalOverflow(page);
                    const search = (await page
                        .locator(".nl-home-search")
                        .boundingBox())!;
                    for (const selector of [
                        ".nl-home-navigation",
                        ".nl-home-updates",
                        ".nl-home-update",
                    ]) {
                        for (const region of await page
                            .locator(selector)
                            .all()) {
                            const box = (await region.boundingBox())!;
                            expect(box.x).toBeCloseTo(search.x, 1);
                            expect(box.width).toBeCloseTo(search.width, 1);
                        }
                    }
                    if ([390, 1440, 2560].includes(width)) {
                        await page.screenshot({
                            path: testInfo.outputPath(
                                `${locale}-home-${width}.png`
                            ),
                            fullPage: true,
                        });
                    }
                }
            }
        }
    });

    test(`${locale} menu remains anchored and keyboard accessible across widths`, async ({
        page,
    }) => {
        await page.goto(`/${locale}`);
        for (const width of [320, 390, 768, 1440, 2560]) {
            await page.setViewportSize({ width, height: 900 });
            const trigger = page.getByRole("button", {
                name: localeCopy[locale].openMenu,
            });
            await trigger.click();
            const panel = page.locator("#app-destinations");
            await expect(panel).toBeVisible();
            await expect(panel.locator("a").first()).toBeFocused();
            const panelBox = (await panel.boundingBox())!;
            const triggerBox = (await page
                .locator(".nl-nav-trigger")
                .boundingBox())!;
            if (width >= 672) {
                expect(panelBox.width).toBe(488);
                expect(panelBox.x + panelBox.width).toBeCloseTo(
                    triggerBox.x + triggerBox.width,
                    1
                );
            } else {
                expect(panelBox.x).toBe(16);
                await expect(
                    page.locator(".nl-header__interaction")
                ).toHaveAttribute("aria-modal", "true");
                expect(
                    await page
                        .locator("main")
                        .evaluate((element) => (element as HTMLElement).inert)
                ).toBe(true);
            }
            await page.keyboard.press("Escape");
            await expect(panel).not.toBeVisible();
            await expect(trigger).toBeFocused();
            expect(
                await page
                    .locator("main")
                    .evaluate((element) => (element as HTMLElement).inert)
            ).toBe(false);
            await expectNoHorizontalOverflow(page);
        }
        const audit = await new AxeBuilder({ page })
            .include(".nl-header")
            .include(".nl-footer")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(audit.violations).toEqual([]);
    });
}

test("the chart viewer retains its original shell", async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 900 });
    await page.goto(
        "/ko/music/bfdaadfb98501907925ecf41a076108d/expert/pattern"
    );
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator(".nl-app")).toHaveCount(0);
    const box = await page.locator("main").boundingBox();
    expect(box?.width).toBe(390);
});
