import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

test("비로그인 빙고는 개인 필터 없이 공개 보드를 더 불러온다", async ({
    page,
}) => {
    await page.goto("/ko/bingo");
    await expectPageLoaded(page);
    const cards = page.locator(".nl-bingo-catalog__grid > li");
    await expect(cards).toHaveCount(12);
    await expect(
        page.getByRole("button", { name: "필터", exact: true })
    ).toHaveCount(0);
    await page.getByRole("button", { name: "더 보기", exact: true }).click();
    await expect(cards).toHaveCount(24);
    await expect(page).toHaveURL(/count=24/);
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
});

test("비로그인 통합 서열표에서 모드와 목표 필터를 제공한다", async ({
    page,
}) => {
    await page.goto("/ko/tiers");
    await expectPageLoaded(page);

    await expect(
        page.getByRole("radio", { name: "Basic", exact: true })
    ).toHaveAttribute("aria-checked", "true");
    const goalSelect = page.getByRole("combobox", { name: "목표" });
    await expect(goalSelect).toHaveText("S");
    await expect(
        page.getByRole("button", { name: "필터", exact: true })
    ).toBeVisible();
    await expect(
        page.getByRole("checkbox", { name: "상세 보기", exact: true })
    ).toBeVisible();
    await goalSelect.click();
    await page.getByRole("option", { name: "Full Combo", exact: true }).click();
    await expect(page).toHaveURL(/(?:\?|&)goal=fc(?:&|$)/);
    await expect(goalSelect).toHaveText("Full Combo");
    await expectNoHorizontalOverflow(page);
});
