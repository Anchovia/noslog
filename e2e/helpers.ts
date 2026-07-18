import { expect, type Page } from "@playwright/test";

export async function expectNoHorizontalOverflow(page: Page) {
    const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth + 1
    );
}

export async function expectPageLoaded(page: Page) {
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).not.toContainText(
        "페이지를 불러오지 못했습니다."
    );
    await expect(page.locator("body")).not.toContainText(
        "This page couldn’t load"
    );
}
