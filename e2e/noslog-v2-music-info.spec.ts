import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const musicPath = "/music/bfdaadfb98501907925ecf41a076108d/expert";
const pattern = {
    stairs: { count: 41, average: 2.8 },
    repetition: { count: 40, average: 3.4 },
    polyrhythm: { count: 38, average: 1.6 },
    offset: { count: 39, average: 2.1 },
    chords: { count: 41, average: 3.7 },
};

test("Music detail enters Chart Info and keeps the four difficulty choices on one row", async ({
    page,
}) => {
    await page.goto(`/ko${musicPath}`);
    await expect(
        page.getByRole("heading", { name: "채보 정보", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(4);
    for (const width of [320, 360, 390, 430, 768, 1024, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await expect
            .poll(() =>
                page
                    .locator(".nl-difficulty-selector")
                    .evaluate(
                        (element) => element.getBoundingClientRect().height
                    )
            )
            .toBe(82);
        await expect
            .poll(() =>
                page
                    .locator(".nl-music-entity h1")
                    .evaluate((element) => getComputedStyle(element).fontSize)
            )
            .toBe("24px");
        await expect
            .poll(() =>
                page.evaluate(
                    () =>
                        document.documentElement.scrollWidth <=
                        document.documentElement.clientWidth
                )
            )
            .toBe(true);
        if (width < 768)
            await expect(
                page.getByRole("combobox", { name: "상세 영역" })
            ).toBeVisible();
        else
            await expect(
                page.getByRole("tablist", { name: "상세 영역" })
            ).toBeVisible();
    }
    await page.getByRole("radio", { name: /^Hard/ }).click();
    await expect(page).toHaveURL(/\/hard$/);
    await expect(page.getByRole("radio", { name: /^Hard/ })).toBeChecked();
    await expect(
        page.getByRole("heading", { name: "채보 정보", exact: true })
    ).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("radio", { name: /^Expert/ })).toBeChecked();
});

test("Pattern data has five exact values and a keyboard dismissible help dialog", async ({
    page,
}) => {
    await page.route("**/api/music-community?**", (route) =>
        route.fulfill({
            json: {
                isSuccess: true,
                code: "SUCCESS",
                message: "",
                result: { pattern },
            },
        })
    );
    await page.goto(`/ko${musicPath}`);
    await expect(page.locator(".nl-pattern-radar__series")).toHaveCount(1);
    await expect(page.locator(".nl-pattern-radar__point")).toHaveCount(5);
    await expect(page.locator(".nl-pattern-radar__values dt")).toHaveText([
        "계단",
        "연타",
        "폴리리듬",
        "즈레",
        "동시치기",
    ]);
    await expect(
        page.locator(".nl-pattern-radar__values dd").first()
    ).toHaveText("2.8평가 41명");
    const help = page.getByRole("button", {
        name: "패턴 경향 기준",
        exact: true,
    });
    await help.click();
    await expect(
        page.getByRole("dialog", { name: "패턴 경향 기준" })
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(help).toBeFocused();
});

test("An incomplete pattern aggregate keeps all counts and omits the entire polygon", async ({
    page,
}) => {
    await page.route("**/api/music-community?**", (route) =>
        route.fulfill({
            json: {
                isSuccess: true,
                code: "SUCCESS",
                message: "",
                result: {
                    pattern: {
                        ...pattern,
                        polyrhythm: { count: 2, average: null },
                    },
                },
            },
        })
    );
    await page.goto(`/ko${musicPath}`);
    await expect(
        page.locator(".nl-pattern-radar__values dd").nth(2)
    ).toHaveText("집계 중평가 2명");
    await expect(page.locator(".nl-pattern-radar__series")).toHaveCount(0);
    await expect(page.locator(".nl-pattern-radar__point")).toHaveCount(0);
    await expect(page.locator(".nl-pattern-radar__grid")).toHaveCount(9);
});

test("Pattern request failure preserves basic information and retries only its region", async ({
    page,
}) => {
    let failed = true;
    await page.route("**/api/music-community?**", (route) =>
        failed
            ? route.fulfill({
                  status: 503,
                  json: {
                      isSuccess: false,
                      code: "TEST_UNAVAILABLE",
                      message: "Unavailable",
                      result: null,
                  },
              })
            : route.fulfill({
                  json: {
                      isSuccess: true,
                      code: "SUCCESS",
                      message: "",
                      result: { pattern },
                  },
              })
    );
    await page.goto(`/ko${musicPath}`);
    const error = page
        .getByRole("alert")
        .filter({ hasText: "악곡 정보를 불러오지 못했습니다." });
    await expect(error).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "기본 정보" })
    ).toBeVisible();
    failed = false;
    await error.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(page.locator(".nl-pattern-radar__series")).toHaveCount(1);
});

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} Chart Info keeps readable labels at every width and passes accessibility checks`, async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== "mobile-chromium",
            "Explicit width matrix is run once."
        );
        await page.route("**/api/music-community?**", (route) =>
            route.fulfill({
                json: {
                    isSuccess: true,
                    code: "SUCCESS",
                    message: "",
                    result: { pattern },
                },
            })
        );
        await page.goto(`/${locale}${musicPath}`);
        await expect(page.locator(".nl-pattern-radar__point")).toHaveCount(5);
        for (const width of [320, 390, 768, 1024, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            await expect
                .poll(() =>
                    page.evaluate(
                        () =>
                            document.documentElement.scrollWidth <=
                            document.documentElement.clientWidth
                    )
                )
                .toBe(true);
            await expect
                .poll(() =>
                    page
                        .locator(".nl-pattern-radar__label")
                        .evaluateAll((elements) =>
                            elements.every((element) => {
                                const rect = element.getBoundingClientRect();
                                const panel = element
                                    .closest("figure")!
                                    .getBoundingClientRect();
                                return (
                                    rect.left >= panel.left &&
                                    rect.right <= panel.right
                                );
                            })
                        )
                )
                .toBe(true);
            await page.screenshot({
                path: testInfo.outputPath(`${locale}-info-${width}.png`),
                fullPage: true,
            });
            if (width === 320 || width === 1280) {
                const result = await new AxeBuilder({ page })
                    .include(".nl-app")
                    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
                    .analyze();
                expect(
                    result.violations,
                    JSON.stringify(
                        result.violations.map(({ id, nodes }) => ({
                            id,
                            nodes: nodes.map((node) => node.target),
                        }))
                    )
                ).toEqual([]);
            }
        }
    });
}
