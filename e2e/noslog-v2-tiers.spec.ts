import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { reviewThemes } from "./helpers";
import type { Page } from "@playwright/test";
import type {
    TierBrowserBand,
    TierBrowserOverview,
} from "@/features/tiers/schemas/tierBrowserSchema";

const bands: TierBrowserBand[] = Array.from({ length: 136 }, (_, index) => ({
    id: 9000 + index,
    position: index,
    value: Number((14.5 - index / 10).toFixed(1)),
    entries: Array.from(
        { length: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 15 : 0 },
        (_, entryIndex) => ({
            id: index * 20 + entryIndex,
            chartId: index * 20 + entryIndex,
            position: entryIndex,
            chart: {
                difficulty: entryIndex === 3 ? "Real" : "Expert",
                level: entryIndex === 3 ? 3 : 12,
                music: {
                    index: "bfdaadfb98501907925ecf41a076108d",
                    title:
                        entryIndex === 4
                            ? "非常に長い日本語の楽曲タイトルと 한국어 원문 긴 제목 검증 LongOriginalTitleWithoutSpaces"
                            : `STULTI ${index + 1}-${entryIndex + 1}`,
                    reading: `すとぅるてぃ ${index + 1}-${entryIndex + 1}`,
                    localizedTitle: null,
                    background: null,
                },
            },
            record:
                entryIndex === 4
                    ? null
                    : {
                          score:
                              entryIndex === 2
                                  ? 1_000_000
                                  : 975_421 + entryIndex,
                          rank: entryIndex === 2 ? "P" : "S",
                          fc_type:
                              entryIndex === 1 ? 2 : entryIndex === 2 ? 3 : 0,
                          grade: 0.42,
                          rating: entryIndex === 3 ? null : 36.5,
                      },
        })
    ),
}));

async function prepare(
    page: Page,
    {
        locale = "ko",
        guest = false,
        errorBand = false,
        failSummary = false,
        unpublished = false,
    } = {}
) {
    await page.route("**/api/tier-browser?*", async (route) => {
        const params = new URL(route.request().url()).searchParams;
        if (
            (!params.has("bandId") && failSummary) ||
            (params.get("bandId") === "9000" && errorBand)
        ) {
            await route.fulfill({
                status: 503,
                json: {
                    isSuccess: false,
                    code: "UNAVAILABLE",
                    message: "Unavailable",
                    result: null,
                },
            });
            return;
        }
        const selected = bands.map((band) => ({
            ...band,
            entries: band.entries
                .filter(
                    (entry) =>
                        (!params.get("difficulty") ||
                            params
                                .get("difficulty")!
                                .split(",")
                                .includes(entry.chart.difficulty)) &&
                        (!params.get("level") ||
                            params
                                .get("level")!
                                .split(",")
                                .includes(
                                    entry.chart.difficulty === "Real"
                                        ? `real-${entry.chart.level}`
                                        : String(entry.chart.level)
                                )) &&
                        (!params.get("q") ||
                            entry.chart.music.title
                                .toLowerCase()
                                .includes(params.get("q")!.toLowerCase()))
                )
                .map((entry) => ({
                    ...entry,
                    record: guest ? null : entry.record,
                })),
        }));
        const result: TierBrowserOverview | TierBrowserBand = params.has(
            "bandId"
        )
            ? selected.find((band) => band.id === Number(params.get("bandId")))!
            : {
                  viewerId: guest ? null : 900,
                  showLocalizedTitle: true,
                  theoreticalMax: 11830,
                  list: unpublished
                      ? null
                      : {
                            id: 900,
                            slug: `${params.get("mode")}-${params.get("goal")}`,
                            description:
                                "Basic 모드에서 S 달성을 목표로 하는 통합 서열표",
                            updatedAt: "2026-08-21T00:00:00Z",
                            bands: selected.map((band) => ({
                                id: band.id,
                                value: band.value,
                                position: band.position,
                                totalCount: band.entries.length,
                                achievedCount: guest
                                    ? null
                                    : band.entries.filter(
                                          (entry) => entry.record
                                      ).length,
                            })),
                        },
              };
        await route.fulfill({
            json: { isSuccess: true, code: "SUCCESS", message: "", result },
        });
    });
    await page.goto(`/${locale}/tiers?goal=990k&level=1`);
    await page.locator(".nl-applied__token").first().click();
    // 서열표는 제목 스위처에서 고른다(2026-09-22 ④) — 모든 폭에서 같은 자리
    await page
        .getByRole("combobox", {
            name: {
                ko: "서열표 선택",
                ja: "難易度表を選ぶ",
                en: "Choose tier list",
            }[locale],
            exact: true,
        })
        .click();
    await page
        .getByRole("option", {
            name: { ko: "S 서열표", ja: "S難易度表", en: "S Tier List" }[
                locale
            ],
            exact: true,
        })
        .click();
    if (failSummary)
        await expect(
            page.locator(".nl-tiers").getByRole("alert")
        ).toContainText("서열 데이터를 불러오지 못했습니다.");
    else
        await expect(
            page.locator(".nl-tiers [role=status]:not(.sr-only)").first()
        ).toContainText(unpublished ? "" : "18");
    if (!failSummary && !unpublished && !errorBand)
        await expect(page.locator(".nl-tier-card").first()).toBeVisible();
}

test("stages all three filter groups, cancels ranges, and commits once", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    await page.getByRole("button", { name: "필터", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "서열표 조건" });
    // 0곡 구간은 목록에서 뺀다(2026-09-22) — 곡이 있는 14.5 · 14.4 · 14.3 만
    await expect(dialog.getByRole("checkbox")).toHaveCount(3);
    await dialog
        .getByRole("button", { name: "범위 선택", exact: true })
        .click();
    const first = dialog.getByRole("checkbox", { name: /^14\.5 / });
    await first.click();
    await expect(first).not.toBeChecked();
    await expect(dialog.getByRole("status")).toHaveText("끝 구간을 고르세요");
    await dialog.getByRole("checkbox", { name: /^14\.3 / }).click();
    await expect(first).toBeChecked();
    await expect(
        dialog.getByRole("checkbox", { name: /^14\.4 / })
    ).toBeChecked();
    await expect(page).not.toHaveURL(/bands=/);
    await dialog.getByRole("button", { name: "닫기", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await page.getByRole("button", { name: "필터", exact: true }).click();
    await expect(
        dialog.getByRole("checkbox", { name: /^14\.5 / })
    ).not.toBeChecked();
    await dialog.getByRole("checkbox", { name: /^14\.3 / }).check();
    await dialog.getByRole("button", { name: "Expert", exact: true }).click();
    await dialog.getByRole("button", { name: "12", exact: true }).click();
    await expect(
        dialog.getByRole("button", { name: "결과 14개 보기", exact: true })
    ).toBeEnabled();
    await dialog
        .getByRole("button", { name: "결과 14개 보기", exact: true })
        .click();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/difficulty=Expert.*level=12.*bands=14.3/);
    // 폰 필터는 아이콘 버튼 44 + 적용 개수 배지(악곡 목록과 같음)
    await expect(
        page.locator(".nl-filter-icon-trigger .nl-filter-count")
    ).toHaveText("3");
    await expect(page.locator(".nl-tier-band")).toHaveCount(1);
    await page
        .getByRole("button", {
            name: "서열표 구간 14.3 조건 해제",
            exact: true,
        })
        .click();
    await expect(page).not.toHaveURL(/bands=/);
    await expect(page.locator(".nl-tier-band")).toHaveCount(3);
});

test("Intermediate filters commit explicitly and clearing a constraint restores results", async ({
    page,
}) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await prepare(page);
    await expect(page.locator(".nl-tier-rail")).toHaveCount(0);
    await expect(
        page.getByRole("radio", { name: "목록", exact: true })
    ).toBeVisible();
    await page.getByRole("button", { name: "필터", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "서열표 조건" });
    await dialog.getByRole("button", { name: "Real", exact: true }).click();
    await expect(page).not.toHaveURL(/difficulty=Real/);
    await dialog
        .getByRole("button", { name: "결과 1개 보기", exact: true })
        .click();
    await expect(page).toHaveURL(/difficulty=Real/);
    await expect(page.locator(".nl-tier-card")).toHaveCount(1);
    await page
        .getByRole("button", { name: "Real 조건 해제", exact: true })
        .click();
    await expect(page).not.toHaveURL(/difficulty=/);
    await expect(page.locator(".nl-tier-card")).toHaveCount(18);
});

test("list rows keep 48 jackets, the goal outline and the contribution", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    await page.getByRole("radio", { name: "목록", exact: true }).click();
    await expect(page).toHaveURL(/view=list/);
    await expect(page.locator(".nl-tier-card")).toHaveCount(0);
    // 이 표(S)를 달성한 FC 라 자켓 테두리는 초록 → 기준 색 그라데이션
    const fc = page
        .locator('.nl-tier-row:has([data-achievement="goal-fc"])')
        .first();
    await expect(fc).toBeVisible();
    const row = await fc.boundingBox();
    expect(row!.height).toBeCloseTo(64, 0);
    const jacket = await fc.locator(".nl-tier-row__jacket").boundingBox();
    expect(jacket!.width).toBeCloseTo(48, 0);
    expect(jacket!.height).toBeCloseTo(48, 0);
    await expect(fc).toContainText("Expert 12");
    await expect(fc).toContainText("975,422");
    await expect(fc).toContainText("공식 Grd +0.42");
    // 공식 Grd 가 없을 때만 NosLog 레이팅 — 한 줄에 하나
    await expect(fc).not.toContainText("NosLog 레이팅");
    const link = new URL(
        (await fc.getAttribute("href"))!,
        "http://localhost:3000"
    );
    expect(Object.fromEntries(link.searchParams)).toMatchObject({
        tab: "tier",
        source: "tiers",
        mode: "basic",
        goal: "s",
    });
    expect(link.searchParams.get("returnTo")).toContain("view=list");
});

test("all four tier lists update the link context and guide without removing the filters", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    for (const goal of ["s", "990k", "pianist"]) {
        await page
            .getByRole("combobox", { name: "서열표 선택", exact: true })
            .click();
        await page
            .getByRole("option", {
                name: {
                    s: "S 서열표",
                    "990k": "990k 서열표",
                    pianist: "Pianist 서열표",
                }[goal],
                exact: true,
            })
            .click();
        await expect(page.locator(".nl-tier-card").first()).toHaveAttribute(
            "href",
            new RegExp(`mode=basic&goal=${goal}`)
        );
        await expect(
            page.getByRole("button", { name: "필터", exact: true })
        ).toBeVisible();
    }
    // Recital 은 서열표가 하나 — 같은 스위처의 Recital 묶음에서 고른다
    await page
        .getByRole("combobox", { name: "서열표 선택", exact: true })
        .click();
    await expect(
        page.getByRole("group", { name: "Recital", exact: true })
    ).toBeVisible();
    await page
        .getByRole("option", { name: "Recital 서열표", exact: true })
        .click();
    await expect(
        page.getByRole("combobox", { name: "서열표 선택", exact: true })
    ).toHaveText("Recital 서열표");
    await expect(page.locator(".nl-tier-card").first()).toHaveAttribute(
        "href",
        /mode=recital&goal=pianist/
    );
    await expect(
        page.getByRole("button", { name: "필터", exact: true })
    ).toBeVisible();
    await page
        .getByRole("button", { name: "Recital 서열표 안내", exact: true })
        .click();
    await expect(
        page.getByText("Recital Pianist · 1곡 기준", { exact: true })
    ).toBeVisible();
    await expect(page.locator(".nl-tier-weight")).toBeVisible();
});

test("calculation guidance preserves chart geometry and keyboard access to exact values", async ({
    page,
}, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    await page
        .getByRole("combobox", { name: "서열표 선택", exact: true })
        .click();
    await page
        .getByRole("option", { name: "Pianist 서열표", exact: true })
        .click();
    await page
        .getByRole("button", { name: "Pianist 서열표 안내", exact: true })
        .click();
    const chart = page.locator(".nl-tier-weight");
    await expect(chart).toBeVisible();
    await expect(chart.locator(".nl-line-chart__y > span")).toHaveCount(5);
    await expect(chart.locator("table tbody tr")).toHaveCount(136);
    await expect(chart.locator(".sr-only > table")).toHaveCount(1);
    const focus = chart.locator('.nl-line-chart__target[tabindex="0"]');
    await focus.focus();
    await focus.press("Home");
    await expect(chart.getByRole("tooltip")).toContainText("1.0");
    await page.keyboard.press("End");
    await expect(chart.getByRole("tooltip")).toContainText("14.5");
    expect((await chart.boundingBox())!.height).toBeLessThan(500);
    await page.screenshot({
        path: testInfo.outputPath("tier-guide.png"),
        fullPage: true,
    });
});

test("Back restores a list band scan and its practical scroll position", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    await page.getByRole("radio", { name: "목록", exact: true }).click();
    const dense = page.getByRole("region", { name: "14.3", exact: true });
    await dense.scrollIntoViewIfNeeded();
    const card = dense.locator("a.nl-tier-row").last();
    await card.scrollIntoViewIfNeeded();
    const url = page.url();
    const scroll = await page.evaluate(() => window.scrollY);
    await card.click();
    await expect(page).toHaveURL(/\/music\/.*tab=tier.*mode=basic.*goal=s/);
    await expect(page.locator(".nl-community-panel")).toBeVisible();
    await expect(
        page.locator('.nl-vote-row[aria-expanded="true"]')
    ).toContainText("S");
    await page.goBack();
    await expect(page).toHaveURL(url);
    await expect(
        page.getByRole("radio", { name: "목록", exact: true })
    ).toBeChecked();
    await expect(dense.locator("a.nl-tier-row")).toHaveCount(15);
    await expect
        .poll(async () =>
            Math.abs((await page.evaluate(() => window.scrollY)) - scroll)
        )
        .toBeLessThan(96);
});

test("song search narrows every band, keeps the filters and clears in place", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    const search = page.getByRole("searchbox", {
        name: "악곡 제목·아티스트 검색",
    });
    await search.fill("stulti 3-2");
    await expect(page).toHaveURL(/q=stulti\+3-2|q=stulti%203-2/);
    // 맞는 곡이 없는 구간은 숨기고, 결과 수는 찾은 곡 수
    await expect(page.locator(".nl-tier-band")).toHaveCount(1);
    await expect(
        page.getByRole("region", { name: "14.3", exact: true })
    ).toBeVisible();
    await expect(page.locator(".nl-tier-card")).toHaveCount(1);
    await expect(
        page.locator(".nl-tiers [role=status]:not(.sr-only)").first()
    ).toContainText("1곡");
    await search.fill("zzqq");
    await expect(
        page.getByText("「zzqq」에 맞는 곡이 이 서열표에 없습니다.", {
            exact: true,
        })
    ).toBeVisible();
    await page
        // 검색창 안 × 가 아니라 결과 없음 상태의 보조 버튼
        .locator(".nl-tier-results .nl-button")
        .filter({ hasText: "검색어 지우기" })
        .click();
    await expect(page).not.toHaveURL(/q=/);
    await expect(search).toHaveValue("");
    await expect(page.locator(".nl-tier-band")).toHaveCount(3);
});

test("sorts songs inside each band and offers the score order only when signed in", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    const band = page.getByRole("region", { name: "14.3", exact: true });
    const firstTitle = () =>
        band.locator(".nl-tier-card").first().getAttribute("aria-label");
    const sort = page.locator(".nl-tier-scope .nl-filter-trigger");
    await expect(sort).toHaveAccessibleName("정렬: 서열표 순");
    await sort.click();
    await expect(page.getByRole("menuitemradio")).toHaveText([
        "서열표 순",
        "레벨 순",
        "일본어 읽기 순",
        "점수 낮은 순",
    ]);
    await page
        .getByRole("menuitemradio", { name: "점수 낮은 순", exact: true })
        .click();
    await expect(page).toHaveURL(/sort=score/);
    // 기록 없는 곡(5번째)이 구간 맨 앞, 구간 순서는 그대로
    expect(await firstTitle()).toContain("LongOriginalTitleWithoutSpaces");
    await expect(page.locator(".nl-tier-band").first()).toHaveAccessibleName(
        "14.5"
    );
    await sort.click();
    await page
        .getByRole("menuitemradio", { name: "서열표 순", exact: true })
        .click();
    await expect(page).not.toHaveURL(/sort=/);
    expect(await firstTitle()).toContain("STULTI 3-1");

    await prepare(page, { guest: true });
    await sort.click();
    await expect(page.getByRole("menuitemradio")).toHaveText([
        "서열표 순",
        "레벨 순",
        "일본어 읽기 순",
    ]);
});

test("unachieved jackets turn grey and the jacket strip follows the select in the address", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    const band = page.getByRole("region", { name: "14.3", exact: true });
    // 목표 미달성(기록 없는 5번째)만 흑백 — 자켓 그림에만 거는 필터(2026-09-22 B)
    await expect(band.locator(".nl-tier-card[data-unachieved]")).toHaveCount(1);
    const greyed = await band
        .locator(".nl-tier-card[data-unachieved]")
        .evaluate((card) => {
            const image = card.querySelector(".nl-jacket > img");
            return image ? getComputedStyle(image).filter : "grayscale(1)";
        });
    expect(greyed).toBe("grayscale(1)");
    // 띠 기본 = 공식 Grd, 목록 보기 기여와 같은 형식
    await expect(band.locator(".nl-tier-card__strip").first()).toHaveText(
        "+0.42"
    );
    const select = page.getByRole("combobox", {
        name: "자켓 위 값",
        exact: true,
    });
    await expect(select).toHaveText("Grd");
    await select.click();
    await page
        .getByRole("option", { name: "NosLog 레이팅", exact: true })
        .click();
    await expect(page).toHaveURL(/strip=rating/);
    await expect(band.locator(".nl-tier-card__strip").first()).toHaveText(
        "+36.5"
    );
    // 레이팅이 없는 곡(4번째) · 기록 없는 곡은 띠 없음 — 다른 값으로 채우지 않는다
    await expect(band.locator(".nl-tier-card__strip")).toHaveCount(13);
    await select.click();
    await page.getByRole("option", { name: "표시 안 함", exact: true }).click();
    await expect(page).toHaveURL(/strip=off/);
    await expect(page.locator(".nl-tier-card__strip")).toHaveCount(0);
    // 목록 보기에는 띠가 없어 셀렉트도 없다
    await page
        .locator(".nl-tier-scope")
        .getByRole("radio", { name: "목록", exact: true })
        .click();
    await expect(select).toHaveCount(0);

    await prepare(page, { guest: true });
    await expect(select).toHaveCount(0);
    await expect(page.locator("[data-unachieved]")).toHaveCount(0);
    await expect(page.locator(".nl-tier-card__strip")).toHaveCount(0);
});

test("exports the current view as a JPEG and remembers the display options", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    // 결과 줄 끝(보기 전환 옆) · 줄의 단계 M(2026-09-22 S5)
    const open = page.locator(".nl-tier-scope").getByRole("button", {
        name: "서열표 이미지 내보내기",
        exact: true,
    });
    await expect(open).toHaveCSS("height", "36px");
    await open.click();
    const dialog = page.getByRole("dialog", { name: "서열표 내보내기" });
    await expect(
        dialog.getByText("담기는 것 · S 서열표 · 3구간 18곡", { exact: true })
    ).toBeVisible();
    const preview = dialog.locator(".nl-tier-export__preview img");
    await expect(preview).toBeVisible({ timeout: 30_000 });
    const size = () =>
        preview.evaluate((image: HTMLImageElement) => [
            image.naturalWidth,
            image.naturalHeight,
        ]);
    const [width, compactHeight] = await size();
    expect(width).toBe(1200);
    const names = dialog.getByRole("checkbox", {
        name: "곡 이름 표시",
        exact: true,
    });
    await expect(names).not.toBeChecked();
    await names.check();
    await expect
        .poll(async () => (await size())[1], { timeout: 30_000 })
        .toBeGreaterThan(compactHeight);
    const download = page.waitForEvent("download");
    await dialog
        .getByRole("button", { name: "이미지 저장", exact: true })
        .click();
    expect((await download).suggestedFilename()).toMatch(
        /^noslog-basic-s-\d{4}-\d{2}-\d{2}\.jpg$/
    );
    await page.keyboard.press("Escape");
    await open.click();
    await expect(
        page
            .getByRole("dialog", { name: "서열표 내보내기" })
            .getByRole("checkbox", { name: "곡 이름 표시", exact: true })
    ).toBeChecked();
});

test("unpublished lists and request failures retain the scope controls", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page, { unpublished: true });
    await expect(
        page.getByText("선택한 목표의 공개 서열표가 없습니다.", { exact: true })
    ).toBeVisible();
    await expect(
        page.getByRole("combobox", { name: "서열표 선택", exact: true })
    ).toBeVisible();
    await prepare(page, { failSummary: true });
    await expect(page.locator(".nl-tiers").getByRole("alert")).toContainText(
        "서열 데이터를 불러오지 못했습니다."
    );
    await expect(
        page.getByRole("button", { name: "다시 불러오기", exact: true })
    ).toBeVisible();
});

test("guest compact cards contain only jackets and preserve direct navigation", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page, { guest: true });
    await expect(page.locator(".nl-tier-card__score")).toHaveCount(0);
    await expect(page.locator(".nl-tier-card__rank")).toHaveCount(0);
    await expect(page.locator(".nl-tier-band__header > span")).toHaveCount(0);
    await expect(page.locator(".nl-tier-card").first()).toHaveAccessibleName(
        /STULTI.*Expert 12.*평가/
    );
});

test("band failures stay local and retry without losing the selected scope", async ({
    page,
}) => {
    await prepare(page, { errorBand: true });
    const first = page.getByRole("region", { name: "14.5", exact: true });
    await expect(
        first.getByText("서열 데이터를 불러오지 못했습니다.")
    ).toBeVisible();
    await expect(
        page.getByRole("region", { name: "14.4", exact: true })
    ).toBeVisible();
    await page.route("**/api/tier-browser?*", async (route) => {
        if (
            new URL(route.request().url()).searchParams.get("bandId") !== "9000"
        )
            return route.fallback();
        await route.fulfill({
            json: {
                isSuccess: true,
                code: "SUCCESS",
                message: "",
                result: bands[0],
            },
        });
    });
    await first
        .getByRole("button", { name: "다시 불러오기", exact: true })
        .click();
    await expect(first.locator(".nl-tier-card")).toHaveCount(1);
    await expect(page).toHaveURL(/goal=s/);
});

for (const locale of ["ko", "ja", "en"])
    for (const theme of reviewThemes) {
        test(`${locale} ${theme} reflows grid cards and list rows at six widths`, async ({
            page,
        }, testInfo) => {
            test.skip(
                testInfo.project.name !== "mobile-chromium",
                "Locale/theme matrix runs once."
            );
            await page.emulateMedia({ colorScheme: theme });
            await page.addInitScript(
                (value) => localStorage.setItem("noslog-theme", value),
                theme
            );
            await prepare(page, { locale });
            await expect(page.locator("html")).toHaveAttribute(
                "data-theme",
                theme
            );
            const names = {
                ko: { grid: "격자", list: "목록" },
                ja: { grid: "グリッド", list: "リスト" },
                en: { grid: "Grid", list: "List" },
            }[locale]!;
            for (const view of ["grid", "list"] as const) {
                await page.setViewportSize({ width: 390, height: 844 });
                await page
                    .locator(".nl-tier-scope, .nl-tier-toolbar")
                    .getByRole("radio", { name: names[view], exact: true })
                    .click();
                for (const width of [320, 390, 768, 1024, 1280, 1600]) {
                    await page.setViewportSize({ width, height: 900 });
                    await expect(page.locator(".nl-tier-rail")).toHaveCount(
                        width >= 1056 ? 1 : 0
                    );
                    await expect(
                        page
                            .locator(".nl-tier-scope, .nl-tier-toolbar")
                            .getByRole("radio", {
                                name: names[view],
                                exact: true,
                            })
                    ).toBeChecked();
                    await expect(
                        page
                            .locator(
                                view === "grid"
                                    ? ".nl-tier-card"
                                    : ".nl-tier-row"
                            )
                            .first()
                    ).toBeVisible();
                    const size = await page.evaluate(() => ({
                        width: document.documentElement.clientWidth,
                        scroll: document.documentElement.scrollWidth,
                        font: getComputedStyle(
                            document.querySelector(".nl-tiers")!
                        ).fontFamily,
                        columns: document.querySelector(".nl-tier-grid")
                            ? getComputedStyle(
                                  document.querySelector(".nl-tier-grid")!
                              ).gridTemplateColumns.split(" ").length
                            : 0,
                    }));
                    expect(size.scroll).toBeLessThanOrEqual(size.width);
                    expect(size.font).toContain("Pretendard JP Variable");
                    // 폰 4열(2026-09-22), 672 이상은 auto-fill
                    const expected =
                        view === "list"
                            ? {
                                  320: 0,
                                  390: 0,
                                  768: 0,
                                  1024: 0,
                                  1280: 0,
                                  1600: 0,
                              }
                            : {
                                  320: 4,
                                  390: 4,
                                  768: 5,
                                  1024: 7,
                                  1280: 6,
                                  1600: 6,
                              };
                    expect(size.columns).toBe(
                        expected[width as keyof typeof expected]
                    );
                    if (width === 320 || width === 1280) {
                        const axe = await new AxeBuilder({ page })
                            .include(".nl-tiers")
                            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                            .analyze();
                        expect(axe.violations).toEqual([]);
                    }
                }
            }
            await page.setViewportSize({ width: 390, height: 900 });
            await page.screenshot({
                path: testInfo.outputPath(`tiers-${locale}-${theme}.png`),
                fullPage: true,
            });
        });
    }
