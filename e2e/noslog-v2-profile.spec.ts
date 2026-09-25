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
    // 지표 전환 = 세그먼트(2026-09-25 G2, 짧은 라벨)
    await progress.getByRole("radio", { name: "레이팅", exact: true }).click();
    await expect(progress.getByRole("table")).toContainText("2,070 pt");
    // 기간 = 공용 셀렉트(Radix 콤보박스) — 열고 항목을 고른다
    const range = progress.getByRole("combobox");
    const choose = async (label: string) => {
        await range.click();
        await page.getByRole("option", { name: label, exact: true }).click();
    };
    await choose("30일");
    await expect(range).toHaveText("30일");
    for (const width of [1055, 1056, 1470, 1055, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(range).toHaveText("30일");
        await expect(progress.getByRole("table")).toContainText("2,070 pt");
    }
    fail = true;
    await choose("1년");
    await expect(progress.getByRole("alert")).toBeVisible();
    await expect(progress.getByRole("table")).toContainText("2,070 pt");
    await expect(range).toHaveText("30일");
    fail = false;
    await progress
        .getByRole("button", { name: "다시 시도", exact: true })
        .click();
    await expect(progress.getByRole("alert")).toHaveCount(0);
    await expect(range).toHaveText("1년");
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
    await expect(best.getByRole("list").getByRole("link")).toHaveCount(5);
    await best.getByRole("button", { name: "더 보기", exact: true }).click();
    await expect(best.getByRole("alert")).toBeVisible();
    await expect(best.getByRole("list").getByRole("link")).toHaveCount(5);
    failNext = false;
    await best.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(best.getByRole("list").getByRole("link")).toHaveCount(10);
    for (const width of [1055, 1056, 1470, 1055, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(best.getByRole("list").getByRole("link")).toHaveCount(10);
    }
    await best.getByRole("button", { name: "접기", exact: true }).click();
    await expect(best.getByRole("list").getByRole("link")).toHaveCount(5);
    await expect(best).toBeFocused();
    await page.getByRole("radio", { name: "Recital", exact: true }).click();
    await expect(best.getByRole("list")).toHaveAttribute(
        "aria-label",
        /Recital/
    );
    await expect(best.getByRole("list").getByRole("link")).toHaveCount(5);
});

for (const locale of ["ko", "ja", "en"]) {
    test(`P6 ${locale} dark profile reflows at mobile, intermediate and desktop widths`, async ({
        page,
    }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/profile/1`);
        // 로딩 스켈레톤(aria-busy)과 실제 내용이 잠깐 함께 있을 수 있다 — 실제 본문을 기다린다
        await expect(
            page.locator(
                '.nl-profile-body:not([aria-busy="true"]) .nl-profile-progress'
            )
        ).toBeVisible();
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
            expect(profile!.width).toBeLessThanOrEqual(1200);
            const avatar = await page
                .locator(".nl-profile-identity__avatar")
                .boundingBox();
            expect(avatar!.width).toBe(width >= 1056 ? 108 : 64);
            expect(avatar!.height).toBe(avatar!.width);
            const progress = (await page
                .locator(".nl-profile-progress")
                .boundingBox())!;
            // 옆 열 첫 구역 = 고정 기록(있으면, 2026-09-26 S2) 또는 레벨별 달성 요약(R2)
            const overview = (await page
                .locator(".nl-profile-body .nl-profile-side > section")
                .first()
                .boundingBox())!;
            const best = (await page
                .locator('.nl-profile-plays[data-kind="best"]')
                .boundingBox())!;
            // 최근 플레이는 플레이 활동을 공개할 때만 있다(E2E_RANKER 는 비공개일 수 있음)
            const recentSection = page.locator(
                '.nl-profile-plays[data-kind="recent"]'
            );
            const recent = (await recentSection.count())
                ? await recentSection.boundingBox()
                : null;
            const heading = (await page
                .locator("#profile-progress-title")
                .boundingBox())!;
            const controls = (await page
                .locator(".nl-profile-progress__controls")
                .boundingBox())!;
            if (width >= 1056) {
                // 2 : 1 — 주 열(성장 추이 · 베스트 · 최근) | 옆 열(레벨별 달성 …), 제목과 조작부는 위쪽을 맞춤(2026-09-25 D2)
                expect(heading.x + heading.width).toBeLessThanOrEqual(
                    controls.x
                );
                expect(controls.y).toBeLessThan(heading.y + heading.height);
                expect(progress.y).toBeCloseTo(overview.y, 0);
                expect(progress.width / overview.width).toBeCloseTo(2, 2);
                expect(overview.x - progress.x - progress.width).toBeCloseTo(
                    16,
                    0
                );
                expect(best.x).toBeCloseTo(progress.x, 0);
                if (recent) expect(recent.x).toBeCloseTo(progress.x, 0);
                expect(best.y - progress.y - progress.height).toBeCloseTo(
                    32,
                    0
                );
                if (recent) expect(recent.y).toBeGreaterThan(best.y);
            } else if (width >= 672) {
                // 태블릿 — 성장 추이 → 베스트 → 최근, 그 아래 레벨별 달성 | 업적 · 기여 두 칸
                expect(controls.y).toBeGreaterThanOrEqual(
                    heading.y + heading.height
                );
                expect(best.y).toBeGreaterThan(progress.y);
                expect(overview.y).toBeGreaterThan((recent ?? best).y);
                expect(overview.x).toBeCloseTo(progress.x, 0);
                expect(overview.width).toBeCloseTo(
                    (progress.width - 16) / 2,
                    0
                );
            } else {
                // 폰(F2) — 베스트 → 최근 → 성장 추이 → 레벨별 달성
                expect(controls.y).toBeGreaterThanOrEqual(
                    heading.y + heading.height
                );
                expect(progress.y).toBeGreaterThan((recent ?? best).y);
                expect(overview.y).toBeGreaterThan(progress.y);
                expect(progress.width).toBeCloseTo(overview.width, 0);
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
        // 「통계」 탭(2026-09-26) — 판정 색 · 배치(폰 한 줄 · 태블릿 판정 | 랭크 · 넓은 화면 성장 추이 2 | 레벨별 달성 1)
        await page.goto(`/${locale}/profile/1/stats`);
        await expect(
            page.locator(".nl-profile-stats .nl-profile-levels")
        ).toBeVisible();
        const colors = {
            sjust: "rgb(255, 141, 204)",
            just: "rgb(255, 202, 22)",
            good: "rgb(76, 204, 230)",
            near: "rgb(112, 184, 255)",
            miss: "rgb(180, 180, 180)",
        };
        // 판정 값이 없는 플레이어(시드 E2E_RANKER)는 판정 막대가 없다
        const judged =
            (await page.locator(".nl-profile-judgement-stack").count()) > 0;
        for (const [judgement, color] of judged ? Object.entries(colors) : []) {
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
        for (const width of [390, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            const box = async (name: string) =>
                (await page
                    .locator(`.nl-profile-stats > .nl-profile-${name}`)
                    .boundingBox())!;
            const [levels, progress, judgement, ranks] = await Promise.all(
                ["levels", "progress", "judgement", "ranks"].map(box)
            );
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth - innerWidth
                )
            ).toBeLessThanOrEqual(0);
            if (width >= 1056) {
                expect(levels.y).toBeCloseTo(progress.y, 0);
                expect(progress.width / levels.width).toBeGreaterThan(1.9);
                expect(judgement.y).toBeCloseTo(ranks.y, 0);
            } else if (width >= 672) {
                expect(progress.y).toBeGreaterThan(levels.y);
                expect(judgement.y).toBeCloseTo(ranks.y, 0);
                expect(ranks.x).toBeGreaterThan(judgement.x);
            } else {
                expect(progress.y).toBeGreaterThan(levels.y);
                expect(ranks.y).toBeGreaterThan(judgement.y);
            }
        }
        // 누적 막대 줄들은 라벨 폭이 달라도 막대 시작이 같다(subgrid)
        const starts = await page
            .locator(".nl-profile-levels .nl-stacked-bar__track")
            .evaluateAll((nodes) =>
                nodes.map((node) => Math.round(node.getBoundingClientRect().x))
            );
        expect(new Set(starts).size).toBe(1);
        const statsAudit = await new AxeBuilder({ page })
            .include("main")
            .analyze();
        expect(statsAudit.violations).toEqual([]);
        expect(errors).toEqual([]);
    });
}

test("profile activity tab shows a year calendar that starts at today's end and plays one row each", async ({
    page,
}) => {
    await page.goto("/ko/profile/1/activity");
    const hidden = await page
        .getByText("이 플레이어는 플레이 활동을 공개하지 않습니다.")
        .count();
    if (hidden) {
        // 활동 비공개 시드 — 탭이 없고 주소로 들어오면 잠금 한 줄
        await expect(
            page.getByRole("link", { name: "활동", exact: true })
        ).toHaveCount(0);
        return;
    }
    await expect(
        page.locator('nav.nl-tabs--primary [aria-current="page"]')
    ).toHaveText("활동");
    const cells = page.locator(
        ".nl-profile-calendar__grid .nl-profile-calendar__cell"
    );
    expect(await cells.count()).toBeGreaterThan(52 * 7);
    for (const width of [390, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.reload();
        const scroller = page.locator(".nl-profile-calendar__scroller");
        const { client, scroll, left } = await scroller.evaluate((node) => ({
            client: node.clientWidth,
            scroll: node.scrollWidth,
            left: node.scrollLeft,
        }));
        // 처음에는 오늘 쪽 끝 — 넘치면 오른쪽 끝까지 밀려 있다(rtl 스크롤 칸이라 scrollLeft 는 0 이하)
        expect(Math.abs(left)).toBeLessThanOrEqual(1);
        const last = await cells.last().boundingBox();
        expect(last!.x + last!.width).toBeLessThanOrEqual(width);
        expect(scroll).toBeGreaterThanOrEqual(client);
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth - innerWidth
            )
        ).toBeLessThanOrEqual(0);
        // 업적 · 활동 탭은 모드 세그먼트가 없다
        await expect(page.locator(".nl-profile-identity__mode")).toHaveCount(0);
    }
    const audit = await new AxeBuilder({ page }).include("main").analyze();
    expect(audit.violations).toEqual([]);
});
