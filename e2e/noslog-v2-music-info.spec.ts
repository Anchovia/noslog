import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const musicPath = "/music/bfdaadfb98501907925ecf41a076108d/expert";
const pattern = {
    stairs: { count: 41, average: 2.8 },
    repetition: { count: 40, average: 3.4 },
    polyrhythm: { count: 38, average: 1.6 },
    offset: { count: 39, average: 2.1 },
    chords: { count: 41, average: 3.7 },
};

// 개요의 패턴 경향은 서버가 상세와 함께 그린다(2026-10-15 S5) — 고정 데이터를 보이려면
// 서버 요약이 빠진 상세(클라가 따로 받는 경우)를 주고 다른 탭에서 개요로 옮겨 온다
async function openOverviewWithClientPattern(page: Page, locale = "ko") {
    await page.route("**/api/music-detail?**", async (route) => {
        const response = await route.fetch();
        const body = await response.json();
        await route.fulfill({
            json: {
                ...body,
                result: { ...body.result, patternSummary: undefined },
            },
        });
    });
    await page.goto(`/${locale}${musicPath}?tab=record`);
    await page.getByRole("tab").first().click();
    // 개요를 받은 뒤의 상세 요청(다른 탭 · 난이도)은 그대로 서버로 보낸다
    await expect(page.locator(".nl-overview")).toBeVisible();
    await page.unroute("**/api/music-detail?**");
}

test("Music detail enters Overview and keeps the four difficulty choices on one row", async ({
    page,
}) => {
    await page.goto(`/ko${musicPath}`);
    await expect(
        page.getByRole("heading", { name: "패턴 경향", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(4);
    for (const width of [320, 360, 390, 430, 768, 1024, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        // 1056 미만은 자켓 80 옆에 제목 — 글자 묶음이 80 이하면 세로 가운데, 길면 위에 맞추고 아래로 늘어난다.
        // 1056+ 는 왼쪽 열에 세로로 쌓는다 (2026-09-16 · 2026-09-17)
        if (width < 1056)
            await expect
                .poll(() =>
                    page
                        .locator(".nl-music-entity__identity")
                        .evaluate((element) => {
                            const jacket = element
                                .querySelector(".nl-jacket")!
                                .getBoundingClientRect();
                            const copy = element
                                .querySelector(".nl-music-entity__copy")!
                                .getBoundingClientRect();
                            return copy.height > jacket.height
                                ? Math.abs(jacket.y - copy.y)
                                : Math.abs(
                                      jacket.y +
                                          jacket.height / 2 -
                                          copy.y -
                                          copy.height / 2
                                  );
                        })
                )
                .toBeLessThan(0.5);
        await expect(page.locator(".nl-music-entity__copy")).toHaveCSS(
            "text-align",
            "left"
        );
        await expect
            .poll(() =>
                page
                    .locator(".nl-difficulty-selector")
                    .evaluate(
                        (element) => element.getBoundingClientRect().height
                    )
            )
            // 난이도 = 공용 세그먼트 L 한 줄(1056+ 는 세로 4행 = 행 40×4 + 사이 4×3 + 트랙 8)
            .toBe(width >= 1056 ? 180 : 44);
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
        await expect(
            page.getByRole("tablist", { name: "상세 영역" })
        ).toBeVisible();
    }
    await page.getByRole("radio", { name: /^Hard/ }).click();
    await expect(page).toHaveURL(/\/hard$/);
    await expect(page.getByRole("radio", { name: /^Hard/ })).toBeChecked();
    await expect(
        page.getByRole("heading", { name: "패턴 경향", exact: true })
    ).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("radio", { name: /^Expert/ })).toBeChecked();
});

test("Pattern trend lists five exact values as bars with a keyboard dismissible help dialog", async ({
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
    await openOverviewWithClientPattern(page);
    const bars = page.locator(".nl-overview .nl-bar-list");
    await expect(bars.locator("dt")).toHaveText([
        "계단",
        "연타",
        "폴리리듬",
        "즈레",
        "변박",
    ]);
    await expect(bars.locator(".nl-bar-list__value")).toHaveText([
        "2.8",
        "3.4",
        "1.6",
        "2.1",
        "3.7",
    ]);
    await expect(bars.locator(".nl-bar-list__fill")).toHaveCount(5);
    // 평가 인원은 제목 줄에, 「평가하기 ›」 는 같은 줄 오른쪽 끝 — 누르면 평가 탭
    // 내 기록 구역도 제목 줄(로그인 링크)을 가지므로 패턴 경향 제목 줄은 첫 줄이다
    await expect(
        page.locator(".nl-overview .nl-heading-row").first()
    ).toContainText("평가 41명");
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
    await page.getByRole("button", { name: "평가하기", exact: true }).click();
    await expect(page).toHaveURL(/tab=tier/);
});

test("An incomplete pattern aggregate keeps the other bars and marks only the missing axis", async ({
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
    await openOverviewWithClientPattern(page);
    const bars = page.locator(".nl-overview .nl-bar-list");
    await expect(bars.locator(".nl-bar-list__value").nth(2)).toHaveText("—");
    await expect(bars.locator(".nl-bar-list__fill")).toHaveCount(4);
});

test("Axes without an average still draw the empty bar graph without a sentence", async ({
    page,
}) => {
    const empty = Object.fromEntries(
        Object.keys(pattern).map((axis) => [axis, { count: 1, average: null }])
    );
    await page.route("**/api/music-community?**", (route) =>
        route.fulfill({
            json: {
                isSuccess: true,
                code: "SUCCESS",
                message: "",
                result: { pattern: empty },
            },
        })
    );
    await openOverviewWithClientPattern(page);
    // 집계가 없어도 빈 막대 5줄 + 값 「—」, 문장 없음 (2026-09-16)
    const bars = page.locator(".nl-overview .nl-bar-list");
    await expect(bars.locator(".nl-bar-list__row")).toHaveCount(5);
    await expect(bars.locator(".nl-bar-list__fill")).toHaveCount(0);
    await expect(bars.locator(".nl-bar-list__value").first()).toHaveText("—");
    await expect(page.locator(".nl-overview")).not.toContainText("집계");
});

test("Pattern request failure keeps the page and retries only its region", async ({
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
    await openOverviewWithClientPattern(page);
    const error = page
        .getByRole("alert")
        .filter({ hasText: "악곡 정보를 불러오지 못했습니다." });
    await expect(error).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "내 기록", exact: true })
    ).toBeVisible();
    failed = false;
    await error.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(page.locator(".nl-overview .nl-bar-list__fill")).toHaveCount(
        5
    );
});

test("Exact-target refresh failure retains information and offers a working retry", async ({
    page,
}) => {
    await page.goto(`/ko${musicPath}`);
    await expect(
        page.getByRole("heading", { name: "패턴 경향", exact: true })
    ).toBeVisible();
    let requests = 0;
    await page.route("**/api/music-detail?**", async (route) => {
        requests++;
        await route.fulfill({
            status: 503,
            json: {
                isSuccess: false,
                code: "UNAVAILABLE",
                message: "Unavailable",
                result: null,
            },
        });
    });
    await page.evaluate(() =>
        window.dispatchEvent(new Event("music-detail:invalidate"))
    );
    const alert = page.locator(".nl-music-detail [role=alert]");
    await expect(alert).toBeVisible();
    expect(requests).toBe(2);
    await expect(
        page.getByRole("heading", { name: "패턴 경향", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("radio", { name: /^Expert/ })).toBeChecked();
    await page.unroute("**/api/music-detail?**");
    await alert.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(alert).toHaveCount(0);
    await expect(
        page.getByRole("heading", { name: "패턴 경향", exact: true })
    ).toBeVisible();
});

test("An uncached difficulty failure does not show another difficulty's information", async ({
    page,
}) => {
    await page.goto(`/ko${musicPath}`);
    let requests = 0;
    await page.route("**/api/music-detail?*difficulty=hard*", async (route) => {
        requests++;
        await route.fulfill({
            status: 404,
            json: {
                isSuccess: false,
                code: "NOT_FOUND",
                message: "Not found",
                result: null,
            },
        });
    });
    await page.getByRole("radio", { name: /^Hard/ }).click();
    await expect(
        page
            .locator(".nl-music-detail")
            .getByRole("button", { name: "다시 시도", exact: true })
    ).toBeVisible();
    expect(requests).toBe(1);
    await expect(
        page.getByRole("heading", { name: "패턴 경향", exact: true })
    ).toHaveCount(0);
    await page.getByRole("radio", { name: /^Expert/ }).click();
    await expect(
        page.getByRole("heading", { name: "패턴 경향", exact: true })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/expert$/);
});

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} Overview keeps readable labels at every width and passes accessibility checks`, async ({
        page,
    }, testInfo) => {
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
        await openOverviewWithClientPattern(page, locale);
        await expect(page.locator(".nl-bar-list__fill")).toHaveCount(5);
        for (const width of [320, 390, 768, 1024, 1055, 1056, 1280, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            // 1056+ 는 왼쪽 머리 열 + 오른쪽 탭 내용 두 열 (2026-09-16 데스크톱 B)
            await expect
                .poll(() =>
                    page
                        .locator(".nl-music-detail__layout")
                        .evaluate(
                            (element) => getComputedStyle(element).display
                        )
                )
                .toBe(width >= 1056 ? "grid" : "flex");
            await expect
                .poll(() =>
                    page.evaluate(
                        () =>
                            document.documentElement.scrollWidth <=
                            document.documentElement.clientWidth
                    )
                )
                .toBe(true);
            // 막대 목록 라벨 · 값은 줄 안에 있고 잘리지 않는다
            await expect
                .poll(() =>
                    page
                        .locator(".nl-bar-list__row")
                        .evaluateAll((rows) =>
                            rows.every(
                                (row) =>
                                    row.scrollWidth <= row.clientWidth &&
                                    [...row.children].every(
                                        (cell) =>
                                            cell.scrollWidth <=
                                            cell.clientWidth + 1
                                    )
                            )
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
