import { expect, test } from "@playwright/test";

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} music detail changes page modes coherently while resizing`, async ({
        page,
    }, testInfo) => {
        test.setTimeout(120_000);
        await page.goto(`/${locale}/music/e2e-music-001/real`);
        await expect(page.locator(".nl-detail-columns")).toBeVisible();
        const widths = [
            320,
            390,
            488,
            ...Array.from({ length: 161 }, (_, index) => 640 + index),
            ...Array.from({ length: 161 }, (_, index) => 800 - index),
            1024,
            1055,
            1056,
            1280,
            1470,
            1920,
            1056,
            1055,
            671,
            672,
        ];
        for (const width of widths) {
            await page.setViewportSize({ width, height: 900 });
            await expect
                .poll(() =>
                    page.evaluate(() => {
                        const style = (selector: string) =>
                            getComputedStyle(document.querySelector(selector)!);
                        const area = document.querySelector(".nl-area")!;
                        return {
                            actions: style(".nl-music-entity").flexDirection,
                            tabs: Boolean(
                                area.querySelector('[role="tablist"]')
                            ),
                            select: Boolean(
                                area.querySelector(".nl-area__select")
                            ),
                            columns:
                                style(
                                    ".nl-detail-columns"
                                ).gridTemplateColumns.split(" ").length,
                            padding: style(".nl-main__content").paddingLeft,
                            overflow:
                                document.documentElement.scrollWidth >
                                document.documentElement.clientWidth,
                        };
                    })
                )
                .toEqual({
                    actions: width >= 672 ? "row" : "column",
                    tabs: width >= 672,
                    select: width < 672,
                    columns: width >= 1056 ? 2 : 1,
                    padding: width >= 672 ? "24px" : "16px",
                    overflow: false,
                });
            if ([390, 672, 1470].includes(width)) {
                await page.screenshot({
                    path: testInfo.outputPath(`music-detail-${width}.png`),
                    fullPage: true,
                });
            }
        }
        // A real area selection must survive changing representations, not only geometry.
        await page.locator('[role="tab"]').nth(2).click();
        await expect(page).toHaveURL(/tab=ranking/);
        await page.setViewportSize({ width: 390, height: 900 });
        await expect(page.locator(".nl-area__select")).toBeVisible();
        await expect(page).toHaveURL(/tab=ranking/);
        await page.locator(".nl-area__select").click();
        await expect(page.getByRole("option")).toHaveCount(4);
        await page.keyboard.press("Escape");
        await expect(page.locator(".nl-area__select")).toBeFocused();
        await page.setViewportSize({ width: 1470, height: 900 });
        await expect(page.locator('[role="tab"]').nth(2)).toHaveAttribute(
            "aria-selected",
            "true"
        );
        await expect(page).toHaveURL(/tab=ranking/);
    });
}

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} ordinary page columns and rails use viewport boundaries`, async ({
        page,
    }, testInfo) => {
        test.setTimeout(120_000);
        const cases = [
            { route: "/exams", selector: ".nl-exams", compact: 1, wide: 2 },
            {
                route: "/bingo",
                selector: ".nl-bingo-catalog__grid",
                compact: 3,
                wide: 4,
            },
            {
                route: "/bingo/1",
                selector: ".nl-bingo-detail__layout",
                compact: 1,
                wide: 2,
            },
            { route: "/privacy", selector: ".nl-privacy", compact: 1, wide: 2 },
            {
                route: "/gamecenter",
                selector: ".nl-arcades__results",
                compact: 1,
                wide: 2,
            },
            {
                route: "/bookmarklet",
                selector: ".nl-sync-columns",
                compact: 1,
                wide: 1,
            },
        ];
        for (const item of cases) {
            await page.goto(`/${locale}${item.route}`);
            const region = page.locator(item.selector).first();
            await expect(region).toBeVisible();
            for (const width of [1024, 1055, 1056, 1470, 1056, 1055, 672]) {
                await page.setViewportSize({ width, height: 900 });
                await expect
                    .poll(() =>
                        region.evaluate((element) => {
                            const columns =
                                getComputedStyle(element).gridTemplateColumns;
                            return columns === "none"
                                ? 1
                                : columns.split(" ").length;
                        })
                    )
                    .toBe(width >= 1056 ? item.wide : item.compact);
                if (item.route === "/exams") {
                    await expect(page.locator(".nl-exam-rail")).toBeVisible({
                        visible: width >= 1056,
                    });
                    await expect(page.locator(".nl-exam-select")).toBeVisible({
                        visible: width < 1056,
                    });
                }
                if (item.route === "/privacy") {
                    await expect(
                        page.locator(".nl-privacy-contents__wide")
                    ).toBeVisible({ visible: width >= 1056 });
                }
                expect(
                    await page.evaluate(
                        () =>
                            document.documentElement.scrollWidth <=
                            document.documentElement.clientWidth
                    )
                ).toBe(true);
                if (width === 1470)
                    await page.screenshot({
                        path: testInfo.outputPath(
                            `${item.route.replaceAll("/", "-")}-wide.png`
                        ),
                        fullPage: true,
                    });
            }
        }
    });
}
