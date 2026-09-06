import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow } from "./helpers";

const destinations = [
    "/music",
    "/music?scope=chart",
    "/tiers",
    "/rankings",
    "/bingo",
    "/exams",
    "/gamecenter",
    "/bookmarklet",
];

for (const locale of ["ko", "ja", "en"]) {
    for (const theme of ["dark", "light"]) {
        test(`${locale} ${theme} Home matches HOME-23 at compact and bounded widths`, async ({
            page,
        }, testInfo) => {
            test.skip(
                testInfo.project.name !== "desktop-chromium",
                "The matrix explicitly sets every viewport."
            );
            await page.addInitScript(
                (value) => localStorage.setItem("noslog-theme", value),
                theme
            );
            await page.goto(`/${locale}`);
            await page.evaluate(() => document.fonts.ready);
            const links = page.locator(".nl-home-tile");
            await expect(links).toHaveCount(8);
            for (let index = 0; index < destinations.length; index++) {
                await expect(links.nth(index)).toHaveAttribute(
                    "href",
                    `/${locale}${destinations[index]}`
                );
            }
            for (const width of [
                320, 390, 672, 768, 1024, 1280, 1440, 1512, 1920, 2560,
            ]) {
                await page.setViewportSize({ width, height: 900 });
                await expectNoHorizontalOverflow(page);
                await expect
                    .poll(() =>
                        page
                            .locator(".nl-home-tile__label")
                            .evaluateAll((elements) =>
                                elements.every(
                                    (e) => e.scrollWidth <= e.clientWidth
                                )
                            )
                    )
                    .toBe(true);
                const measured = await page.evaluate(() => {
                    const box = (selector: string) => {
                        const r = document
                            .querySelector(selector)!
                            .getBoundingClientRect();
                        return {
                            x: r.x,
                            y: r.y,
                            width: r.width,
                            height: r.height,
                        };
                    };
                    return {
                        main: box(".nl-main"),
                        search: box(".nl-home-search"),
                        navigation: box(".nl-home-navigation"),
                        tiles: Array.from(
                            document.querySelectorAll(".nl-home-tile")
                        ).map((tile) => {
                            const r = tile.getBoundingClientRect();
                            const icon = tile
                                .querySelector("svg")!
                                .getBoundingClientRect();
                            const label = tile.querySelector("span")!;
                            const text = label.getBoundingClientRect();
                            const css = getComputedStyle(label);
                            const surface = getComputedStyle(tile);
                            return {
                                x: r.x,
                                y: r.y,
                                width: r.width,
                                height: r.height,
                                iconWidth: icon.width,
                                gap: text.y - icon.bottom,
                                textSize: parseFloat(css.fontSize),
                                textWeight: css.fontWeight,
                                radius: surface.borderRadius,
                                background: surface.backgroundColor,
                                line: parseFloat(css.lineHeight),
                                label: label.textContent,
                            };
                        }),
                    };
                });
                const columns = measured.main.width < 672 ? 3 : 4;
                expect(measured.navigation.width).toBeCloseTo(
                    measured.search.width,
                    1
                );
                expect(measured.navigation.x).toBeCloseTo(measured.search.x, 1);
                if (columns === 4)
                    expect(measured.navigation.width).toBeLessThanOrEqual(640);
                const firstRow = measured.tiles.slice(0, columns);
                expect(firstRow.every((tile) => tile.y === firstRow[0].y)).toBe(
                    true
                );
                expect(measured.tiles[columns].y).toBeGreaterThan(
                    firstRow[0].y
                );
                expect(measured.tiles[columns].x).toBeCloseTo(firstRow[0].x, 1);
                for (const tile of measured.tiles) {
                    expect(tile.iconWidth).toBe(20);
                    expect(tile.gap).toBe(8);
                    expect([12, 14]).toContain(tile.textSize);
                    expect(tile.textWeight).toBe("500");
                    expect(tile.radius).toBe("8px");
                    expect(tile.background).toBe(
                        theme === "dark"
                            ? "rgb(27, 27, 27)"
                            : "rgb(248, 248, 248)"
                    );
                    expect(tile.height).toBe(
                        (columns === 3 ? 24 : 48) + 20 + 8 + tile.line
                    );
                }
                if (columns === 3)
                    expect(measured.tiles[6].x).toBeCloseTo(firstRow[0].x, 1);
                if ([320, 390, 768, 1440].includes(width)) {
                    await page.screenshot({
                        path: testInfo.outputPath(
                            `p2-${locale}-${theme}-${width}.png`
                        ),
                        fullPage: true,
                    });
                }
                if ([320, 768].includes(width)) {
                    const audit = await new AxeBuilder({ page })
                        .include(".nl-home")
                        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
                        .analyze();
                    expect(audit.violations).toEqual([]);
                }
            }
            const audit = await new AxeBuilder({ page })
                .include(".nl-home")
                .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
                .analyze();
            expect(audit.violations).toEqual([]);
        });
    }
    test(`${locale} Home destinations navigate to their exact localized routes`, async ({
        page,
    }) => {
        for (const destination of destinations) {
            await page.goto(`/${locale}`);
            const link = page.locator(
                `.nl-home-tile[href="/${locale}${destination}"]`
            );
            await link.focus();
            await expect(link).toBeFocused();
            await page.keyboard.press("Enter");
            await expect
                .poll(
                    () =>
                        new URL(page.url()).pathname +
                        new URL(page.url()).search
                )
                .toBe(`/${locale}${destination}`);
        }
    });
}

test("Home search preview overlays the bounded navigation and remains keyboard operable", async ({
    page,
}) => {
    await page.goto("/ko");
    const input = page.getByRole("combobox", {
        name: "악곡 제목·아티스트 검색",
        exact: true,
    });
    await input.fill("STULTI");
    const popup = page.locator(".nl-search-preview");
    await expect(popup).toBeVisible();
    await expect(popup.getByRole("option").first()).toBeVisible();
    const searchBox = (await page.locator(".nl-home-search").boundingBox())!;
    const popupBox = (await popup.boundingBox())!;
    expect(popupBox.width).toBeCloseTo(searchBox.width, 1);
    expect(popupBox.x).toBeCloseTo(searchBox.x, 1);
    await input.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-activedescendant", /.+/);
    await input.press("Escape");
    await expect(popup).not.toBeVisible();
    await expect(input).toBeFocused();
    await input.press("Enter");
    await expect(page).toHaveURL(/\/ko\/music\?q=STULTI$/);
});
