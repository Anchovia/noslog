import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

test("빙고 상태 필터와 진행순 정렬을 변경한다", async ({ page }) => {
    await page.goto("/bingo");
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
    await page.goto("/exams");
    await expectPageLoaded(page);

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

test("비로그인 서열표 상세에 데이터 연동 안내를 표시한다", async ({ page }) => {
    await page.goto("/tiers");
    await expectPageLoaded(page);

    const firstTier = page.locator('a[href^="/tiers/"]').first();
    if ((await firstTier.count()) === 0) {
        await expect(page.getByText("공개된 서열표가 없습니다.")).toBeVisible();
        return;
    }

    await firstTier.click();
    await expect(
        page.getByText("데이터 연동 후 추천 구간을 확인할 수 있습니다.")
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
});
