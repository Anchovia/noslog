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
    variant: "data" | "empty" | "single" | "guest" | "partial" | "peer" = "data"
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
            peerScoreComparison:
                variant === "peer"
                    ? {
                          averageScore: 970000,
                          sampleCount: 12,
                          gradeRange: 200,
                          judgement: {
                              averages: {
                                  judge_sjust: 85,
                                  judge_just: 12,
                                  judge_good: 1,
                                  judge_miss: 1,
                                  judge_near: 1,
                              },
                              sampleCount: 10,
                          },
                          noteRates: {
                              averages: {
                                  note_rate_standard: 9700,
                                  note_rate_tenuto: 9800,
                                  note_rate_glissando: 9600,
                                  note_rate_trill: null,
                              },
                              sampleCounts: {
                                  note_rate_standard: 12,
                                  note_rate_tenuto: 11,
                                  note_rate_glissando: 10,
                                  note_rate_trill: 4,
                              },
                          },
                      }
                    : null,
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

test("Peer comparison is always visible and omits unavailable averages", async ({
    page,
}) => {
    await openRecord(page, "ko", "peer");
    // 켜기 없이 늘 보인다(2026-09-16 A) — 기준 인원은 판정 소제목 줄 오른쪽
    await expect(
        page.locator(".nl-record-analysis").getByRole("checkbox")
    ).toHaveCount(0);
    await expect(
        page
            .locator(".nl-record-analysis .nl-heading-row")
            .getByText("유사 Grd 10명 기준", { exact: true })
    ).toBeVisible();
    const analysis = page.locator(".nl-record-analysis");
    // 나 · 평균 누적 막대 두 줄 (2026-09-16 A)
    await expect(analysis.locator(".nl-stacked-bar__row")).toHaveCount(2);
    await expect(analysis).toContainText("평균 85%");
    await expect(analysis).toContainText("평균 97%");
    // 평균이 없는 항목(트릴)은 평균 줄 자체가 없다
    await expect(analysis.getByText("평균 —")).toHaveCount(0);
});

test("Record preserves primary order and exposes exact values to keyboard and touch", async ({
    page,
}) => {
    await openRecord(page);
    // 제목 한 줄(넘치면 끝 페이드) · 글자 끝 8 뒤 내 등급 아이콘 = 제목 줄 높이(32 · 1056 이상 40) (2026-09-18)
    const grade = page.locator(".nl-music-entity__grade");
    await expect(grade).toHaveAttribute("alt", "S 랭크");
    await expect(grade).toHaveCSS(
        "width",
        (page.viewportSize()?.width ?? 390) >= 1056 ? "40px" : "32px"
    );
    await expect(page.locator(".nl-music-entity__title")).toHaveCSS(
        "white-space",
        "nowrap"
    );
    await expect
        .poll(() =>
            grade.evaluate((element) => {
                const title = element.parentElement!.querySelector("h1")!;
                const box = element.getBoundingClientRect();
                const titleBox = title.getBoundingClientRect();
                return {
                    gap: Math.round(box.x - titleBox.right),
                    centered:
                        Math.abs(
                            box.y +
                                box.height / 2 -
                                (titleBox.y + titleBox.height / 2)
                        ) < 1,
                };
            })
        )
        .toEqual({ gap: 8, centered: true });
    // 수치 상자 맨 위 「그레이드」 줄 — 내 Grd / 최대 Grd(모르면 —) + 진행 막대, 점수 · 메달 없음 (2026-09-18 Q3)
    const gradeRow = page.getByRole("group", { name: "그레이드" });
    await expect(gradeRow.getByRole("img")).toHaveCount(0);
    await expect(gradeRow).not.toContainText("976,654");
    await expect(gradeRow.locator(".nl-my-best__grd")).toHaveText(
        /^132\.34\/ (\d+\.\d{2}|—)$/
    );
    await expect(gradeRow.locator(".nl-grade-progress")).toHaveCSS(
        "height",
        "8px"
    );
    await expect(page.locator(".nl-record-panel h2")).toHaveText([
        "최고 기록",
        "누적 요약",
    ]);
    // 판정 분석이 맨 위 · 기본 펼침, 성장 추이 · 최근 플레이는 기본 접힘 (2026-09-17)
    await expect(
        page.locator(".nl-record-disclosures > details").first()
    ).toHaveClass(/nl-record-analysis/);
    await expect(page.locator(".nl-record-progress")).not.toHaveAttribute(
        "open"
    );
    await expect(page.locator(".nl-record-recent")).not.toHaveAttribute("open");
    await expect(page.locator(".nl-record-panel")).toHaveCSS("gap", "32px");
    await expect(page.locator(".nl-record-analysis")).toHaveAttribute("open");
    // 최고 기록 띠 — 최대 콤보는 「1,204x」 (2026-09-17)
    await expect(
        page.locator(".nl-record-panel .nl-stat-strip").first()
    ).toContainText("1,204x");
    await page.locator(".nl-record-progress > summary").click();
    const chart = page.getByRole("figure", {
        name: "최고 점수",
        exact: true,
    });
    await expect(chart.getByRole("row")).toHaveCount(4);
    // 날짜 · 최고 점수 표는 그래프와 중복이라 화면에서 숨김(화면 읽기용)
    await expect(
        chart.locator(".nl-chart-table").locator("xpath=..")
    ).toHaveClass(/sr-only/);
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
    await page.locator(".nl-record-recent > summary").click();
    await page.locator(".nl-recent-play").first().click();
    await expect(
        page.locator(".nl-recent-play__details").first()
    ).toContainText("타이밍 편향FAST +6");
    // 비교할 기록이 없으면 기준 인원 · 평균 줄 없음, 평균 막대는 회색 한 줄 (2026-09-16)
    const bars = page.locator(".nl-record-analysis .nl-stacked-bar__row");
    await expect(bars).toHaveCount(2);
    await expect(bars.nth(1).locator(".nl-stacked-bar__segment")).toHaveCount(
        1
    );
    await expect(page.getByText(/유사 Grd .*기준/)).toHaveCount(0);
    await expect(
        page.locator(".nl-record-analysis").getByText(/^평균 /)
    ).toHaveCount(0);
    await page.getByRole("radio", { name: "FAST/SLOW", exact: true }).click();
    const timing = page.getByRole("figure", { name: "FAST/SLOW", exact: true });
    // 최근 판정 추이 표도 화면 읽기용으로만 (2026-09-16)
    await expect(
        timing.locator(".nl-chart-table").locator("xpath=..")
    ).toHaveClass(/sr-only/);
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
            // 기록이 없어도 다섯 구역 틀 그대로, 내 값 자리만 「—」 (E1, 2026-09-19)
            await expect(
                page.getByText("등록된 기록이 없습니다.", { exact: true })
            ).toHaveCount(0);
            await expect(
                page
                    .locator(".nl-record-panel .nl-stat-strip__value")
                    .filter({ hasText: /^—$/ })
            ).toHaveCount(6);
            await expect(page.locator(".nl-record-analysis")).toBeVisible();
            // 기록이 없으면 그레이드 줄은 「—」, 제목 옆 등급 아이콘 없음
            await expect(
                page.getByRole("group", { name: "그레이드" })
            ).toContainText("—");
            await expect(page.locator(".nl-music-entity__grade")).toHaveCount(
                0
            );
        } else if (variant === "single") {
            await page.locator(".nl-record-progress > summary").click();
            const chart = page.getByRole("figure", {
                name: "최고 점수",
                exact: true,
            });
            // 한 건이어도 틀 · 축 · 표는 그대로, 점 하나만 가운데 — 설명 문장 없음 (2026-09-16)
            await expect(chart.locator(".nl-line-chart__series")).toBeVisible();
            await expect(chart.locator("circle")).toHaveCount(1);
            await expect(chart.locator(".nl-line-chart__target")).toHaveCount(
                1
            );
            await expect(chart.getByText(/추이를 그리지 않습니다/)).toHaveCount(
                0
            );
            await expect(chart.getByRole("row")).toHaveCount(2);
        } else if (variant === "guest") {
            await expect(
                page.getByText("로그인 후 내 기록을 확인할 수 있습니다.")
            ).toBeVisible();
            await expect(
                page.locator(".nl-record-state").getByRole("link")
            ).toHaveAttribute("href", /returnTo=.*tab%3Drecord/);
        } else {
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
        for (const width of [320, 390, 768, 1024, 1055, 1056, 1280, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await expect
                .poll(() =>
                    page
                        .locator(".nl-record-panel > .nl-detail-columns")
                        .first()
                        .evaluate(
                            (element) =>
                                getComputedStyle(
                                    element
                                ).gridTemplateColumns.split(" ").length
                        )
                )
                .toBe(width >= 1056 ? 2 : 1);
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
