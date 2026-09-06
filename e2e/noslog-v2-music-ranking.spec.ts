import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const musicPath = "/music/bfdaadfb98501907925ecf41a076108d/expert";
const names = [
    "PLAYER-01",
    "노스탤지어",
    "ピアノ奏者の長い名前",
    "PLAYER-WITH-A-LONG-NAME",
];

async function openRanking(
    page: Page,
    {
        locale = "ko",
        total = 53,
        signedIn = false,
        ownRank = 37,
        failSecond = false,
    }: {
        locale?: string;
        total?: number;
        signedIn?: boolean;
        ownRank?: number | null;
        failSecond?: boolean;
    } = {}
) {
    let failed = false;
    await page.route("**/api/music-detail?**", async (route) => {
        const requestedPage = Number(
            new URL(route.request().url()).searchParams.get("page")
        );
        if (failSecond && requestedPage === 2 && !failed) {
            failed = true;
            await route.fulfill({
                status: 503,
                json: {
                    isSuccess: false,
                    code: "TEST_FAILURE",
                    message: "Unavailable",
                    result: null,
                },
            });
            return;
        }
        const response = await route.fetch();
        const body = await response.json();
        const current =
            requestedPage > 0 && requestedPage <= Math.ceil(total / 25)
                ? requestedPage
                : 1;
        const rows = Array.from(
            { length: Math.max(0, Math.min(25, total - (current - 1) * 25)) },
            (_, i) => {
                const position = (current - 1) * 25 + i + 1;
                return {
                    position,
                    user_id: 1000 + position,
                    rank: position === 1 ? "P" : "S",
                    score: 1_000_000 - (position - 1) * 500,
                    fc_type: position === 1 ? 3 : position % 2 === 0 ? 2 : 0,
                    user: {
                        id: 1000 + position,
                        username: names[(position - 1) % names.length],
                        avatar: null,
                    },
                };
            }
        );
        await route.fulfill({
            json: {
                ...body,
                result: {
                    ...body.result,
                    isLoggedIn: signedIn,
                    userPlayData:
                        signedIn && ownRank
                            ? {
                                  user_id: 1000 + ownRank,
                                  rank: "S",
                                  score: 1_000_000 - (ownRank - 1) * 500,
                                  fc_type: 2,
                              }
                            : null,
                    ranking: {
                        rows,
                        page: current,
                        pageSize: 25,
                        totalCount: total,
                        userRank: ownRank,
                    },
                    chartDetail: {
                        ...body.result.chartDetail,
                        playerCount: total,
                        scoreDistribution: [
                            "950k",
                            "960k",
                            "970k",
                            "980k",
                            "990k",
                            "Pianist",
                        ].map((label, index) => ({
                            key: label,
                            label,
                            count: [9, 7, 6, 4, 3, 1][index],
                        })),
                    },
                },
            },
        });
    });
    await page.goto(`/${locale}${musicPath}`);
    if ((page.viewportSize()?.width ?? 390) < 768) {
        await page.getByRole("combobox").click();
        await page
            .getByRole("option", {
                name:
                    locale === "ko"
                        ? "랭킹"
                        : locale === "ja"
                          ? "ランキング"
                          : "Ranking",
                exact: true,
            })
            .click();
    } else await page.getByRole("tab").nth(2).click();
    await expect(page).toHaveURL(/tab=ranking/);
    await expect(
        page.locator(total ? ".nl-chart-leaderboard" : ".nl-area__panel")
    ).toBeVisible();
}

test("Public ranking keeps 25 rows, fixed columns, Pianist/FC meaning and explicit page navigation", async ({
    page,
}) => {
    await openRanking(page);
    const table = page.locator(".nl-chart-leaderboard");
    await expect(table.locator("tbody tr")).toHaveCount(25);
    await expect(page.locator(".nl-score-distribution__count")).toHaveText([
        "9",
        "7",
        "6",
        "4",
        "3",
        "1",
    ]);
    await expect(
        page.getByRole("table", { name: "S 이상 · 30명", exact: true })
    ).toHaveCount(1);
    await expect(page.getByText("참가자 53명")).toBeVisible();
    await expect(
        table.locator("tbody tr").first().getByRole("img", { name: "P 랭크" })
    ).toBeVisible();
    await expect(
        table.locator("tbody tr").first().locator(".nl-full-combo")
    ).toHaveText("FC");
    await expect(
        table.locator("tbody tr").first().locator("td:nth-child(5)")
    ).toHaveCSS("height", "20px");
    await expect(
        table.locator("tbody tr").nth(1).locator(".nl-full-combo")
    ).toHaveText("FC");
    await expect(page.locator(".nl-ranking-login")).toBeVisible();
    await page
        .getByRole("button", { name: "다음 페이지", exact: true })
        .click();
    await expect(page).toHaveURL(/tab=ranking&page=2/);
    await expect(
        table.locator("tbody tr").first().locator("td").first()
    ).toHaveText("26");
    await expect(page.locator(".nl-ranking-list")).toBeFocused();
    await expect(page.locator(".nl-ranking-list [role=status]")).toHaveText(
        "전체 53명 중 26–50번째 기록"
    );
    await page
        .getByRole("button", { name: "다음 페이지", exact: true })
        .click();
    await expect(table.locator("tbody tr")).toHaveCount(3);
    await expect(
        page.getByRole("button", { name: "다음 페이지", exact: true })
    ).toBeDisabled();
    await page.goBack();
    await expect(table.locator("tbody tr")).toHaveCount(25);
    await expect(
        page.getByRole("button", { name: "2페이지", exact: true })
    ).toHaveAttribute("aria-current", "page");
});

test("My rank summary disappears when the current user's row is on the page", async ({
    page,
}) => {
    await openRanking(page, { signedIn: true });
    await expect(page.locator(".nl-my-rank-summary")).toContainText("37 / 53");
    await page
        .getByRole("button", { name: "다음 페이지", exact: true })
        .click();
    await expect(page.locator(".nl-my-rank-summary")).toHaveCount(0);
    await expect(page.locator('tr[data-current="true"]')).toHaveCount(1);
    await expect(
        page.locator('tr[data-current="true"] .nl-my-rank-badge')
    ).toHaveText("내 순위");
    await expect(page.locator('tr[data-current="true"] a')).toHaveAttribute(
        "href",
        "/ko/profile/1037"
    );
});

test("A failed page request offers retry and never presents stale rows as current", async ({
    page,
}) => {
    await openRanking(page, { failSecond: true });
    await page
        .getByRole("button", { name: "다음 페이지", exact: true })
        .click();
    await expect(
        page
            .getByRole("alert")
            .filter({ hasText: "악곡 정보를 불러오지 못했습니다." })
    ).toBeVisible();
    await expect(page.locator(".nl-chart-leaderboard")).toHaveCount(0);
    await page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(
        page
            .locator(".nl-chart-leaderboard tbody tr")
            .first()
            .locator("td")
            .first()
    ).toHaveText("26");
    await expect(page.locator(".nl-ranking-list")).toBeFocused();
});

test("Public empty and no-rank states avoid duplicate messaging and unneeded pagination", async ({
    page,
}) => {
    await openRanking(page, { total: 0, signedIn: true, ownRank: null });
    await expect(
        page.getByText("등록된 기록이 없습니다.", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("순위 없음", { exact: true })).toHaveCount(0);
    await page.unrouteAll({ behavior: "wait" });
    await openRanking(page, { total: 25, signedIn: true, ownRank: null });
    await expect(page.getByText("순위 없음", { exact: true })).toBeVisible();
    await expect(page.locator(".nl-pagination")).toHaveCount(0);
    await expect(page.locator(".nl-chart-leaderboard tbody tr")).toHaveCount(
        25
    );
});

test("Invalid direct ranking pages normalize to the first page", async ({
    page,
}) => {
    for (const value of ["no", "2x", "-1", "0", "1", "99999"]) {
        await page.goto(`/ko${musicPath}?tab=ranking&page=${value}`);
        await expect(page).toHaveURL(new RegExp(`${musicPath}\\?tab=ranking$`));
        await expect(page.locator(".nl-chart-leaderboard")).toBeVisible();
    }
});

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} ranking keeps all columns and reflows without accessibility failures`, async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== "mobile-chromium",
            "Explicit width matrix is run once."
        );
        await openRanking(page, { locale, signedIn: true, ownRank: 3 });
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
                        .locator(".nl-score-distribution")
                        .evaluate(
                            (element) => element.getBoundingClientRect().height
                        )
                )
                .toBe(213);
            await expect
                .poll(() =>
                    page
                        .locator(".nl-chart-leaderboard tbody tr")
                        .evaluateAll((rows) =>
                            rows.every((row) => {
                                const first = row
                                    .parentElement!.querySelector("tr")!
                                    .children[4].getBoundingClientRect();
                                const score =
                                    row.children[4].getBoundingClientRect();
                                return (
                                    Math.abs(first.right - score.right) < 1 &&
                                    Math.abs(score.width - 68) < 1
                                );
                            })
                        )
                )
                .toBe(true);
            await page.screenshot({
                path: testInfo.outputPath(`${locale}-ranking-${width}.png`),
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
