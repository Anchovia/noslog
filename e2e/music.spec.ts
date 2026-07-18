import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

test("악곡 목록의 정렬과 보기 방식을 URL에 반영한다", async ({ page }) => {
    await page.goto("/music");
    await expectPageLoaded(page);
    await expect(page.getByRole("button", { name: "필터" })).toHaveCSS(
        "white-space",
        "nowrap"
    );

    const listView = page.getByRole("button", { name: "리스트 보기" });
    const gridView = page.getByRole("button", { name: "그리드 보기" });
    await expect(listView).toHaveAttribute("aria-pressed", "true");

    await gridView.click();
    await expect(page).toHaveURL(/(?:\?|&)view=grid(?:&|$)/);
    await expect(gridView).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: /레벨순/ }).click();
    await expect(page).toHaveURL(/(?:\?|&)sort=level(?:&|$)/);
    await expect(page).toHaveURL(/(?:\?|&)order=desc(?:&|$)/);
    await expectNoHorizontalOverflow(page);
});

test("첫 악곡 상세로 이동하고 비로그인 내 기록 안내를 표시한다", async ({
    page,
}) => {
    await page.goto("/music");
    await expectPageLoaded(page);
    const firstMusic = page.locator('a[href^="/music/"]').first();

    await expect(firstMusic).toBeVisible();
    await firstMusic.click();
    await expect(page).toHaveURL(/\/music\/[^/]+\/(normal|hard|expert|real)$/);
    await expect(
        page.getByText("로그인 후 내 기록을 확인할 수 있습니다.")
    ).toBeVisible();
    await expectPageLoaded(page);
    await expectNoHorizontalOverflow(page);
});
