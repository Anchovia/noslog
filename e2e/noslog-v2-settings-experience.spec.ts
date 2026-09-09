import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Dark-only mode ignores stored Light and OS Light while keeping theme controls disabled", async ({
    page,
}) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(() =>
        localStorage.setItem("noslog-theme", "light")
    );
    await page.goto("/ko/settings?category=experience");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(
        page.getByRole("radio", { name: "다크", exact: true })
    ).toBeChecked();
    for (const name of ["시스템", "다크", "라이트"])
        await expect(
            page.getByRole("radio", { name, exact: true })
        ).toBeDisabled();
    expect(
        await page.evaluate(() => localStorage.getItem("noslog-theme"))
    ).toBe("light");
    await page.emulateMedia({ colorScheme: "dark" });
    await page.emulateMedia({ colorScheme: "light" });
    await page.evaluate(() => {
        window.dispatchEvent(
            new StorageEvent("storage", {
                key: "noslog-theme",
                newValue: "light",
            })
        );
        window.dispatchEvent(new Event("noslog-theme-change"));
    });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.goto("/ko");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("Dark-only page remains dark before client JavaScript runs", async ({
    browser,
    baseURL,
}) => {
    const context = await browser.newContext({
        javaScriptEnabled: false,
        colorScheme: "light",
        baseURL,
    });
    try {
        const page = await context.newPage();
        await page.goto("/ko/settings?category=experience");
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark"
        );
        await expect(
            page.getByRole("radio", { name: "다크", exact: true })
        ).toBeChecked();
        await expect(
            page.getByRole("radio", { name: "라이트", exact: true })
        ).toBeDisabled();
    } finally {
        await context.close();
    }
});

test("Explicit guest preference survives a shared URL in another language", async ({
    page,
}) => {
    await page.goto("/ko/settings?category=experience");
    await page.getByRole("radio", { name: "日本語", exact: true }).click();
    await expect(page).toHaveURL(/\/ja\/settings\?category=experience/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await page.goto("/en/music");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goto("/");
    await expect(page).toHaveURL(/\/ja$/);
});

test("Language update failure retains the current locale and allows retry", async ({
    page,
}) => {
    await page.goto("/ko/settings?category=experience");
    await page.route("**/ko/settings?category=experience", async (route) => {
        if (route.request().method() === "POST") await route.abort();
        else await route.continue();
    });
    await page.getByRole("radio", { name: "English", exact: true }).click();
    await expect(
        page
            .getByRole("alert")
            .filter({ hasText: "설정을 저장하지 못했습니다." })
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
    await page.unrouteAll({ behavior: "wait" });
    await page.getByRole("radio", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/settings\?category=experience/);
});

for (const locale of ["ko", "ja", "en"])
    test(`${locale} public settings reflow, focus, and accessibility`, async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== "mobile-chromium",
            "Run each multi-width matrix once."
        );
        for (const width of [320, 390, 768, 1000, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(`/${locale}/settings?category=experience`);
            await expect(
                page.getByRole("radio", { name: "한국어", exact: true })
            ).toBeVisible();
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            if (width === 320 || width === 1470) {
                const scan = await new AxeBuilder({ page })
                    .include("main")
                    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                    .analyze();
                expect(scan.violations).toEqual([]);
            }
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`${locale}-dark-${width}.png`),
                    fullPage: true,
                });
        }
    });
