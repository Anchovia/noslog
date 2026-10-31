import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const musicPath = "/music/bfdaadfb98501907925ecf41a076108d/expert";
// 개요의 패턴 경향은 채보 데이터 계산값(같은 난이도 · 전곡 두 기준, 0–1)이다. 변박은 기준과 상관없는 0–3 단계
const tendency = {
    difficulty: {
        stairs: 0.9,
        repetition: 1,
        polyrhythm: 0.13,
        offset: 0.21,
    },
    all: {
        stairs: 0.82,
        repetition: 0.88,
        polyrhythm: 0.08,
        offset: 0.13,
    },
    meter: 2,
    tempoChanges: 78,
    tenutoCount: 120,
    glissandoCount: 8,
    trillCount: 0,
};

// 패턴 경향은 상세 데이터에 늘 함께 와서 탭을 옮겨도 다시 받지 않는다 — 고정 값을 보이려면
// Hard 에서 연 뒤 그 값이 든 Expert 상세 응답을 주고 난이도를 옮긴다. undefined 는 읽기 실패
async function openOverviewWithPattern(
    page: Page,
    patternTendency: unknown,
    locale = "ko"
) {
    await page.route(
        "**/api/music-detail?*difficulty=expert*",
        async (route) => {
            const response = await route.fetch();
            const body = await response.json();
            await route.fulfill({
                json: {
                    ...body,
                    result: { ...body.result, patternTendency },
                },
            });
        }
    );
    await page.goto(`/${locale}${musicPath.replace(/expert$/, "hard")}`);
    // Hard 개요도 이미 보이므로 Expert 응답이 끝난 뒤에 가로채기를 푼다
    const loaded = page.waitForResponse(
        (response) =>
            response.url().includes("/api/music-detail?") &&
            response.url().includes("difficulty=expert")
    );
    await page.getByRole("radio", { name: /^Expert/ }).click();
    await loaded;
    await expect(page).toHaveURL(/\/expert$/);
    await expect(page.locator(".nl-overview")).toBeVisible();
    // 받은 뒤의 상세 요청(다른 탭 · 난이도)은 그대로 서버로 보낸다
    await page.unroute("**/api/music-detail?*difficulty=expert*");
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
            // 난이도 = 공용 세그먼트 한 줄 = 칸 높이(판 안쪽 0). 1056+ 는 세로 4행 = 행(컨트롤 기본 32)×4 + 사이 4×3
            .toBe(width >= 1056 ? 140 : 40);
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

test("Pattern trend shows four computed values with the meter level and switches between the difficulty and all charts", async ({
    page,
}) => {
    await openOverviewWithPattern(page, tendency);
    const bars = page.locator(".nl-overview .nl-bar-list");
    await expect(bars.locator("dt")).toHaveText([
        "계단",
        "연타",
        "폴리리듬",
        "즈레",
        "변박",
    ]);
    await expect(bars.locator(".nl-bar-list__value")).toHaveText([
        "90%",
        "100%",
        "13%",
        "21%",
        "보통",
    ]);
    await expect(
        page.locator(".nl-facts > div", { hasText: "변속" }).locator("dd")
    ).toHaveText("78회");
    const fact = (label: string) =>
        page
            .locator(".nl-facts > div", {
                has: page.getByText(label, { exact: true }),
            })
            .locator("dd");
    await expect(fact("테누토 수")).toHaveText("120");
    await expect(fact("글리산도 수")).toHaveText("8");
    await expect(fact("트릴 수")).toHaveText("0");
    // 변박은 칸 막대 3칸 가운데 단계만큼 채운다
    const steps = bars.locator(
        ".nl-bar-list__track--steps > span:not(.nl-bar-list__steps-fill)"
    );
    await expect(steps).toHaveCount(3);
    await expect(
        bars.locator(".nl-bar-list__steps-fill > .nl-bar-list__fill")
    ).toHaveCount(2);
    const basis = page.getByRole("button", {
        name: "전곡 기준으로 보기",
        exact: true,
    });
    await expect(basis).toHaveText("Expert 기준");
    await expect(page.locator(".nl-overview")).not.toContainText("평가하기");
    await basis.click();
    const back = page.getByRole("button", {
        name: "Expert 기준으로 보기",
        exact: true,
    });
    await expect(back).toHaveText("전곡 기준");
    await expect(bars.locator(".nl-bar-list__value")).toHaveText([
        "82%",
        "88%",
        "8%",
        "13%",
        "보통",
    ]);
    await back.click();
    await expect(bars.locator(".nl-bar-list__value").first()).toHaveText("90%");
    const help = page.getByRole("button", {
        name: "패턴 경향 기준",
        exact: true,
    });
    await help.click();
    const dialog = page.getByRole("dialog", { name: "패턴 경향 기준" });
    await expect(dialog).toContainText("상위 1%의 중앙값을 100%로 둡니다");
    await expect(dialog).toContainText("1–3건반씩 같은 방향으로");
    await expect(dialog).not.toContainText("악곡의 특색일 정도");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(help).toBeFocused();
});

test("A chart without a published chart blurs the bar graph under the lock card without a basis switch", async ({
    page,
}) => {
    await openOverviewWithPattern(page, null);
    // 공개 채보가 없으면 투표 잠금과 같은 흐림 + 가운데 카드 한 줄(사용자 결정 2026-10-29)
    const lock = page.locator(".nl-overview .nl-pattern-lock");
    await expect(lock).toHaveAttribute("data-locked", "true");
    await expect(lock.locator(".nl-pattern-lock__card")).toHaveText(
        "아직 계산되지 않았습니다"
    );
    const card = lock.locator(".nl-overview__card");
    await expect(card).toHaveAttribute("aria-hidden", "true");
    await expect(card).toHaveCSS("filter", "blur(5px)");
    await expect(card.locator(".nl-bar-list__row")).toHaveCount(5);
    // 채보로 세는 정보 줄은 값 대신 「—」
    for (const label of ["변속", "테누토 수", "글리산도 수", "트릴 수"]) {
        await expect(
            page
                .locator(".nl-facts > div", {
                    has: page.getByText(label, { exact: true }),
                })
                .locator("dd")
        ).toHaveText("—");
    }
    await expect(
        page.getByRole("button", { name: "전곡 기준으로 보기" })
    ).toHaveCount(0);
});

test("Pattern load failure keeps the page and shows the error in its region", async ({
    page,
}) => {
    await openOverviewWithPattern(page, undefined);
    const error = page
        .getByRole("alert")
        .filter({ hasText: "악곡 정보를 불러오지 못했습니다." });
    await expect(error).toBeVisible();
    await expect(
        error.getByRole("button", { name: "다시 시도", exact: true })
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "내 기록", exact: true })
    ).toBeVisible();
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
        await openOverviewWithPattern(page, tendency, locale);
        await expect(page.locator(".nl-bar-list__fill")).toHaveCount(6);
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
