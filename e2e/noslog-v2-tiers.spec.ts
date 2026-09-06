import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
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
                                ))
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
    await page.goto(`/${locale}/tiers?goal=fc&level=1`);
    if (page.viewportSize()!.width >= 1056)
        await expect(page.locator(".nl-tier-rail")).toBeVisible();
    await page.locator(".nl-tier-applied").click();
    await page.locator(".nl-tiers select").selectOption("s");
    if (failSummary)
        await expect(
            page.locator(".nl-tiers").getByRole("alert")
        ).toContainText("서열 데이터를 불러오지 못했습니다.");
    else
        await expect(
            page.locator(".nl-tier-results > [role=status]")
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
    await expect(dialog.getByRole("checkbox")).toHaveCount(136);
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
    await expect(
        page.getByRole("button", { name: "필터 3", exact: true })
    ).toBeVisible();
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

test("wide filters apply immediately and empty selection removes only its constraint", async ({
    page,
}) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await prepare(page);
    const rail = page.getByRole("complementary", { name: "서열표 조건" });
    await rail.getByRole("button", { name: "Real", exact: true }).click();
    await expect(page).toHaveURL(/difficulty=Real/);
    await expect(page.locator(".nl-tier-results > [role=status]")).toHaveText(
        "1곡"
    );
    await rail.getByRole("button", { name: "12", exact: true }).click();
    await expect(
        page.getByText("이 조건에 해당하는 채보가 없습니다.", { exact: true })
    ).toBeVisible();
    await rail.getByRole("button", { name: "12", exact: true }).click();
    await expect(page).not.toHaveURL(/level=/);
    await expect(page.locator(".nl-tier-card")).toHaveCount(1);
    await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("detailed cards keep square jackets and separate score rank from combo", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    await page
        .getByRole("checkbox", { name: "상세 보기", exact: true })
        .check();
    await expect(page).toHaveURL(/view=detailed/);
    const fc = page
        .locator('.nl-tier-card:has([data-achievement="fc"])')
        .first();
    await expect(fc.locator(".nl-tier-card__rank")).toHaveAttribute(
        "src",
        "/grade/grade_s.png"
    );
    await expect(fc.locator(".nl-tier-card__score-band")).toContainText("FC");
    const jacket = await fc.locator(".nl-jacket").boundingBox();
    expect(jacket!.width).toBeCloseTo(jacket!.height, 1);
    expect(jacket!.width).toBeCloseTo(173, 0);
    await expect(fc).toContainText("공식 Grd +0.42");
    await expect(fc).toContainText("NosLog 레이팅 +36.5");
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
    expect(link.searchParams.get("returnTo")).toContain("view=detailed");
});

test("all six scopes update the link context and guide without removing the filters", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    for (const mode of ["basic", "recital"]) {
        await page
            .getByRole("radio", {
                name: mode === "basic" ? "Basic" : "Recital",
                exact: true,
            })
            .click();
        for (const goal of ["s", "fc", "pianist"]) {
            await page
                .getByRole("combobox", { name: "목표", exact: true })
                .selectOption(goal);
            await expect(page.locator(".nl-tier-card").first()).toHaveAttribute(
                "href",
                new RegExp(`mode=${mode}&goal=${goal}`)
            );
            await expect(
                page.getByRole("button", { name: "필터", exact: true })
            ).toBeVisible();
        }
    }
    await page.locator(".nl-tiers summary").click();
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
        .getByRole("combobox", { name: "목표", exact: true })
        .selectOption("pianist");
    await page.locator(".nl-tiers summary").click();
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

test("Back restores a detailed band scan and its practical scroll position", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepare(page);
    await page
        .getByRole("checkbox", { name: "상세 보기", exact: true })
        .check();
    const dense = page.getByRole("region", { name: "14.3", exact: true });
    await dense.scrollIntoViewIfNeeded();
    const card = dense.locator("a.nl-tier-card").last();
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
        page.getByRole("checkbox", { name: "상세 보기", exact: true })
    ).toBeChecked();
    await expect(dense.locator("a.nl-tier-card")).toHaveCount(15);
    await expect
        .poll(async () =>
            Math.abs((await page.evaluate(() => window.scrollY)) - scroll)
        )
        .toBeLessThan(96);
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
        page.getByRole("combobox", { name: "목표", exact: true })
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
        /STULTI.*Expert 12.*서열·평가/
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
    for (const theme of ["dark", "light"] as const) {
        test(`${locale} ${theme} reflows compact and detailed cards at five widths`, async ({
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
            for (const detailed of [false, true]) {
                await page.setViewportSize({ width: 390, height: 844 });
                await page
                    .locator(".nl-tier-toolbar input[type=checkbox]")
                    .setChecked(detailed);
                for (const width of [320, 390, 768, 1024, 1280]) {
                    await page.setViewportSize({ width, height: 900 });
                    if (width >= 1056)
                        await expect(
                            page.locator(".nl-tier-rail")
                        ).toBeVisible();
                    else
                        await expect(page.locator(".nl-tier-rail")).toHaveCount(
                            0
                        );
                    await expect(
                        page.locator(".nl-tier-card").first()
                    ).toBeVisible();
                    const size = await page.evaluate(() => ({
                        width: document.documentElement.clientWidth,
                        scroll: document.documentElement.scrollWidth,
                        font: getComputedStyle(
                            document.querySelector(".nl-tiers")!
                        ).fontFamily,
                        columns: getComputedStyle(
                            document.querySelector(".nl-tier-grid")!
                        ).gridTemplateColumns.split(" ").length,
                    }));
                    expect(size.scroll).toBeLessThanOrEqual(size.width);
                    expect(size.font).toContain("Pretendard JP Variable");
                    const expected = detailed
                        ? { 320: 2, 390: 2, 768: 3, 1024: 5, 1280: 4 }
                        : { 320: 3, 390: 3, 768: 5, 1024: 7, 1280: 7 };
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
