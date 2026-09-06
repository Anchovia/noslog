import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";

const musicPath = "/music/bfdaadfb98501907925ecf41a076108d/expert";
const counts = {
    judge_sjust: 1210,
    judge_just: 188,
    judge_good: 12,
    judge_miss: 6,
    judge_near: 4,
};
const userRecord: NonNullable<MusicDetailProps["userPlayData"]> = {
    user_id: 999,
    user: {
        id: 999,
        username: "UI fixture",
        avatar: null,
        grade_basic: 600000,
    },
    rank: "S",
    fc_type: 2,
    grade_basic: 13234,
    grade_recital: 0,
    level: 12,
    score: 976654,
    max_combo: 1204,
    play_count: 128,
    clear_count: 128,
    fullcombo_count: 12,
    pianistic_count: 3,
    ...counts,
    note_rate_standard: 9812,
    note_rate_tenuto: 9934,
    note_rate_glissando: 9742,
    note_rate_trill: 9560,
    besttime: "2026-08-11 21:04",
};
const scoreTrend = [962880, 971220, 976654].map((score, index) => ({
    id: index + 1,
    score,
    rank: "S",
    play_time: ["2026-05-14", "2026-07-02", "2026-08-11"][index],
}));
const recentChartPlays = scoreTrend.map((point, index) => ({
    ...point,
    best_score: 976654,
    max_combo: 1204,
    grade_basic: 13234,
    class_basic: "6級",
    fast_count: 12 + index,
    slow_count: 8,
    ...counts,
    play_time: `${point.play_time} 21:04`,
}));

// Browser response fixtures exercise private UI states without forging a login or writing account data.
async function openRecord(
    page: Page,
    locale = "ko",
    variant: "data" | "empty" | "single" | "guest" | "partial" = "data"
) {
    await page.route("**/api/music-detail?**", async (route) => {
        const response = await route.fetch();
        const body = await response.json();
        const result: MusicDetailProps = {
            ...body.result,
            isLoggedIn: variant !== "guest",
            userPlayData:
                variant === "empty" || variant === "guest"
                    ? null
                    : variant === "partial"
                      ? {
                            ...userRecord,
                            judge_good: null,
                            note_rate_trill: null,
                        }
                      : userRecord,
            scoreTrend:
                variant === "single" ? scoreTrend.slice(-1) : scoreTrend,
            recentChartPlays,
            performanceTrend: recentChartPlays,
            peerScoreComparison: null,
        };
        await route.fulfill({ json: { ...body, result } });
    });
    await page.goto(`/${locale}${musicPath}`);
    const picker = page.getByRole("combobox");
    if ((page.viewportSize()?.width ?? 390) < 768) {
        await picker.click();
        await page
            .getByRole("option", {
                name:
                    locale === "ko"
                        ? "내 기록"
                        : locale === "ja"
                          ? "プレー記録"
                          : "My Record",
                exact: true,
            })
            .click();
    } else {
        await page.getByRole("tab").nth(1).click();
    }
    await expect(page).toHaveURL(/tab=record/);
}

test("Record preserves primary order and exposes exact values to keyboard and touch", async ({
    page,
}) => {
    await openRecord(page);
    await expect(page.locator(".nl-record-panel h2")).toHaveText([
        "베스트 기록",
        "누적 요약",
        "성장 추이",
        "최근 플레이",
    ]);
    await expect(page.locator(".nl-record-panel")).toHaveCSS("gap", "32px");
    await expect(page.locator(".nl-record-analysis")).not.toHaveAttribute(
        "open"
    );
    await expect(page.locator(".nl-record-metrics")).toHaveText(
        "플레이 횟수128회최대 콤보1,204풀콤보12회Pianist3회"
    );
    const chart = page.getByRole("figure", {
        name: "베스트 스코어",
        exact: true,
    });
    await expect(chart.getByRole("row")).toHaveCount(4);
    const latest = chart.getByRole("button").last();
    await latest.focus();
    await expect(chart.getByRole("tooltip")).toContainText("976,654점");
    await latest.press("Home");
    await expect(chart.getByRole("button").first()).toBeFocused();
    await expect(chart.getByRole("tooltip")).toContainText("962,880점");
    await page.keyboard.press("ArrowRight");
    await expect(chart.getByRole("button").nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(latest).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(chart.getByRole("tooltip")).toHaveCount(0);
    await chart.getByRole("button").first().click();
    await expect(chart.getByRole("tooltip")).toContainText("962,880점");
    await page.locator(".nl-recent-play").first().click();
    await expect(
        page.locator(".nl-recent-play__details").first()
    ).toContainText("타이밍 편향FAST +6");
    await page.locator(".nl-record-analysis > summary").click();
    await expect(page.getByRole("checkbox")).not.toBeChecked();
    await page.getByRole("checkbox").check();
    await expect(
        page.getByText("비교할 수 있는 유사 Grd 기록이 5명 미만입니다.")
    ).toBeVisible();
    await page.getByRole("radio", { name: "FAST/SLOW", exact: true }).click();
    const timing = page.getByRole("figure", { name: "FAST/SLOW", exact: true });
    await expect(timing.getByRole("columnheader")).toHaveText([
        "날짜",
        "FAST",
        "SLOW",
    ]);
    await expect(timing.locator('circle[data-series="fast"]')).toHaveCount(3);
    await expect(timing.locator('rect[data-series="slow"]')).toHaveCount(3);
    await timing.getByRole("button").last().focus();
    await expect(timing.getByRole("tooltip")).toContainText(
        "FAST · 14SLOW · 8"
    );
});

for (const variant of ["empty", "single", "guest", "partial"] as const) {
    test(`Record ${variant} state retains its meaning`, async ({ page }) => {
        await openRecord(page, "ko", variant);
        if (variant === "empty") {
            await expect(
                page.getByText("등록된 기록이 없습니다.", { exact: true })
            ).toBeVisible();
            await expect(page.locator(".nl-record-metrics")).toHaveCount(0);
        } else if (variant === "single") {
            const chart = page.getByRole("figure", {
                name: "베스트 스코어",
                exact: true,
            });
            await expect(
                chart.getByText("기록이 1건이라 추이를 그리지 않습니다.")
            ).toBeVisible();
            await expect(chart.locator("polyline")).toHaveCount(0);
            await expect(chart.getByRole("row")).toHaveCount(2);
        } else if (variant === "guest") {
            await expect(
                page.getByText("로그인 후 내 기록을 확인할 수 있습니다.")
            ).toBeVisible();
            await expect(
                page.locator(".nl-record-state").getByRole("link")
            ).toHaveAttribute("href", /returnTo=.*tab%3Drecord/);
        } else {
            await page.locator(".nl-record-analysis > summary").click();
            await expect(
                page.getByText(
                    "전체 기록을 다시 연동하면 상세 판정을 확인할 수 있습니다."
                )
            ).toBeVisible();
            await expect(
                page.locator(".nl-analysis-values").first()
            ).toContainText("1,210—");
            await expect(
                page.locator(".nl-analysis-values").nth(1)
            ).toContainText("트릴—");
        }
    });
}

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} record matches responsive geometry and has no accessibility violations`, async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== "mobile-chromium",
            "Explicit width matrix is run once."
        );
        await openRecord(page, locale);
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
            await expect(
                page.locator(".nl-record-analysis > summary")
            ).toHaveCSS("min-height", "52px");
            await page.screenshot({
                path: testInfo.outputPath(`${locale}-record-${width}.png`),
                fullPage: true,
            });
        }
        await page.locator(".nl-record-analysis > summary").click();
        for (const width of [320, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            await page
                .getByRole("radio", { name: "FAST/SLOW", exact: true })
                .click();
            await expect
                .poll(() =>
                    page.evaluate(
                        () =>
                            document.documentElement.scrollWidth <=
                            document.documentElement.clientWidth
                    )
                )
                .toBe(true);
            const result = await new AxeBuilder({ page })
                .include(".nl-app")
                .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
                .analyze();
            expect(
                result.violations,
                JSON.stringify(
                    result.violations.map(({ id, nodes }) => ({
                        id,
                        nodes: nodes.map((n) => n.target),
                    }))
                )
            ).toEqual([]);
        }
    });
}
