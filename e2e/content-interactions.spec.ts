import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

test("비로그인 빙고는 개인 필터 없이 공개 보드를 전부 보여 준다", async ({
    page,
}) => {
    await page.goto("/ko/bingo");
    await expectPageLoaded(page);
    const cards = page.locator(".nl-bingo-catalog__grid > li");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(12);
    await expect(
        page.getByRole("button", { name: "필터", exact: true })
    ).toHaveCount(0);
    await expect(
        page.getByRole("button", { name: "더 보기", exact: true })
    ).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
});

test("검정 선택을 바꾸고 뒤로가기로 이전 과제곡을 복원한다", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ko/exams");
    await expectPageLoaded(page);
    await expect(
        page.getByRole("radio", { name: "Basic", exact: true })
    ).toHaveAttribute("aria-checked", "true");
    await expect(
        page.getByRole("heading", { name: "Basic 10급", exact: true })
    ).toBeVisible();
    // 로그아웃이면 합격 인증은 제목 줄 끝 제목 링크 하나(빙고 · 이벤트 · 투표와 같은 모양)
    const proofRow = page
        .locator(".nl-exam-proof .nl-heading-row")
        .filter({ hasText: "합격 인증" });
    const proofLogin = proofRow.getByRole("link", {
        name: "로그인하고 인증하기",
        exact: true,
    });
    await expect(proofLogin).toHaveClass(/nl-heading-link/);
    await expect(proofLogin).toHaveAttribute(
        "href",
        "/ko/login?returnTo=%2Fko%2Fexams%2Fbasic-10"
    );
    await expect(page.locator(".nl-exam-proof .nl-button")).toHaveCount(0);
    await page
        .getByRole("combobox", { name: "검정 선택", exact: true })
        .click();
    await page.getByRole("option").filter({ hasText: /^9급/ }).click();
    await expect(page).toHaveURL(/\/ko\/exams\/basic-9$/);
    await expect(
        page.getByRole("heading", { name: "Basic 9급", exact: true })
    ).toBeVisible();
    await expect(
        page
            .getByRole("region", { name: "과제곡", exact: true })
            .getByRole("link")
    ).toHaveCount(3);
    await page.goBack();
    await expect(
        page.getByRole("heading", { name: "Basic 10급", exact: true })
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    // 1056 이상 상자에서 로그아웃 제목 줄은 하나뿐이라 위아래 안쪽이 같다
    await page.setViewportSize({ width: 1280, height: 900 });
    const insets = await page
        .locator(".nl-exam-proof")
        .first()
        .evaluate((box) => {
            const outer = box.getBoundingClientRect();
            const row = box.querySelector(".nl-heading-row")!;
            const inner = row.getBoundingClientRect();
            return [inner.top - outer.top, outer.bottom - inner.bottom];
        });
    expect(insets).toEqual([16, 16]);
});

test("개발자 문서 표는 칸 글자를 중간에서 꺾지 않고 표만 가로로 민다", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ko/developer");
    await expectPageLoaded(page);
    const cells = page.locator(".nl-announcement-body :is(th, td)");
    await expect(cells.first()).toBeVisible();
    // 본문은 anywhere 라도 표 칸은 normal — 긴 코드 칸은 칸 대신 표 둘레가 가로로 민다
    const wraps = await cells.evaluateAll((nodes) =>
        nodes.map((node) => getComputedStyle(node).overflowWrap)
    );
    expect([...new Set(wraps)]).toEqual(["normal"]);
    expect(
        await page
            .locator(".nl-announcement-body__table")
            .evaluateAll((tables) =>
                tables.some((table) => table.scrollWidth > table.clientWidth)
            )
    ).toBe(true);
    await expectNoHorizontalOverflow(page);
});

test("비로그인 통합 서열표에서 모드와 목표 필터를 제공한다", async ({
    page,
}) => {
    await page.goto("/ko/tiers");
    await expectPageLoaded(page);

    // 모드 · 목표는 제목 스위처 하나로 고른다(2026-09-22 ④ — tier-list-switcher.tsx)
    await expect(
        page.getByRole("heading", { level: 1, name: "S 서열표", exact: true })
    ).toBeVisible();
    const listSelect = page.getByRole("combobox", {
        name: "서열표 선택",
        exact: true,
    });
    await expect(listSelect).toHaveText("S 서열표");
    await expect(
        page.getByRole("button", { name: "필터", exact: true })
    ).toBeVisible();
    await expect(
        page.getByRole("radiogroup", { name: "보기 방식", exact: true })
    ).toBeVisible();
    await listSelect.click();
    await page
        .getByRole("option", { name: "990k 서열표", exact: true })
        .click();
    await expect(page).toHaveURL(/(?:\?|&)goal=990k(?:&|$)/);
    await expect(listSelect).toHaveText("990k 서열표");
    await expectNoHorizontalOverflow(page);
});
