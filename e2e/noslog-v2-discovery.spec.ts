import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Discovery appends explicit batches and preserves the result set when changing view", async ({
    page,
}) => {
    await page.goto("/ko/music");
    await expect(page.locator("[data-result]")).toHaveCount(20);
    await page
        .getByRole("button", { name: "결과 20개 더 보기", exact: true })
        .click();
    await expect(page.locator("[data-result]")).toHaveCount(40);
    await expect(
        page.locator("[data-result]").nth(20).getByRole("link")
    ).toBeFocused();
    await page.getByRole("radio", { name: "격자", exact: true }).click();
    await expect(page.locator("[data-result]")).toHaveCount(40);
    await expect(page).toHaveURL(/view=grid/);
    await expect(page.locator(".nl-discovery__items--grid")).toBeVisible();
});

test("Compact filters stage changes, cancel with Escape and Back, and commit one result set", async ({
    page,
}, testInfo) => {
    test.skip(
        testInfo.project.name !== "mobile-chromium",
        "The compact layer is checked on the compact project."
    );
    await page.goto("/ko/music");
    const trigger = page.getByRole("button", {
        name: "필터 및 정렬",
        exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "필터 및 정렬" });
    await dialog.getByText("pops", { exact: true }).click();
    await expect(
        dialog.getByRole("button", { name: "결과 1개 보기", exact: true })
    ).toBeVisible();
    await expect(page.locator("[data-result]")).toHaveCount(20);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(
        dialog.getByRole("checkbox", { name: "pops", exact: true })
    ).not.toBeChecked();
    await page.goBack();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/\/ko\/music$/);
    await trigger.click();
    await dialog.getByText("pops", { exact: true }).click();
    await dialog
        .getByRole("button", { name: "결과 1개 보기", exact: true })
        .click();
    await expect(page.locator("[data-result]")).toHaveCount(1);
    await expect(page).toHaveURL(/categories=pops/);
    await expect(trigger).toBeFocused();
});

test("Wide filters apply directly while sort retains an explicit difficulty requirement", async ({
    page,
}, testInfo) => {
    test.skip(
        testInfo.project.name !== "desktop-chromium",
        "The visible filter rail is checked on the desktop project."
    );
    await page.goto("/ko/music");
    const rail = page.getByRole("complementary", { name: "필터", exact: true });
    await rail.getByText("pops", { exact: true }).click();
    await expect(page.locator("[data-result]")).toHaveCount(1);
    await page.getByRole("button", { name: "정렬", exact: true }).click();
    const sort = page.getByRole("dialog", { name: "정렬", exact: true });
    await sort.getByText("레벨 순", { exact: true }).click();
    await expect(page).not.toHaveURL(/sort=level/);
    await sort.getByText("Hard", { exact: true }).click();
    await expect(page).toHaveURL(/sort=level/);
    await expect(page).toHaveURL(/sortDifficulty=Hard/);
});

test("Discovery exposes settled empty, retry, and delayed replacement states without activating stale results", async ({
    page,
}) => {
    let fail = true;
    await page.route("**/api/discovery?**", async (route) => {
        const q = new URL(route.request().url()).searchParams.get("q");
        if (q !== "noslog-state-check") return route.continue();
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (fail)
            return route.fulfill({
                status: 503,
                json: {
                    isSuccess: false,
                    code: "TEST_UNAVAILABLE",
                    message: "Unavailable",
                    result: null,
                },
            });
        return route.fulfill({
            json: {
                isSuccess: true,
                code: "SUCCESS",
                message: "",
                result: {
                    items: [],
                    total: 0,
                    chartTotal: 0,
                    nextOffset: null,
                },
            },
        });
    });
    await page.goto("/ko/music");
    const search = page.getByRole("searchbox", {
        name: "악곡 제목·아티스트 검색",
        exact: true,
    });
    await search.fill("noslog-state-check");
    const region = page.getByRole("region", { name: "검색 결과", exact: true });
    await expect(region).toHaveAttribute("aria-busy", "true");
    await expect(region.getByRole("link").first()).toHaveAttribute(
        "aria-disabled",
        "true"
    );
    await expect(
        page
            .getByRole("alert")
            .filter({ hasText: "검색 결과를 불러오지 못했습니다." })
    ).toBeVisible();
    await expect(search).toHaveValue("noslog-state-check");
    fail = false;
    await region
        .getByRole("button", { name: "다시 시도", exact: true })
        .click();
    await expect(
        region.getByText("일치하는 악곡이 없습니다.", { exact: true })
    ).toBeVisible();
    await expect(search).toBeEnabled();
});

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} Discovery reflows from 320 to 1600 and meets WCAG AA`, async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== "mobile-chromium",
            "This matrix sets all target widths explicitly."
        );
        await page.goto(`/${locale}/music?view=grid`);
        await expect(page.locator("[data-result]")).toHaveCount(20);
        for (const [width, columns] of [
            [320, 2],
            [390, 2],
            [768, 4],
            [1024, 5],
            [1280, 4],
            [1600, 5],
        ]) {
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
                        .locator(".nl-discovery__items--grid")
                        .evaluate(
                            (element) =>
                                getComputedStyle(
                                    element
                                ).gridTemplateColumns.split(" ").length
                        )
                )
                .toBe(columns);
            await page.screenshot({
                path: testInfo.outputPath(`${locale}-${width}.png`),
                fullPage: true,
            });
        }
        const results = await new AxeBuilder({ page })
            .include(".nl-app")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(
            results.violations,
            JSON.stringify(
                results.violations.map(({ id, nodes }) => ({
                    id,
                    targets: nodes.map((node) => node.target),
                }))
            )
        ).toEqual([]);
    });
}

test("Chart scope groups published difficulty destinations and hides the Music view switch", async ({
    page,
    request,
}) => {
    const response = await request.get("/api/discovery?q=STULTI");
    const body = await response.json();
    const music = body.result.items[0];
    await page.route("**/api/discovery?**", (route) => {
        if (
            new URL(route.request().url()).searchParams.get("scope") !== "chart"
        )
            return route.continue();
        return route.fulfill({
            json: {
                isSuccess: true,
                code: "SUCCESS",
                message: "",
                result: {
                    items: [
                        {
                            ...music,
                            targets: [
                                { difficulty: "Expert", level: 12 },
                                { difficulty: "Real", level: 2 },
                            ],
                        },
                    ],
                    total: 1,
                    chartTotal: 2,
                    nextOffset: null,
                },
            },
        });
    });
    await page.goto("/ko/music");
    await page
        .getByRole("combobox", { name: "검색 범위", exact: true })
        .click();
    await page.getByRole("option", { name: "채보 검색", exact: true }).click();
    await expect(page.locator(".nl-chart-group")).toHaveCount(1);
    await expect(page.locator(".nl-chart-target")).toHaveCount(2);
    await expect(
        page.getByRole("radiogroup", { name: "보기 방식" })
    ).not.toBeVisible();
    await expect(page.locator(".nl-chart-target").first()).toHaveAttribute(
        "href",
        `/ko/music/${music.index}/expert/pattern`
    );
    await expect(page.locator(".nl-chart-target").last()).toHaveAttribute(
        "href",
        `/ko/music/${music.index}/real/pattern`
    );
    const audit = await new AxeBuilder({ page })
        .include(".nl-app")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
    expect(audit.violations).toEqual([]);
});

test("Incremental errors preserve loaded results and retry appends without duplicates", async ({
    page,
}) => {
    let fail = true;
    await page.route("**/api/discovery?**", (route) => {
        if (
            new URL(route.request().url()).searchParams.get("offset") ===
                "20" &&
            fail
        )
            return route.fulfill({
                status: 503,
                json: {
                    isSuccess: false,
                    code: "TEST_UNAVAILABLE",
                    message: "Unavailable",
                    result: null,
                },
            });
        return route.continue();
    });
    await page.goto("/ko/music");
    await page
        .getByRole("button", { name: "결과 20개 더 보기", exact: true })
        .click();
    await expect(
        page.getByText("다음 결과를 불러오지 못했습니다.", { exact: true })
    ).toBeVisible();
    await expect(page.locator("[data-result]")).toHaveCount(20);
    fail = false;
    await page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(page.locator("[data-result]")).toHaveCount(40);
    const links = await page
        .locator("[data-result] > a")
        .evaluateAll((elements) =>
            elements.map((element) => element.getAttribute("href"))
        );
    expect(new Set(links).size).toBe(40);
});
