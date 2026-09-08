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
    for (const width of [1055, 1056, 1470, 1055, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(progress.getByRole("combobox")).toHaveValue("30");
        await expect(progress.getByRole("table")).toContainText("2,070 pt");
    }
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
    for (const width of [1055, 1056, 1470, 1055, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(best.getByRole("link")).toHaveCount(10);
    }
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
        for (const width of [
            320, 390, 671, 672, 768, 1000, 1055, 1056, 1280, 1470, 1056, 1055,
            390,
        ]) {
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
            const avatar = await page
                .locator(".nl-profile-identity__avatar")
                .boundingBox();
            expect(avatar!.width).toBe(width >= 1056 ? 108 : 64);
            expect(avatar!.height).toBe(avatar!.width);
            const progress = (await page
                .locator(".nl-profile-progress")
                .boundingBox())!;
            const overview = (await page
                .locator(".nl-profile-overview")
                .boundingBox())!;
            const best = (await page
                .locator('.nl-profile-plays[data-kind="best"]')
                .boundingBox())!;
            const recent = (await page
                .locator('.nl-profile-plays[data-kind="recent"]')
                .boundingBox())!;
            if (width >= 1056) {
                const heading = (await page
                    .locator("#profile-progress-title")
                    .boundingBox())!;
                const controls = (await page
                    .locator(".nl-profile-progress__controls")
                    .boundingBox())!;
                expect(heading.y + heading.height / 2).toBeCloseTo(
                    controls.y + controls.height / 2,
                    0
                );
                expect(heading.x + heading.width).toBeLessThanOrEqual(
                    controls.x
                );
                expect(progress.y).toBeCloseTo(overview.y, 0);
                expect(best.y).toBeCloseTo(recent.y, 0);
                expect(progress.width / overview.width).toBeCloseTo(2, 2);
                expect(overview.x - progress.x - progress.width).toBeCloseTo(
                    16,
                    0
                );
                expect(best.x).toBeCloseTo(progress.x, 0);
                expect(recent.x).toBeCloseTo(overview.x, 0);
                expect(best.y - progress.y - progress.height).toBeCloseTo(
                    48,
                    0
                );
            } else {
                const heading = (await page
                    .locator("#profile-progress-title")
                    .boundingBox())!;
                const controls = (await page
                    .locator(".nl-profile-progress__controls")
                    .boundingBox())!;
                expect(controls.y).toBeGreaterThanOrEqual(
                    heading.y + heading.height
                );
                expect(progress.x).toBeCloseTo(overview.x, 0);
                expect(progress.width).toBeCloseTo(overview.width, 0);
                expect(best.y).toBeGreaterThan(progress.y);
                expect(overview.y).toBeGreaterThan(best.y);
                expect(recent.y).toBeGreaterThan(overview.y);
            }
            const colors = {
                sjust: "rgb(255, 141, 204)",
                just: "rgb(255, 202, 22)",
                good: "rgb(76, 204, 230)",
                near: "rgb(112, 184, 255)",
                miss: "rgb(180, 180, 180)",
            };
            for (const [judgement, color] of Object.entries(colors)) {
                await expect(
                    page.locator(
                        `.nl-profile-judgement-stack > [data-judgement="${judgement}"]`
                    )
                ).toHaveCSS("background-color", color);
                await expect(
                    page.locator(
                        `.nl-profile-judgements [data-judgement="${judgement}"] i`
                    )
                ).toHaveCSS("background-color", color);
            }
            if ([390, 1056, 1280].includes(width)) {
                await page.screenshot({
                    path: test.info().outputPath(`p6-${locale}-${width}.png`),
                    fullPage: true,
                });
            }
        }
        const audit = await new AxeBuilder({ page }).include("main").analyze();
        expect(audit.violations).toEqual([]);
        expect(errors).toEqual([]);
    });
}
