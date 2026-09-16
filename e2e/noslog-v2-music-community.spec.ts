import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { reviewThemes } from "./helpers";
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
            (mode === "basic"
                ? (["s", "990k", "pianist"] as const)
                : (["pianist"] as const)
            ).map((goal) => ({
                mode,
                goal,
                placement:
                    goal === "s"
                        ? "published"
                        : goal === "990k"
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
                ownVote: goal === "990k" ? 13.2 : null,
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
        fromTiers = false,
        failure,
    }: {
        locale?: string;
        data?: CommunityData;
        guest?: boolean;
        fromTiers?: boolean;
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
        // 의견은 최신순 하나(2026-09-16) — 고정 데이터 순서가 최신순
        const rows = opinions;
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
    await page.goto(
        `/${locale}${musicPath}${fromTiers ? "?source=tiers&mode=basic&goal=s" : ""}`
    );
    // 영역 탭은 모든 폭에서 탭(좁으면 가로 스크롤) — 부품 결정 ② 2026-09-14
    await expect(page.getByRole("tab")).toHaveCount(4);
    await page.getByRole("tab").last().click();
    if (failure === "initial")
        await expect(
            page.getByRole("alert").filter({ hasText: "불러오지 못했습니다." })
        ).toBeVisible();
    else await expect(page.locator(".nl-pattern-form")).toBeVisible();
}

// 서열 배치 값은 머리 수치 띠(서버 데이터)로 옮겼다 — 평가 탭 실패는 투표 · 의견만 다시 불러온다 (2026-09-16)
test("Community failure retries without fabricated empty states", async ({
    page,
}) => {
    await openCommunity(page, { failure: "initial" });
    await expect(page.locator(".nl-community-panel")).not.toContainText(
        "미등재"
    );
    await expect(page.locator(".nl-pattern-form")).toHaveCount(0);
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
    await page.locator("button.nl-vote-row").first().click();
    await expect(
        page.locator(".nl-vote-distribution table tbody tr")
    ).toHaveCount(9);
    // 자격이 없으면 입력도 이유 문장도 없다(2026-09-16 A) — 로그아웃은 제목 줄 오른쪽 끝 제목 링크(D)
    await expect(page.locator(".nl-vote-form")).toHaveCount(0);
    await expect(
        page
            .locator(".nl-community-votes .nl-heading-row")
            .getByRole("link", { name: "로그인하고 투표하기", exact: true })
    ).toBeVisible();
    await expect(
        page.locator(".nl-scale-picker__option").first()
    ).toBeDisabled();
    // 평가할 수 없으면 목록을 흐리고 가운데 카드로 이유 · 로그인 (2026-09-17 L2)
    const lock = page.locator(".nl-pattern-lock");
    await expect(lock).toHaveAttribute("data-locked", "");
    await expect(lock.locator(".nl-pattern-axes")).toHaveCSS(
        "filter",
        "blur(5px)"
    );
    await expect(lock.locator(".nl-pattern-lock__card")).toContainText(
        "로그인하고 패턴을 평가해 보세요"
    );
    await expect(
        lock.getByRole("link", { name: "로그인", exact: true })
    ).toBeVisible();
    await expect(page.locator(".nl-opinions")).toContainText(
        "로그인하면 의견을 남길 수 있습니다."
    );
    await page.unrouteAll({ behavior: "wait" });
    await openCommunity(page, { data });
    await page.locator("button.nl-vote-row").first().click();
    await expect(page.locator(".nl-vote-distribution")).toHaveCount(1);
    await expect(page.locator(".nl-vote-form")).toHaveCount(0);
    data.canEvaluate = true;
    data.scopes[0].eligible = false;
    await page.unrouteAll({ behavior: "wait" });
    await openCommunity(page, { data });
    await page.locator("button.nl-vote-row").first().click();
    await expect(page.locator(".nl-vote-distribution")).toHaveCount(1);
    await expect(page.locator(".nl-vote-form")).toHaveCount(0);
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
    await rows.nth(0).click();
    await expect(page.locator(".nl-vote-distribution")).toHaveCount(1);
    await expect(rows.nth(1)).toHaveAttribute("aria-expanded", "false");
    await expect(
        page.locator(".nl-vote-row").filter({ hasText: "집계 중" })
    ).toHaveCount(2);
});

test("Aggregating rows open with keyboard and offer the first vote without exposing a distribution", async ({
    page,
}) => {
    const data = fixture();
    for (const [index, scope] of data.scopes.entries()) {
        scope.count = index % 3;
        scope.average = null;
        scope.distribution = [];
        scope.ownVote = null;
        scope.eligible = true;
    }
    await openCommunity(page, { data, fromTiers: true });
    const rows = page.locator("button.nl-vote-row");
    await expect(rows).toHaveCount(4);
    await expect(rows.first()).toHaveAttribute("aria-expanded", "true");
    await rows.first().click();
    for (let index = 0; index < 4; index++) {
        await rows.nth(index).focus();
        await rows.nth(index).press("Enter");
        await expect(rows.nth(index)).toHaveAttribute("aria-expanded", "true");
        await expect(page.locator(".nl-vote-form")).toBeVisible();
        await expect(page.locator(".nl-vote-distribution")).toHaveCount(0);
        const input = page.locator(".nl-vote-form select");
        await expect(input).toHaveValue("");
        await page
            .getByRole("button", { name: "투표 저장", exact: true })
            .click();
        await expect(page.locator(".nl-vote-form [role=alert]")).toBeVisible();
        await input.selectOption("13.2");
        await page
            .getByRole("button", { name: "투표 저장", exact: true })
            .click();
        await expect(page.locator(".nl-vote-form [role=alert]")).toContainText(
            "로그인 후"
        );
        await expect(input).toHaveValue("13.2");
        await rows.nth(index).press("Space");
        await expect(rows.nth(index)).toHaveAttribute("aria-expanded", "false");
        await expect(page.locator(".nl-vote-form")).toHaveCount(0);
    }
});

test("Aggregating votes preserve login, record, eligibility, and existing-vote actions", async ({
    page,
}) => {
    const data = fixture();
    const scope = data.scopes[0];
    scope.count = 0;
    scope.average = null;
    scope.distribution = [];
    // 집계 중이고 할 수 있는 투표가 없으면 누르지 않는 줄(⌄ 없음)
    await openCommunity(page, { data, guest: true });
    await expect(page.locator(".nl-vote-row").first()).not.toHaveAttribute(
        "aria-expanded"
    );
    await expect(
        page.getByRole("link", { name: "로그인하고 투표하기", exact: true })
    ).toBeVisible();
    data.canEvaluate = false;
    await page.unrouteAll({ behavior: "wait" });
    await openCommunity(page, { data });
    await expect(page.locator(".nl-vote-row").first()).not.toHaveAttribute(
        "aria-expanded"
    );
    data.canEvaluate = true;
    scope.eligible = false;
    await page.unrouteAll({ behavior: "wait" });
    await openCommunity(page, { data });
    await expect(page.locator(".nl-vote-row").first()).not.toHaveAttribute(
        "aria-expanded"
    );
    await expect(page.locator(".nl-vote-form")).toHaveCount(0);
    scope.eligible = true;
    scope.count = 1;
    scope.ownVote = 13.2;
    await page.unrouteAll({ behavior: "wait" });
    await openCommunity(page, { data });
    await page.locator("button.nl-vote-row").first().click();
    const contribution = page.locator(".nl-vote-list__body");
    await expect(contribution).toContainText("내 투표13.2");
    await contribution
        .getByRole("button", { name: "수정", exact: true })
        .click();
    await expect(contribution.locator("select")).toHaveValue("13.2");
    await contribution
        .getByRole("button", { name: "투표 삭제", exact: true })
        .click();
    await expect(page.getByRole("dialog")).toContainText(
        "Basic S 투표만 삭제됩니다."
    );
    await page
        .getByRole("dialog")
        .getByRole("button", { name: "취소" })
        .click();
    await expect(
        contribution.getByRole("button", { name: "투표 삭제", exact: true })
    ).toBeFocused();
});

test("Pattern ratings distinguish zero from missing and keep rejected input", async ({
    page,
}) => {
    await openCommunity(page);
    // 축마다 숫자 버튼 0~4(라디오 묶음) — 값 없음은 아무것도 고르지 않은 상태로 0 과 다르다 (2026-09-17)
    const form = page.locator(".nl-pattern-form");
    const stairs = page.getByRole("radiogroup", { name: "계단", exact: true });
    const checked = stairs.locator('[aria-checked="true"]');
    await expect(checked).toHaveText("0");
    // 저장 버튼 · 양끝 말 라벨은 없다 — 누르면 바로 저장
    await expect(form.getByRole("button", { name: "평가 저장" })).toHaveCount(
        0
    );
    await expect(form).not.toContainText("매우 많음");
    // 같은 값을 다시 누르면 그 축만 해제
    const zero = stairs.getByRole("radio", { name: "0", exact: true });
    await zero.click();
    await expect(checked).toHaveCount(0);
    await expect(form.getByRole("status")).toContainText("저장 중");
    // 고른 값이 없으면 첫 값만 탭 순서, 방향키로 고르며 이동
    await zero.focus();
    await zero.press("ArrowRight");
    await expect(checked).toHaveText("1");
    // 서버가 거절하면(테스트는 로그인 세션 없음) 값은 그대로 두고 실패 + 다시 시도
    await expect(form.getByRole("status")).toContainText("저장하지 못했습니다");
    await expect(
        form.getByRole("button", { name: "다시 시도", exact: true })
    ).toBeVisible();
    await expect(checked).toHaveText("1");
    await expect(form.getByRole("textbox")).toHaveCount(0);
});

test("Clearing all pattern ratings asks for confirmation first", async ({
    page,
}) => {
    await openCommunity(page);
    // 「선택 해제」(제목 줄 오른쪽 끝) = 모든 축 지우기 → 확인창
    const trigger = page
        .locator(".nl-pattern-form .nl-heading-row")
        .getByRole("button", { name: "선택 해제", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText(
        "작성한 의견과 Basic·Recital의 목표별 투표는 유지됩니다."
    );
    await expect(dialog.getByRole("button", { name: "취소" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(
        page
            .getByRole("radiogroup", { name: "계단", exact: true })
            .locator('[aria-checked="true"]')
    ).toHaveText("0");
    await page.locator("button.nl-vote-row").nth(1).click();
    await page.getByRole("button", { name: "투표 삭제", exact: true }).click();
    await expect(dialog).toContainText("Basic 990k 투표만 삭제됩니다.");
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
    // 추천은 없앴다(2026-09-16) — 내 의견은 목록 안에서 그 자리에서 고친다
    const own = page.locator(".nl-opinion-row").first();
    await expect(own.getByRole("button", { name: /^추천/ })).toHaveCount(0);
    // 내 의견이 있으면 맨 위 새 작성 칸은 없다
    await expect(
        page.locator(".nl-opinions > .nl-opinion-composer")
    ).toHaveCount(0);
    await own.getByRole("button", { name: /의견 더보기/ }).click();
    await page.getByRole("menuitem", { name: "수정", exact: true }).click();
    const editor = own.getByRole("textbox", { name: "의견", exact: true });
    await expect(editor).toBeFocused();
    await expect(editor).toHaveValue(opinions[0].opinion);
    await editor.press("Escape");
    await expect(own.getByRole("textbox")).toHaveCount(0);
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
    for (const theme of reviewThemes) {
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
            const data = fixture();
            data.scopes[2].eligible = true;
            await openCommunity(page, { locale, data });
            await page.locator("button.nl-vote-row").nth(1).click();
            for (const width of [320, 390, 768, 1024, 1055, 1056, 1280, 1470]) {
                await page.setViewportSize({ width, height: 900 });
                await expect
                    .poll(() =>
                        page
                            .locator(".nl-community-columns")
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
                                window.innerWidth
                        )
                    )
                    .toBe(true);
                // 숫자 버튼 = 컨트롤 M 정사각(36 · 1056 이상 32)
                const option = page.locator(".nl-scale-picker__option").first();
                const size = width >= 1056 ? "32px" : "36px";
                await expect(option).toHaveCSS("height", size);
                await expect(option).toHaveCSS("width", size);
                if (width === 320 || width === 1280) {
                    const scan = await new AxeBuilder({ page })
                        .include(".nl-community-panel")
                        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                        .analyze();
                    expect(scan.violations).toEqual([]);
                }
                if (width === 390 || width === 1280) {
                    await page.evaluate(() =>
                        window.scrollTo({ top: 0, behavior: "instant" })
                    );
                    await expect
                        .poll(() => page.evaluate(() => scrollY))
                        .toBe(0);
                    await expect
                        .poll(async () =>
                            Math.round(
                                (await page
                                    .locator(".nl-header")
                                    .boundingBox())!.y
                            )
                        )
                        .toBe(0);
                    await page.screenshot({
                        path: testInfo.outputPath(
                            `${locale}-${theme}-tier-${width}.png`
                        ),
                        fullPage: true,
                    });
                }
                // Pianist 두 줄은 집계 중 · 자격 없음이라 누르지 않는 줄 — 펼칠 수 있는 줄은 둘
                await expect(page.locator("button.nl-vote-row")).toHaveCount(2);
                await page.locator("button.nl-vote-row").first().click();
                await expect(page.locator(".nl-vote-form__row")).toBeVisible();
                await expect(page.locator(".nl-vote-distribution")).toHaveCount(
                    1
                );
                expect(
                    await page.evaluate(
                        () =>
                            document.documentElement.scrollWidth <=
                            window.innerWidth
                    )
                ).toBe(true);
                if (width === 320 || width === 1280) {
                    const scan = await new AxeBuilder({ page })
                        .include(".nl-vote-list")
                        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                        .analyze();
                    expect(scan.violations).toEqual([]);
                }
                if (width === 390 || width === 1280)
                    await page.screenshot({
                        path: testInfo.outputPath(
                            `${locale}-${theme}-aggregation-${width}.png`
                        ),
                        fullPage: true,
                    });
                await page.locator("button.nl-vote-row").nth(1).click();
            }
        });
    }

test("A new opinion starts as one line, expands on focus, and cancels back", async ({
    page,
}) => {
    const data = fixture();
    data.currentEvaluation = { ...data.currentEvaluation!, opinion: "" };
    await openCommunity(page, { data });
    const input = page
        .locator(".nl-opinions > .nl-opinion-composer")
        .getByRole("textbox", { name: "의견", exact: true });
    // 쉬는 상태 = 한 줄 입력(컨트롤 높이)
    await expect
        .poll(() =>
            input.evaluate((element) => element.getBoundingClientRect().height)
        )
        .toBeLessThan(50);
    await input.focus();
    await expect(
        page.getByRole("button", { name: "의견 저장" })
    ).toBeDisabled();
    await input.fill("a".repeat(121));
    await page.getByRole("button", { name: "의견 저장" }).click();
    await expect(
        page.getByRole("alert").filter({ hasText: "최대 120자" })
    ).toBeVisible();
    await page.getByRole("button", { name: "취소", exact: true }).click();
    await expect(input).toHaveValue("");
    await expect(page.getByRole("button", { name: "의견 저장" })).toHaveCount(
        0
    );
});
