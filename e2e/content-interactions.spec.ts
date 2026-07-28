import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

test("빙고 상태 필터와 진행순 정렬을 변경한다", async ({ page }) => {
    await page.goto("/ko/bingo");
    await expectPageLoaded(page);

    const sortButton = page.getByRole("button", {
        name: /진행률 .* 순으로 변경/,
    });
    const initialSortLabel = await sortButton.getAttribute("aria-label");

    await sortButton.click();
    await expect(sortButton).not.toHaveAttribute(
        "aria-label",
        initialSortLabel ?? ""
    );

    const progressFilter = page.getByRole("button", { name: /진행 중/ });
    await progressFilter.click();
    await expect(progressFilter).toHaveClass(/bg-text-primary/);
    await expectNoHorizontalOverflow(page);
});

test("검정 선택 항목을 아코디언으로 열고 닫는다", async ({ page }) => {
    await page.goto("/ko/exams");
    await expectPageLoaded(page);

    await expect(
        page.getByRole("button", { name: "Basic", exact: true })
    ).toHaveClass(/bg-text-primary/);

    const selector = page.locator("main button[aria-expanded]").first();
    const stageTable = page.getByText("과제곡", { exact: true });

    if ((await stageTable.count()) === 0) {
        await expect(page.getByText("등록된 검정이 없습니다.")).toBeVisible();
        return;
    }

    await expect(stageTable).toBeVisible();

    // 최신 아코디언 UI에서는 선택 상태와 상세 영역이 함께 전환되는지 확인함
    if ((await selector.count()) > 0) {
        await expect(selector).toHaveAttribute("aria-expanded", "true");
        await selector.click();
        await expect(selector).toHaveAttribute("aria-expanded", "false");
        await expect(stageTable).not.toBeVisible();

        await selector.click();
        await expect(selector).toHaveAttribute("aria-expanded", "true");
        await expect(stageTable).toBeVisible();
    }

    await expectNoHorizontalOverflow(page);
});

test("비로그인 통합 서열표에서 모드와 목표 필터를 제공한다", async ({
    page,
}) => {
    await page.goto("/ko/tiers");
    await expectPageLoaded(page);

    await expect(
        page.getByRole("button", { name: "Basic", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    const goalSelect = page.getByRole("combobox", { name: "목표" });
    await expect(goalSelect).toHaveValue("s");
    await expect(
        page.getByRole("button", { name: "난이도 · 전체" })
    ).toBeVisible();
    await expect(
        page.getByRole("button", { name: "레벨 · 전체" })
    ).toBeVisible();

    const tierRegion = page.getByRole("region", { name: "서열표 구간" });
    if ((await tierRegion.count()) === 0) {
        await expect(
            page.getByText("선택한 목표의 공개 서열표가 없습니다.")
        ).toBeVisible();
        return;
    }

    await expect(tierRegion.getByRole("heading").first()).toBeVisible();
    await goalSelect.selectOption("fc");
    await expect(page).toHaveURL(/\/ko\/tiers\?goal=fc$/);
    await expect(goalSelect).toHaveValue("fc");
    await expectNoHorizontalOverflow(page);
});
