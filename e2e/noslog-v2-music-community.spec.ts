import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import type {
    CommunityData,
    OpinionPage,
} from "@/features/music/schemas/communitySchema";

const musicPath = "/music/bfdaadfb98501907925ecf41a076108d/expert";
const axes = {
    stairs: null,
    repetition: null,
    polyrhythm: null,
    offset: null,
    chords: null,
};
const pattern = Object.fromEntries(
    Object.keys(axes).map((axis) => [axis, { count: 0, average: null }])
) as CommunityData["pattern"];
const opinions: OpinionPage["items"] = Array.from(
    { length: 22 },
    (_, index) => ({
        id: 100 + index,
        opinion: `Opinion ${index + 1}: 後半のリズム変化と連打に注意してください。 긴 문장도 화면 너비 안에서 읽을 수 있어야 합니다.`,
        createdAt: "2026-08-10T10:00:00Z",
        updatedAt: "2026-08-11T10:00:00Z",
        edited: index === 0,
        user: {
            id: 900 + index,
            username:
                index === 0
                    ? "긴사용자이름_LongJapaneseプレイヤー"
                    : `PLAYER_${index + 1}`,
            avatar: null,
        },
        helpfulCount: 22 - index,
        viewerHelpful: false,
        own: index === 0,
        canReact: index !== 0,
    })
);
const distribution = [12.0, 12.3, 12.8, 12.9, 13.0, 13.1, 13.3, 13.5, 13.8].map(
    (value, index) => ({ value, count: index === 4 ? 20 : index + 1 })
);
function fixture(): CommunityData {
    return {
        pattern,
        canEvaluate: true,
        currentEvaluation: {
            ...axes,
            stairs: 0,
            opinion: opinions[0].opinion,
            excluded: false,
        },
        scopes: (["basic", "recital"] as const).flatMap((mode) =>
            (["s", "fc", "pianist"] as const).map((goal) => ({
                mode,
                goal,
                placement:
                    goal === "s"
                        ? "published"
                        : goal === "fc"
                          ? "not-listed"
                          : "not-published",
                officialValue: goal === "s" ? 13.5 : null,
                count:
                    goal === "pianist"
                        ? 2
                        : distribution.reduce(
                              (sum, entry) => sum + entry.count,
                              0
                          ),
                average: goal === "pianist" ? null : 13.0,
                distribution: goal === "pianist" ? [] : distribution,
                eligible: goal !== "pianist",
                ownVote: goal === "fc" ? 13.2 : null,
            }))
        ),
        history: Array.from({ length: 18 }, (_, index) => ({
            id: 20 - index,
            mode: index % 2 ? "recital" : "basic",
            goal: "s",
            previousValue: index === 17 ? null : 13.0,
            value: index === 0 ? null : 13.5,
            effectiveAt: `2026-08-${String(20 - Math.floor(index / 2)).padStart(2, "0")}T10:00:00Z`,
        })),
        opinions: {
            items: opinions.slice(0, 10),
            total: opinions.length,
            nextOffset: 10,
        },
    };
}

async function openCommunity(
    page: Page,
    {
        locale = "ko",
        data = fixture(),
        guest = false,
        failure,
    }: {
        locale?: string;
        data?: CommunityData;
        guest?: boolean;
        failure?: "initial" | "more";
    } = {}
) {
    let failed = false;
    await page.route("**/api/music-detail?**", async (route) => {
        const response = await route.fetch();
        const body = await response.json();
        await route.fulfill({
            json: {
                ...body,
                result: {
                    ...body.result,
                    accountId: guest ? undefined : 900,
                    isLoggedIn: !guest,
                    community: failure === "initial" ? undefined : data,
                },
            },
        });
    });
    await page.route("**/api/music-community?**", async (route) => {
        const url = new URL(route.request().url());
        if (url.searchParams.get("area") === "pattern")
            return route.fulfill({
                json: {
                    isSuccess: true,
                    code: "ok",
                    message: "",
                    result: { pattern },
                },
            });
        const offset = Number(url.searchParams.get("offset") ?? 0);
        if (
            (failure === "initial" && !url.searchParams.has("area")) ||
            (!failed && failure === "more" && offset === 10)
        ) {
            failed = true;
            return route.fulfill({
                status: 503,
                json: {
                    isSuccess: false,
                    code: "unavailable",
                    message: "Unavailable",
                    result: null,
                },
            });
        }
        const rows =
            url.searchParams.get("sort") === "newest"
                ? [...opinions].reverse()
                : opinions;
        const result =
            url.searchParams.get("area") === "opinions"
                ? {
                      items: rows.slice(offset, offset + 10),
                      total: rows.length,
                      nextOffset:
                          offset + 10 < rows.length ? offset + 10 : null,
                  }
                : data;
        await route.fulfill({
            json: { isSuccess: true, code: "ok", message: "", result },
        });
    });
    await page.goto(`/${locale}${musicPath}`);
    if ((page.viewportSize()?.width ?? 390) < 768) {
        await page
            .getByRole("combobox", {
                name:
                    locale === "ko"
                        ? "상세 영역"
                        : locale === "ja"
                          ? "詳細項目"
                          : "Detail area",
            })
            .click();
        await page.getByRole("option").last().click();
    } else {
        await expect(page.getByRole("tab")).toHaveCount(4);
        await page.getByRole("tab").last().click();
    }
    if (failure === "initial")
        await expect(
            page.getByRole("alert").filter({ hasText: "불러오지 못했습니다." })
        ).toBeVisible();
    else await expect(page.locator(".nl-pattern-form")).toBeVisible();
}

test("Community failure keeps six unknown placements and retries without fabricated empty states", async ({
    page,
}) => {
    await openCommunity(page, { failure: "initial" });
    await expect(page.locator(".nl-tier-placement dd")).toHaveText([
        "—",
        "—",
        "—",
        "—",
        "—",
        "—",
    ]);
    await expect(page.locator(".nl-tier-placements .nl-skeleton")).toHaveCount(
        0
    );
    await expect(page.locator(".nl-community-panel")).not.toContainText(
        "미등재"
    );
    await page.route("**/api/music-community?**", (route) =>
        route.fulfill({
            json: {
                isSuccess: true,
                code: "ok",
                message: "",
                result: fixture(),
            },
        })
    );
    await page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(page.locator(".nl-pattern-form")).toBeVisible();
    await expect(page.locator(".nl-tier-placement dd").first()).toHaveText(
        "13.5"
    );
});

test("An incremental opinion failure retains the ten existing rows and retries the same window", async ({
    page,
}) => {
    await openCommunity(page, { failure: "more" });
    await page
        .getByRole("button", { name: "의견 더 보기", exact: true })
        .click();
    await expect(page.locator(".nl-opinions [role=alert]")).toBeVisible();
    await expect(page.locator(".nl-opinion-row")).toHaveCount(10);
    await page.getByRole("button", { name: "다시 시도", exact: true }).click();
    await expect(page.locator(".nl-opinion-row")).toHaveCount(20);
});

test("Guest, missing-record, and unachieved-goal states keep the public evidence readable", async ({
    page,
}) => {
    const data = fixture();
    data.currentEvaluation = null;
    data.history = [];
    data.canEvaluate = false;
    await openCommunity(page, { data, guest: true });
    await expect(page.locator(".nl-tier-placements details")).toHaveCount(0);
    await expect(page.locator(".nl-tier-placements")).toContainText(
        "변경 이력 없음"
    );
    await page.locator("button.nl-vote-row").first().click();
    await expect(
        page.locator(".nl-vote-distribution table tbody tr")
    ).toHaveCount(9);
    await expect(page.locator(".nl-vote-contribution").first()).toContainText(
        "로그인하면 이 목표에 투표할 수 있습니다."
    );
    await expect(page.locator(".nl-pattern-form input").first()).toBeDisabled();
    await expect(page.locator(".nl-pattern-form textarea")).toBeDisabled();
    await page.unrouteAll({ behavior: "wait" });
    await openCommunity(page, { data });
    await page.locator("button.nl-vote-row").first().click();
    await expect(page.locator(".nl-vote-contribution").first()).toContainText(
        "투표하려면 이 채보의 플레이 기록이 필요합니다."
    );
    data.canEvaluate = true;
    data.scopes[0].eligible = false;
    await page.unrouteAll({ behavior: "wait" });
    await openCommunity(page, { data });
    await page.locator("button.nl-vote-row").first().click();
    await expect(page.locator(".nl-vote-contribution").first()).toContainText(
        "Basic S 달성 기록이 있어야"
    );
});

test("Tier retains all six placement semantics and reveals one chronological history", async ({
    page,
}) => {
    await openCommunity(page);
    await expect(page.locator(".nl-tier-placement")).toHaveCount(6);
    await expect(page.locator(".nl-tier-placement dd")).toHaveText([
        "13.5",
        "미등재",
        "미공개",
        "13.5",
        "미등재",
        "미공개",
    ]);
    const history = page.locator(".nl-tier-placements details");
    await expect(history).not.toHaveAttribute("open");
    await history.locator("summary").press("Enter");
    await expect(history.locator("li")).toHaveCount(5);
    await expect(history.locator("li").first()).toContainText(
        "13.0 → 등재 제외"
    );
    const more = history.getByRole("button", { name: "이전 변경 더 보기" });
    await more.click();
    await expect(history.locator("li")).toHaveCount(15);
    await expect(more).toBeFocused();
    await more.click();
    await expect(history.locator("li")).toHaveCount(18);
    await expect(more).toHaveCount(0);
    await expect(history.locator("li").last()).toContainText("미등재 → 13.5");
});

test("Goal distributions preserve observed values and global bar scale while paging", async ({
    page,
}) => {
    await openCommunity(page);
    const rows = page.locator("button.nl-vote-row");
    await rows.nth(1).click();
    await expect(page.locator(".nl-vote-distribution")).toHaveCount(1);
    await expect(
        page.locator(".nl-vote-distribution table tbody tr")
    ).toHaveCount(9);
    await expect(page.locator(".nl-vote-distribution table")).not.toContainText(
        "12.1"
    );
    const before = await page
        .locator(".nl-vote-distribution__value")
        .evaluateAll((nodes) =>
            nodes.map((n) => ({
                value: n.lastElementChild?.textContent,
                height: n
                    .querySelector(".nl-vote-distribution__slot > span")
                    ?.getBoundingClientRect().height,
            }))
        );
    await page
        .getByRole("button", { name: "다음 투표 값", exact: true })
        .click();
    const after = await page
        .locator(".nl-vote-distribution__value")
        .evaluateAll((nodes) =>
            nodes.map((n) => ({
                value: n.lastElementChild?.textContent,
                height: n
                    .querySelector(".nl-vote-distribution__slot > span")
                    ?.getBoundingClientRect().height,
            }))
        );
    after.forEach((entry) => {
        const previous = before.find((item) => item.value === entry.value);
        if (previous) expect(entry.height).toBe(previous.height);
    });
    await expect(page.locator(".nl-vote-contribution")).toContainText(
        "내 투표13.2"
    );
    await rows.nth(2).click();
    await expect(page.locator(".nl-vote-distribution")).toHaveCount(1);
    await expect(rows.nth(1)).toHaveAttribute("aria-expanded", "false");
    await expect(
        page.locator(".nl-vote-row").filter({ hasText: "집계 중" })
    ).toHaveCount(2);
});

test("Pattern ratings distinguish zero from missing and keep rejected input", async ({
    page,
}) => {
    await openCommunity(page);
    const stairs = page.getByRole("radiogroup", { name: "계단", exact: true });
    await expect(
        stairs.getByRole("radio", { name: "0", exact: true })
    ).toBeChecked();
    await page
        .locator(".nl-pattern-axis")
        .first()
        .getByRole("button", { name: "선택 해제" })
        .click();
    await expect(stairs.locator("input:checked")).toHaveCount(0);
    await expect(stairs.getByRole("radio").first()).toBeFocused();
    await stairs.getByRole("radio").first().press("ArrowRight");
    await expect(
        stairs.getByRole("radio", { name: "1", exact: true })
    ).toBeChecked();
    await page
        .locator(".nl-pattern-axis")
        .first()
        .getByRole("button", { name: "선택 해제" })
        .click();
    const text = page.getByRole("textbox", { name: "의견 (선택)" });
    await text.fill("");
    await page.getByRole("button", { name: "평가 저장" }).click();
    await expect(
        page.getByRole("alert").filter({ hasText: "패턴을 하나 이상" })
    ).toBeVisible();
    await text.fill("a".repeat(121));
    await page.getByRole("button", { name: "평가 저장" }).click();
    await expect(
        page.getByRole("alert").filter({ hasText: "최대 120자" })
    ).toBeVisible();
    await text.fill("서버 거절 시에도 입력을 유지합니다.");
    await page.getByRole("button", { name: "평가 저장" }).click();
    await expect(
        page.getByRole("alert").filter({ hasText: "로그인 후" })
    ).toBeVisible();
    await expect(text).toHaveValue("서버 거절 시에도 입력을 유지합니다.");
});

test("Deletion confirms exact scope and cancellation restores focus", async ({
    page,
}) => {
    await openCommunity(page);
    const trigger = page.getByRole("button", {
        name: "평가 삭제",
        exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText(
        "Basic·Recital의 목표별 투표는 유지됩니다."
    );
    await expect(dialog.getByRole("button", { name: "취소" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.locator("button.nl-vote-row").nth(1).click();
    await page.getByRole("button", { name: "투표 삭제", exact: true }).click();
    await expect(dialog).toContainText("Basic 풀콤보 투표만 삭제됩니다.");
    await dialog.getByRole("button", { name: "취소" }).click();
});

test("Opinions append ten at a time and expose contextual author and report actions", async ({
    page,
}) => {
    await openCommunity(page);
    await expect(page.locator(".nl-opinion-row")).toHaveCount(10);
    await page.getByRole("button", { name: "의견 더 보기" }).click();
    await expect(page.locator(".nl-opinion-row")).toHaveCount(20);
    await expect(page.locator(".nl-opinion-row").nth(10)).toBeFocused();
    await page.getByRole("button", { name: "의견 더 보기" }).click();
    await expect(page.locator(".nl-opinion-row")).toHaveCount(22);
    await expect(
        page.getByRole("button", { name: "의견 더 보기" })
    ).toHaveCount(0);
    const own = page.locator(".nl-opinion-row").first();
    await expect(own.getByRole("button", { name: /^추천 / })).toBeDisabled();
    await own.getByRole("button", { name: /의견 더보기/ }).click();
    await page.getByRole("menuitem", { name: "수정", exact: true }).click();
    await expect(
        page.getByRole("textbox", { name: "의견 (선택)" })
    ).toBeFocused();
    await page
        .locator(".nl-opinion-row")
        .nth(1)
        .getByRole("button", { name: /의견 더보기/ })
        .click();
    await page.getByRole("menuitem", { name: "신고", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("dialog").getByRole("combobox").selectOption("other");
    await expect(
        page.getByRole("textbox", { name: "추가 설명 (선택)" })
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
});

for (const locale of ["ko", "ja", "en"])
    for (const theme of ["dark", "light"]) {
        test(`${locale} ${theme} community reflows and preserves accessible controls`, async ({
            page,
        }, testInfo) => {
            test.skip(
                testInfo.project.name !== "mobile-chromium",
                "The same multi-width matrix runs once per locale and theme."
            );
            await page.addInitScript(
                (theme) => localStorage.setItem("noslog-theme", theme),
                theme
            );
            await openCommunity(page, { locale });
            await page.locator("button.nl-vote-row").nth(1).click();
            for (const width of [320, 390, 768, 1024, 1280]) {
                await page.setViewportSize({ width, height: 900 });
                await expect
                    .poll(() =>
                        page.evaluate(
                            () =>
                                document.documentElement.scrollWidth <=
                                window.innerWidth
                        )
                    )
                    .toBe(true);
                await expect(
                    page.locator(".nl-pattern-axis").first()
                ).toHaveCSS("height", "133px");
                await expect(
                    page.locator(".nl-rating-scale input").first()
                ).toHaveCSS("height", "48px");
                if (width === 320 || width === 1280) {
                    const scan = await new AxeBuilder({ page })
                        .include(".nl-community-panel")
                        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                        .analyze();
                    expect(scan.violations).toEqual([]);
                }
                if (width === 390 || width === 1280)
                    await page.screenshot({
                        path: testInfo.outputPath(
                            `${locale}-${theme}-tier-${width}.png`
                        ),
                        fullPage: true,
                    });
            }
        });
    }
