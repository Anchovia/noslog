import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("P6 progress uses real dates, retains content on failure and supports keyboard values", async ({
    page,
}) => {
    let fail = false;
    await page.route("**/api/profiles/1/progress?**", async (route) => {
        if (fail)
            return route.fulfill({
                status: 503,
                json: {
                    isSuccess: false,
                    code: "TEST_FAILURE",
                    message: "Unavailable",
                    result: null,
                },
            });
        const query = Object.fromEntries(
            new URL(route.request().url()).searchParams
        );
        const base = query.metric === "rating" ? 2000 : 5000;
        await route.fulfill({
            json: {
                isSuccess: true,
                code: "OK",
                message: "",
                result: {
                    query,
                    status: "available",
                    current: base + 70,
                    points: [
                        { date: "2026-07-01T00:00:00.000Z", value: base },
                        { date: "2026-07-02T00:00:00.000Z", value: base + 10 },
                        { date: "2026-08-31T00:00:00.000Z", value: base + 70 },
                    ],
                },
            },
        });
    });
    await page.goto("/ko/profile/1");
    const progress = page.getByRole("region", {
        name: "성장 추이",
        exact: true,
    });
    await expect(progress.locator(".nl-line-chart__target")).toHaveCount(3);
    const target = progress.locator(".nl-line-chart__target").last();
    await target.focus();
    await target.press("Home");
    await expect(
        progress.locator(".nl-line-chart__target").first()
    ).toBeFocused();
    await expect(progress.getByRole("tooltip")).toContainText("5,000 Grd");
    await progress.locator(".nl-line-chart__target").first().press("End");
    await expect(target).toBeFocused();
    // Unequally spaced observation dates must not become equally spaced points.
    const x = await progress
        .locator(".nl-line-chart__target")
        .evaluateAll((nodes) =>
            nodes.map((node) =>
                Number.parseFloat((node as HTMLElement).style.left)
            )
        );
    expect(x[1] - x[0]).toBeLessThan((x[2] - x[0]) / 10);
    await progress
        .getByRole("button", { name: "NosLog 레이팅", exact: true })
        .click();
    await expect(progress.getByRole("table")).toContainText("2,070 pt");
    await progress.getByRole("combobox").selectOption("30");
    await expect(progress.getByRole("combobox")).toHaveValue("30");
    fail = true;
    await progress.getByRole("combobox").selectOption("year");
    await expect(progress.getByRole("alert")).toBeVisible();
    await expect(progress.getByRole("table")).toContainText("2,070 pt");
    await expect(progress.getByRole("combobox")).toHaveValue("30");
    fail = false;
    await progress
        .getByRole("button", { name: "다시 시도", exact: true })
        .click();
    await expect(progress.getByRole("alert")).toHaveCount(0);
    await expect(progress.getByRole("combobox")).toHaveValue("year");
});

test("P6 Best expands by five, retries the failed batch and collapses to five", async ({
    page,
}) => {
    let failNext = true;
    await page.route("**/api/profiles/1/plays?**", async (route) => {
        const url = new URL(route.request().url());
        if (url.searchParams.get("kind") !== "best") return route.continue();
        const offset = Number(url.searchParams.get("offset"));
        if (offset === 5 && failNext)
            return route.fulfill({
                status: 503,
                json: {
                    isSuccess: false,
                    code: "TEST_FAILURE",
                    message: "Unavailable",
                    result: null,
                },
            });
        const query = { ...Object.fromEntries(url.searchParams), offset };
        await route.fulfill({
            json: {
                isSuccess: true,
                code: "OK",
                message: "",
                result: {
                    query,
                    status: "available",
                    hasMore: offset < 10,
                    items: Array.from({ length: 5 }, (_, i) => ({
                        id: offset + i + 1,
                        musicIndex: "bfdaadfb98501907925ecf41a076108d",
                        title: `Profile fixture ${offset + i + 1}`,
                        background: null,
                        difficulty: "Expert",
                        level: 12,
                        score: 976654,
                        rank: "S",
                        fullCombo: i === 0,
                        contribution: 137,
                        playedAt: null,
                    })),
                },
            },
        });
    });
    await page.goto("/ko/profile/1");
    const best = page.getByRole("region", { name: "베스트 성과", exact: true });
    await expect(best.getByRole("link")).toHaveCount(5);
    await best.getByRole("button", { name: "더 보기", exact: true }).click();
    await expect(best.getByRole("alert")).toBeVisible();
    await expect(best.getByRole("link")).toHaveCount(5);
    failNext = false;
    await best.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(best.getByRole("link")).toHaveCount(10);
    await best.getByRole("button", { name: "접기", exact: true }).click();
    await expect(best.getByRole("link")).toHaveCount(5);
    await expect(best).toBeFocused();
    await page.getByRole("radio", { name: "Recital", exact: true }).click();
    await expect(best.getByRole("list")).toHaveAttribute(
        "aria-label",
        /Recital/
    );
    await expect(best.getByRole("link")).toHaveCount(5);
});

for (const locale of ["ko", "ja", "en"]) {
    test(`P6 ${locale} dark profile reflows at mobile, intermediate and desktop widths`, async ({
        page,
    }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/profile/1`);
        await expect(page.locator(".nl-profile-progress")).toBeVisible();
        for (const width of [320, 390, 768, 1000, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await expect
                .poll(() =>
                    page.evaluate(() => ({
                        width: innerWidth,
                        overflow: Math.max(
                            0,
                            document.documentElement.scrollWidth - innerWidth
                        ),
                    }))
                )
                .toEqual({ width, overflow: 0 });
            await expect(page.locator("html")).toHaveAttribute(
                "data-theme",
                "dark"
            );
            const profile = await page.locator(".nl-profile").boundingBox();
            expect(profile!.width).toBeLessThanOrEqual(1000);
        }
        const audit = await new AxeBuilder({ page }).include("main").analyze();
        expect(audit.violations).toEqual([]);
        expect(errors).toEqual([]);
    });
}
