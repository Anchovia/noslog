import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, reviewThemes } from "./helpers";

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
    for (const theme of reviewThemes) {
        test(`${locale} ${theme} Home matches HOME-23 at compact and bounded widths`, async ({
            page,
        }, testInfo) => {
            test.skip(
                !testInfo.project.name.startsWith("desktop-"),
                "The matrix explicitly sets every viewport."
            );
            await page.addInitScript(
                (value) => localStorage.setItem("noslog-theme", value),
                theme
            );
            await page.goto(`/${locale}`);
            await expect(page).toHaveTitle("NosLog");
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

for (const state of ["ready", "empty", "error"] as const) {
    test(`Official news ${state} retains the official link and bounded layout`, async ({
        page,
    }) => {
        await page.route("https://platform.twitter.com/widgets.js", (route) =>
            route.fulfill({
                contentType: "application/javascript",
                body: `window.twttr = { widgets: { load: async function(container) {
                    ${state === "error" ? 'throw new Error("fixture");' : state === "ready" ? 'const frame = document.createElement("iframe"); frame.title = "Official news fixture"; frame.style.cssText = "width:100%;height:180px;border:0"; container.appendChild(frame);' : ""}
                } } };`,
            })
        );
        await page.goto("/ko");
        const news = page.locator(".nl-home-update").filter({
            has: page.getByRole("heading", { name: "NOSTALGIA 공식 소식" }),
        });
        await expect(
            news.getByRole("link", { name: "공식 X", exact: true })
        ).toHaveAttribute("href", "https://x.com/NOSTALGIA_573");
        if (state === "ready") {
            await expect(news.locator("iframe")).toBeVisible();
            await expect(news.locator(".nl-home-news-state")).toHaveCount(0);
        } else {
            await expect(news.locator(".nl-home-news-state")).toContainText(
                state === "empty"
                    ? "아직 표시할 공식 소식이 없습니다."
                    : "불러오지 못했습니다"
            );
            await expect(news.locator(".nl-home-timeline")).toBeHidden();
        }
        const search = await page.locator(".nl-home-search").boundingBox();
        const box = await news.boundingBox();
        expect(box!.x).toBeCloseTo(search!.x, 1);
        expect(box!.width).toBeCloseTo(search!.width, 1);
        await expectNoHorizontalOverflow(page);
    });
}

test("Home search preserves input when hydration scripts arrive late", async ({
    page,
}) => {
    let release!: () => void;
    const ready = new Promise<void>((resolve) => {
        release = resolve;
    });
    await page.route(/\/_next\/static\/.*\.js(?:\?|$)/, async (route) => {
        await ready;
        await route.continue();
    });
    try {
        await page.goto("/ko", { waitUntil: "commit" });
        const input = page.getByRole("combobox", {
            name: "악곡 제목·아티스트 검색",
            exact: true,
        });
        await expect(input).toBeVisible();
        await expect(input).toBeDisabled();
        await expect(
            page.getByRole("combobox", { name: "검색 범위", exact: true })
        ).toBeDisabled();
        release();
        await input.fill("STULTI");
        await expect(page.locator(".nl-search-preview")).toBeVisible();
        await expect(input).toHaveValue("STULTI");
        await input.press("Escape");
        await expect(input).toBeFocused();
        await expect(input).toHaveValue("STULTI");
    } finally {
        release();
    }
});

test("Home preview waits for IME completion and retries an empty response", async ({
    page,
}) => {
    const requests: string[] = [];
    let failure = true;
    await page.route("**/api/music-preview?**", async (route) => {
        requests.push(new URL(route.request().url()).searchParams.get("q")!);
        await route.fulfill(
            failure
                ? {
                      status: 503,
                      json: {
                          isSuccess: false,
                          code: "UNAVAILABLE",
                          message: "fixture",
                          result: null,
                      },
                  }
                : {
                      json: {
                          isSuccess: true,
                          code: "SUCCESS",
                          message: "",
                          result: { total: 0, items: [] },
                      },
                  }
        );
    });
    await page.goto("/ko");
    const input = page.getByRole("combobox", {
        name: "악곡 제목·아티스트 검색",
        exact: true,
    });
    await expect(input).toBeEnabled();
    await input.focus();
    await input.dispatchEvent("compositionstart");
    // Firefox's fill() commits its own composition; model an unfinished IME input explicitly.
    await input.evaluate((element) => {
        Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
        )!.set!.call(element, "서열");
        element.dispatchEvent(
            new InputEvent("input", {
                bubbles: true,
                data: "서열",
                inputType: "insertCompositionText",
                isComposing: true,
            })
        );
    });
    await page.waitForTimeout(450);
    expect(requests).toEqual([]);
    await input.dispatchEvent("compositionend");
    const popup = page.locator(".nl-search-preview");
    await expect(
        popup.getByRole("button", { name: "다시 시도" })
    ).toBeVisible();
    expect(requests).toEqual(["서열"]);
    failure = false;
    await popup.getByRole("button", { name: "다시 시도" }).click();
    await expect(popup.getByRole("status")).toContainText(
        "일치하는 결과가 없습니다."
    );
    await input.press("Escape");
    await expect(popup).toBeHidden();
    await expect(input).toBeFocused();
});
