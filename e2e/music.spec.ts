import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

test("악곡 목록의 정렬과 보기 방식을 URL에 반영한다", async ({ page }) => {
    await page.goto("/ko/music");
    await expectPageLoaded(page);
    const listView = page.getByRole("radio", { name: "목록", exact: true });
    const gridView = page.getByRole("radio", { name: "격자", exact: true });
    await expect(listView).toHaveAttribute("aria-checked", "true");
    await gridView.click();
    await expect(page).toHaveURL(/(?:\?|&)view=grid(?:&|$)/);
    await expect(gridView).toHaveAttribute("aria-checked", "true");
    await page
        .getByRole("button", { name: "필터 및 정렬", exact: true })
        .click();
    const dialog = page.getByRole("dialog", { name: "필터 및 정렬" });
    await dialog.getByText("레벨 순", { exact: true }).click();
    await dialog
        .getByRole("group", { name: "정렬할 난이도", exact: true })
        .getByText("Hard", { exact: true })
        .click();
    await dialog.getByRole("button", { name: /결과 .*개 보기/ }).click();
    await expect(page).toHaveURL(/(?:\?|&)sort=level(?:&|$)/);
    await expect(page).toHaveURL(/sortDifficulty=Hard/);
    await expectNoHorizontalOverflow(page);
});

test("첫 악곡 상세로 이동하고 비로그인 내 기록 안내를 표시한다", async ({
    page,
}) => {
    await page.goto("/ko/music");
    await expectPageLoaded(page);
    const firstMusic = page.locator('a[href^="/ko/music/"]').first();

    await expect(firstMusic).toBeVisible();
    await firstMusic.click();
    await expect(page).toHaveURL(
        /\/ko\/music\/[^/]+\/(normal|hard|expert|real)$/
    );
    await expect(
        page.getByRole("heading", { name: "채보 정보", exact: true })
    ).toBeVisible();
    if ((page.viewportSize()?.width ?? 390) < 768) {
        await page.getByRole("combobox", { name: "상세 영역" }).click();
        await page
            .getByRole("option", { name: "내 기록", exact: true })
            .click();
    } else {
        await page.getByRole("tab", { name: "내 기록", exact: true }).click();
    }
    await expect(
        page.getByText("로그인 후 내 기록을 확인할 수 있습니다.")
    ).toBeVisible();
    await expectPageLoaded(page);
    await expectNoHorizontalOverflow(page);
});
