import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page, Route } from "@playwright/test";
import { parseGlobalRankingQuery } from "@/features/rankings/schemas/globalRankingSchema";
import type {
    GlobalRankingPayload,
    GlobalRankingQuery,
    GlobalRankingRow,
} from "@/features/rankings/schemas/globalRankingSchema";

function fixture(
    query: GlobalRankingQuery,
    { count = 28, guest = false, mine = 926, unavailable = false } = {}
): GlobalRankingPayload {
    const page = Math.min(query.page, Math.max(1, Math.ceil(count / 25)));
    const players: GlobalRankingRow[] = Array.from(
        { length: count },
        (_, index) => ({
            id: 900 + index,
            username:
                index === 0
                    ? "CHOYO"
                    : index === 1
                      ? "NAGISA"
                      : index === 2
                        ? "아주긴한국어사용자이름과日本語Long"
                        : `PLAYER_${index + 1}`,
            rank: index === 0 ? 1 : index < 27 ? 2 : index + 1,
            avatar: null,
            country:
                index % 3 === 0
                    ? "ko-KR"
                    : index % 3 === 1
                      ? "ja-JP"
                      : "global",
            exam: index % 5 === 2 ? null : (index % 10) + 1,
            grade: 500_000,
            value:
                query.metric === "rating"
                    ? index === 0
                        ? 10_000
                        : 9321
                    : index === 0
                      ? 6000
                      : 5740,
        })
    );
    const current = players.find((row) => row.id === mine);
    return {
        query: { ...query, page },
        page,
        totalCount: unavailable ? 0 : count,
        status: unavailable ? "unavailable" : "available",
        viewerId: guest ? null : mine,
        rows: unavailable ? [] : players.slice((page - 1) * 25, page * 25),
        currentUser:
            guest || !current || unavailable
                ? null
                : { ...current, page: Math.floor((current.id - 900) / 25) + 1 },
    };
}
type FixtureOptions = Parameters<typeof fixture>[1];
async function respond(route: Route, options: FixtureOptions = {}) {
    const query = parseGlobalRankingQuery(
        new URL(route.request().url()).searchParams
    );
    await route.fulfill({
        json: {
            isSuccess: true,
            code: "SUCCESS",
            message: "",
            result: fixture(query, options),
        },
    });
}
async function prepare(
    page: Page,
    options: FixtureOptions = {},
    locale = "ko"
) {
    await page.route("**/api/rankings?*", (route) => respond(route, options));
    await page.goto(`/${locale}/rankings?mode=basic&region=kr&page=1`);
    await page.locator(".nl-global-ranking-controls [role=combobox]").click();
    await page
        .getByRole("option", {
            name: locale === "ko" ? "전체" : locale === "ja" ? "すべて" : "All",
            exact: true,
        })
        .click();
    await expect(page.locator(".nl-global-ranking-count")).toContainText(
        (options.count ?? 28).toLocaleString(locale)
    );
    await expect(page.locator("#global-ranking-results")).toHaveAttribute(
        "aria-busy",
        "false"
    );
}

test("shows 25 tied rows, reaches the containing page, and returns with Back", async ({
    page,
}) => {
    await prepare(page);
    await expect(page.locator(".nl-player-row")).toHaveCount(25);
    await expect(page.locator(".nl-ranking-personal__summary")).toHaveText(
        "내 순위2 / 28"
    );
    const mine = page.getByRole("link", { name: "내 위치", exact: true });
    await expect(mine).toHaveAttribute("href", /page=2#ranking-player-926$/);
    await mine.click();
    await expect(page.locator(".nl-player-row")).toHaveCount(3);
    await expect(page.locator("#ranking-player-926")).toBeFocused();
    await expect(
        page.locator("#ranking-player-926 .nl-player-row__rank")
    ).toHaveText("2");
    await expect(page.locator(".nl-ranking-personal")).toHaveCount(0);
    await page.goBack();
    await expect(page.locator(".nl-player-row")).toHaveCount(25);
    await expect(page.locator(".nl-ranking-personal")).toBeVisible();
    await page.goForward();
    await expect(page.locator(".nl-player-row")).toHaveCount(3);
    await expect(page).toHaveURL(/page=2$/);
});

test("retains the selected metric across Basic and Recital and scopes Other regions accurately", async ({
    page,
}) => {
    await prepare(page);
    await page
        .getByRole("button", { name: "NosLog 레이팅", exact: true })
        .click();
    await expect(page.locator(".nl-player-row__value").first()).toHaveText(
        "10,000 pt"
    );
    await page.getByRole("radio", { name: "Recital", exact: true }).click();
    await expect(page).toHaveURL(
        /mode=recital&metric=rating&region=all&page=1/
    );
    await expect(page.locator(".nl-exam-badge").first()).toHaveAttribute(
        "aria-label",
        "Recital 1급"
    );
    await page.locator(".nl-global-ranking-controls [role=combobox]").click();
    await page.getByRole("option", { name: "기타 지역", exact: true }).click();
    await expect(page).toHaveURL(/region=global&page=1/);
    await page.getByRole("button", { name: "공식 Grd", exact: true }).click();
    await expect(page.locator(".nl-player-row__value").first()).toHaveText(
        "6,000 Grd"
    );
    await expect(
        page.getByRole("radio", { name: "Recital", exact: true })
    ).toHaveAttribute("aria-checked", "true");
    await expect(page.locator(".nl-player-row a").first()).toHaveAttribute(
        "href",
        /mode=recital$/
    );
});

test("metric keyboard focus does not change the active comparison until activation", async ({
    page,
}) => {
    await prepare(page);
    const grade = page.getByRole("button", { name: "공식 Grd", exact: true });
    const rating = page.getByRole("button", {
        name: "NosLog 레이팅",
        exact: true,
    });
    await grade.focus();
    await grade.press("ArrowRight");
    await expect(rating).toBeFocused();
    await expect(grade).toHaveAttribute("aria-pressed", "true");
    await rating.press("Enter");
    await expect(rating).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".nl-player-row__value").first()).toHaveText(
        "10,000 pt"
    );
    await rating.press("Home");
    await expect(grade).toBeFocused();
    await expect(rating).toHaveAttribute("aria-pressed", "true");
});

test("pending controls retain committed units and an obsolete response cannot win", async ({
    page,
}) => {
    await prepare(page);
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
        release = resolve;
    });
    await page.route("**/api/rankings?*metric=rating*", async (route) => {
        await held;
        await respond(route);
    });
    const rating = page.getByRole("button", {
        name: "NosLog 레이팅",
        exact: true,
    });
    await rating.click();
    await expect(rating).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#global-ranking-results")).toHaveAttribute(
        "aria-busy",
        "true"
    );
    await expect(page.locator(".nl-player-row__value").first()).toHaveText(
        "6,000 Grd"
    );
    await expect(page.locator(".nl-player-row").first()).toHaveCSS(
        "opacity",
        "1"
    );
    await page.getByRole("button", { name: "공식 Grd", exact: true }).click();
    release();
    await expect(page.locator("#global-ranking-results")).toHaveAttribute(
        "aria-busy",
        "false"
    );
    await expect(page.locator(".nl-player-row__value").first()).toHaveText(
        "6,000 Grd"
    );
});

test("failed replacements keep the rows, resolve the pending controls, and retry the failed scope", async ({
    page,
}) => {
    await prepare(page);
    await page.route("**/api/rankings?*metric=rating*", (route) =>
        route.fulfill({
            status: 503,
            json: {
                isSuccess: false,
                code: "UNAVAILABLE",
                message: "Unavailable",
                result: null,
            },
        })
    );
    await page
        .getByRole("button", { name: "NosLog 레이팅", exact: true })
        .click();
    await expect(
        page.locator(".nl-global-rankings [role=alert]")
    ).toContainText("랭킹을 불러오지 못했습니다.");
    await expect(page.locator(".nl-player-row")).toHaveCount(25);
    await expect(
        page.getByRole("button", { name: "공식 Grd", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    await page.unroute("**/api/rankings?*metric=rating*");
    await page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(page.locator(".nl-player-row__value").first()).toHaveText(
        "10,000 pt"
    );
    await expect(page.locator(".nl-global-rankings [role=alert]")).toHaveCount(
        0
    );
    await expect(page.locator("#global-ranking-results")).toBeFocused();
});

for (const count of [0, 1, 25, 26])
    test(`${count} players retain correct empty and pagination boundaries`, async ({
        page,
    }) => {
        await prepare(page, { count, mine: 999 });
        await expect(page.locator(".nl-player-row")).toHaveCount(
            Math.min(count, 25)
        );
        await expect(page.locator(".nl-pagination")).toHaveCount(
            count > 25 ? 1 : 0
        );
        await expect(
            page.locator(".nl-ranking-personal--unavailable")
        ).toHaveCount(count ? 1 : 0);
        if (!count)
            await expect(
                page.locator(".nl-global-rankings [role=status]")
            ).toHaveText("선택한 조건의 랭킹 기록이 없습니다.");
    });

test("unavailable Rating has a distinct recovery action and guests retain an exact login return", async ({
    page,
}) => {
    await prepare(page, { guest: true });
    await expect(page.locator(".nl-ranking-login a")).toHaveAttribute(
        "href",
        "/ko/login?returnTo=%2Fko%2Frankings%3Fmode%3Dbasic%26region%3Dall%26page%3D1"
    );
    await page.route("**/api/rankings?*metric=rating*", (route) =>
        respond(route, { unavailable: true, guest: true })
    );
    await page
        .getByRole("button", { name: "NosLog 레이팅", exact: true })
        .click();
    await expect(page.locator(".nl-player-row")).toHaveCount(0);
    await expect(
        page.locator("#global-ranking-results [role=status]")
    ).toContainText("NosLog 레이팅을 일시적으로 이용할 수 없습니다.");
    await page
        .locator("#global-ranking-results")
        .getByRole("button", { name: "공식 Grd 보기", exact: true })
        .click();
    await expect(page.locator(".nl-player-row")).toHaveCount(25);
});

for (const locale of ["ko", "ja", "en"])
    for (const theme of ["dark", "light"])
        test(`${locale} ${theme} respects Figma geometry, text styles, and accessible reflow`, async ({
            page,
        }, testInfo) => {
            test.skip(
                testInfo.project.name === "desktop-chromium",
                "This matrix explicitly covers narrow and wide widths."
            );
            await page.addInitScript(
                (value) => localStorage.setItem("noslog-theme", value),
                theme
            );
            await prepare(page, { count: 1284, mine: 1026 }, locale);
            await expect(page.locator("html")).toHaveAttribute(
                "data-theme",
                theme
            );
            for (const width of [320, 390, 768, 1024, 1280]) {
                await page.setViewportSize({ width, height: 900 });
                await page.evaluate(() => document.fonts.ready);
                const paginationWidth = await page
                    .locator(".nl-pagination")
                    .evaluate(
                        (element) => element.getBoundingClientRect().width
                    );
                await expect(
                    page.locator(".nl-pagination__controls")
                ).toHaveCSS("width", paginationWidth < 356 ? "252px" : "356px");
                const geometry = await page.evaluate(() => {
                    const list = document.querySelector<HTMLElement>(
                        ".nl-global-ranking-list"
                    )!;
                    const rows = [
                        ...list.querySelectorAll<HTMLElement>(".nl-player-row"),
                    ];
                    const badge =
                        document.querySelector<HTMLElement>(".nl-exam-badge")!;
                    const region =
                        document.querySelector<HTMLElement>(
                            ".nl-compact-select"
                        )!;
                    const personal = document.querySelector<HTMLElement>(
                        ".nl-ranking-personal"
                    )!;
                    const summary = personal
                        .querySelector<HTMLElement>(
                            ".nl-ranking-personal__summary"
                        )!
                        .getBoundingClientRect();
                    const action = personal
                        .querySelector<HTMLElement>("a")!
                        .getBoundingClientRect();
                    return {
                        overflow:
                            document.documentElement.scrollWidth -
                            document.documentElement.clientWidth,
                        rows: rows.map(
                            (row) => row.getBoundingClientRect().height
                        ),
                        step:
                            rows[1].getBoundingClientRect().top -
                            rows[0].getBoundingClientRect().top,
                        listWidth: list.getBoundingClientRect().width,
                        badge: badge.getBoundingClientRect().height,
                        regionHeight: region.getBoundingClientRect().height,
                        regionShadow: getComputedStyle(region).boxShadow,
                        firstWeight: getComputedStyle(
                            rows[0].querySelector(".nl-player-row__rank")!
                        ).fontWeight,
                        otherWeight: getComputedStyle(
                            rows.at(-1)!.querySelector(".nl-player-row__rank")!
                        ).fontWeight,
                        font: getComputedStyle(list).fontFamily,
                        summaryGeometry: {
                            right: personal.getBoundingClientRect().right,
                            summaryRight: summary.right,
                            actionLeft: action.left,
                            actionRight: action.right,
                        },
                        summary: document
                            .querySelector(".nl-ranking-personal")!
                            .getBoundingClientRect().height,
                    };
                });
                expect(geometry.overflow).toBeLessThanOrEqual(1);
                expect(geometry.rows.every((height) => height === 72)).toBe(
                    true
                );
                expect(geometry.step).toBe(geometry.listWidth >= 720 ? 73 : 72);
                expect(geometry.badge).toBe(24);
                expect(geometry.regionHeight).toBe(44);
                expect(geometry.regionShadow).toContain("1px");
                expect(geometry.firstWeight).toBe("600");
                expect(geometry.font).toContain("Pretendard JP Variable");
                expect(geometry.summary).toBe(56);
                expect(
                    geometry.summaryGeometry.summaryRight
                ).toBeLessThanOrEqual(geometry.summaryGeometry.actionLeft);
                expect(
                    geometry.summaryGeometry.actionRight
                ).toBeLessThanOrEqual(geometry.summaryGeometry.right - 15);
                if (width === 320 || width === 1280) {
                    const audit = await new AxeBuilder({ page })
                        .include(".nl-global-rankings")
                        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                        .analyze();
                    expect(
                        audit.violations.map((violation) => ({
                            id: violation.id,
                            targets: violation.nodes.map((node) => node.target),
                        }))
                    ).toEqual([]);
                }
                if (width === 390 || width === 1280)
                    await page.screenshot({
                        path: testInfo.outputPath(
                            `p5-${locale}-${theme}-${width}.png`
                        ),
                        fullPage: true,
                    });
            }
        });
