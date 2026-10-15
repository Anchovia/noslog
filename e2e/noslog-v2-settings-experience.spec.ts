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
    // 테마 = 줄 오른쪽 드롭다운(2026-10-01 B1), 다크 전용이면 잠긴다
    const theme = page.getByRole("combobox", { name: "테마", exact: true });
    await expect(theme).toHaveText("다크");
    await expect(theme).toBeDisabled();
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
        const theme = page.getByRole("combobox", {
            name: "테마",
            exact: true,
        });
        await expect(theme).toHaveText("다크");
        await expect(theme).toBeDisabled();
    } finally {
        await context.close();
    }
});

test("Explicit guest preference survives a shared URL in another language", async ({
    page,
}) => {
    await page.goto("/ko/settings?category=experience");
    await page.getByRole("combobox", { name: "언어", exact: true }).click();
    await page.getByRole("option", { name: "日本語", exact: true }).click();
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
    await page.getByRole("combobox", { name: "언어", exact: true }).click();
    await page.getByRole("option", { name: "English", exact: true }).click();
    await expect(
        page
            .getByRole("alert")
            .filter({ hasText: "설정을 저장하지 못했습니다." })
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
    await page.unrouteAll({ behavior: "wait" });
    // 닫힌 직후 잠깐은 다시 열지 않는다(useSelectOpen 의 REOPEN_GUARD_MS) — 열릴 때까지 다시 누른다
    const english = page.getByRole("option", { name: "English", exact: true });
    await expect(async () => {
        await page.getByRole("combobox", { name: "언어", exact: true }).click();
        await expect(english).toBeVisible({ timeout: 1_000 });
    }).toPass();
    await english.click();
    await expect(page).toHaveURL(/\/en\/settings\?category=experience/);
});

const languageLabel = { ko: "언어", ja: "言語", en: "Language" } as const;

for (const locale of ["ko", "ja", "en"] as const)
    test(`${locale} public settings reflow, focus, and accessibility`, async ({
        page,
    }, testInfo) => {
        for (const width of [320, 390, 768, 1000, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(`/${locale}/settings?category=experience`);
            await expect(
                page.getByRole("combobox", {
                    name: languageLabel[locale],
                    exact: true,
                })
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
