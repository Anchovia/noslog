import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { getMessages } from "@/lib/i18n/messages";
import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

// 이벤트 게시판(2026-09-18 L1 · H1). prisma/seed-e2e.mjs 의 이벤트 픽스처 — 실행 시각 기준 상대 날짜:
// 진행 중 3(곧 끝남 +2 · 오래 열림 +5 · 공개판 유지 +20) · 예정 1 · 종료 1, 고친 판 검토 중 1 · 반려 1 · 임시저장 1
const LIVE = [
    "E2E 진행 중 이벤트 — 곧 끝남",
    "E2E 진행 중 이벤트 — 오래 열림",
    "E2E 공개판 유지 이벤트",
];
const HIDDEN = [
    "E2E 고친 판(검토 중)",
    "E2E 반려 이벤트",
    "E2E 임시저장 이벤트",
];

function cardTitles(page: Page) {
    return page.locator(".nl-event-card .nl-entity-title").allTextContents();
}

test("guests see live events by closing date, a locked write button and no hidden posts", async ({
    page,
}) => {
    const t = getMessages("ko");
    await page.goto("/ko/events");
    await expectPageLoaded(page);
    // 「소식」 입구 탭(2026-09-26 N1 · E1) — 제목은 「소식」, 공지사항 · 이벤트 탭 아래 상태 칩
    await expect(page.locator("h1")).toHaveText(t["news.title"]);
    const newsTabs = page.locator(".nl-tabs__item");
    await expect(newsTabs).toHaveText([
        t["home.announcements"],
        t["events.title"],
    ]);
    await expect(newsTabs.last()).toHaveAttribute("aria-current", "page");
    expect(await cardTitles(page)).toEqual(LIVE);
    for (const title of HIDDEN)
        await expect(page.locator("body")).not.toContainText(title);

    const tabs = page.locator(".nl-chips .nl-chip");
    await expect(tabs).toHaveText([
        `${t["events.phase.live"]} 3`,
        `${t["events.phase.upcoming"]} 1`,
        `${t["events.phase.ended"]} 1`,
    ]);
    await expect(tabs.first()).toHaveAttribute("aria-current", "page");

    // 쓸 수 없으면 비활성 버튼 + 이유 한 줄(로그아웃)
    await expect(
        page.getByRole("button", { name: t["events.write"] })
    ).toBeDisabled();
    await expect(page.locator(".nl-page-heading")).toContainText(
        t["events.lock.login"]
    );
    await expect(
        page.getByRole("link", { name: t["events.mine"] })
    ).toHaveCount(0);
    await expect(page.locator(".nl-event-card img")).toHaveCount(1);
    await expectNoHorizontalOverflow(page);
    expect(
        (await new AxeBuilder({ page }).include(".nl-events").analyze())
            .violations
    ).toEqual([]);
});

test("cards take one column on phones and two from 672", async ({ page }) => {
    await page.goto("/ko/events");
    for (const [width, columns] of [
        [390, 1],
        [672, 2],
        [1280, 2],
    ] as const) {
        await page.setViewportSize({ width, height: 900 });
        const tops = await page
            .locator(".nl-event-card")
            .evaluateAll((cards) =>
                cards.map((card) =>
                    Math.round(card.getBoundingClientRect().top)
                )
            );
        expect(tops.filter((top) => top === tops[0])).toHaveLength(columns);
        // 배너 2.4 : 1
        const ratio = await page
            .locator(".nl-event-banner")
            .first()
            .evaluate((el) => el.clientWidth / el.clientHeight);
        expect(ratio).toBeCloseTo(2.4, 1);
        await expectNoHorizontalOverflow(page);
    }
});

test("tabs are addresses and unknown tabs fall back to live", async ({
    page,
}) => {
    await page.goto("/ko/events?tab=upcoming");
    expect(await cardTitles(page)).toEqual(["E2E 예정 이벤트"]);
    await page.goto("/ko/events?tab=ended");
    expect(await cardTitles(page)).toEqual(["E2E 종료 이벤트"]);
    await page.goto("/ko/events?tab=nope");
    await expect(page).toHaveURL(/\/ko\/events$/);
    await page.goto("/ko/events?tab=live");
    await expect(page).toHaveURL(/\/ko\/events$/);
});

test("the detail keeps the approved version while an edit is under review", async ({
    page,
}) => {
    const t = getMessages("ko");
    await page.goto("/ko/events");
    await page.getByRole("link", { name: /E2E 공개판 유지 이벤트/ }).click();
    await expect(page).toHaveURL(/\/ko\/events\/\d+$/);
    await expectPageLoaded(page);
    await expect(page.locator("h1")).toHaveText("E2E 공개판 유지 이벤트");
    await expect(page.locator("body")).not.toContainText("고친 본문");
    // 상태 태그 = 테두리 태그 + 색 점(T3)
    const tag = page.locator(".nl-tag--status");
    await expect(tag).toHaveText(t["events.phase.live"]);
    await expect(tag).toHaveAttribute("data-tone", "success");
    expect(
        await tag.evaluate((el) => getComputedStyle(el, "::before").width)
    ).toBe("8px");
    await expect(page.locator(".nl-announcement-body h2")).toHaveText("규칙");
    // 작성자가 아니면 고치기 · 검토 안내 없음
    await expect(page.locator(".nl-status")).toHaveCount(0);
    await expect(
        page.getByRole("link", { name: t["events.editor.edit"] })
    ).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    expect(
        (await new AxeBuilder({ page }).include(".nl-events").analyze())
            .violations
    ).toEqual([]);
});

test("unpublished, rejected and malformed ids are not found", async ({
    page,
}) => {
    for (const id of ["999999", "abc", "01"]) {
        const response = await page.goto(`/ko/events/${id}`);
        expect(response?.status()).toBe(404);
    }
});

test("author pages send guests back to the board", async ({ page }) => {
    for (const path of [
        "/ko/events/new",
        "/ko/events/mine",
        "/ko/events/1/edit",
    ]) {
        await page.goto(path);
        await expect(page).toHaveURL(/\/ko\/events$/);
    }
});

test("Home shows the two live events closing first under the announcements", async ({
    page,
}) => {
    const t = getMessages("ko");
    await page.goto("/ko");
    await expectPageLoaded(page);
    const section = page.locator(".nl-home-events");
    await expect(section.locator("h2")).toHaveText(t["home.liveEvents"]);
    await expect(section.locator(".nl-home-event .nl-entity-title")).toHaveText(
        LIVE.slice(0, 2)
    );
    await expect(
        section.getByRole("link", { name: t["home.allEvents"] })
    ).toHaveAttribute("href", "/ko/events");
    // 공지사항 구역 바로 아래(공지가 없어 구역이 없으면 맨 위), 공식 소식보다 위
    const order = await page
        .locator(".nl-home-updates > section")
        .evaluateAll((sections) => sections.map((s) => s.className));
    const announcements = order.findIndex((name) =>
        name.includes("nl-home-announcements")
    );
    expect(order.findIndex((name) => name.includes("nl-home-events"))).toBe(
        announcements + 1
    );
    // 글자 아래 어두운 층 + 흐림
    const caption = section.locator(".nl-home-event__caption").first();
    expect(
        await caption.evaluate((el) => getComputedStyle(el).backgroundImage)
    ).toContain("linear-gradient");
    expect(
        await caption.evaluate(
            (el) => getComputedStyle(el, "::before").backdropFilter
        )
    ).toBe("blur(12px)");
    await expectNoHorizontalOverflow(page);
});

for (const locale of ["ja", "en"] as const) {
    test(`${locale} board is translated`, async ({ page }) => {
        const t = getMessages(locale);
        await page.goto(`/${locale}/events`);
        await expectPageLoaded(page);
        await expect(page.locator("h1")).toHaveText(t["news.title"]);
        await expect(page.locator(".nl-chips .nl-chip").first()).toContainText(
            t["events.phase.live"]
        );
    });
}
