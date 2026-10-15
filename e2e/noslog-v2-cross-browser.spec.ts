import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// 제목 스위처(2026-09-22 ④) — 접근 이름 「서열표 선택」, 항목 = 「{목표} 서열표」(Basic S · 990k · Pianist → Recital)
const tierSwitcherCopy = {
    ko: { label: "서열표 선택", option: (goal: string) => `${goal} 서열표` },
    ja: {
        label: "難易度表を選ぶ",
        option: (goal: string) => `${goal}難易度表`,
    },
    en: {
        label: "Choose tier list",
        option: (goal: string) => `${goal} Tier List`,
    },
};

for (const locale of ["ko", "ja", "en"] as const) {
    test(`${locale} tier goal opens below its trigger and supports keyboard selection`, async ({
        page,
    }, testInfo) => {
        const copy = tierSwitcherCopy[locale];
        await page.goto(`/${locale}/tiers`);
        const trigger = page.getByRole("combobox", { name: copy.label });
        const menu = page.getByRole("listbox");
        for (const width of [320, 390, 768, 1056, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            // 열린 동안 바깥은 접근성 트리에서 숨는다 — 트리거 위치는 열기 전에 잰다
            const controlBox = (await trigger.boundingBox())!;
            await trigger.click();
            await expect(menu).toBeVisible();
            await expect(menu).toHaveAttribute("data-side", "bottom");
            const menuBox = (await menu.boundingBox())!;
            expect(menuBox.y).toBeGreaterThanOrEqual(
                controlBox.y + controlBox.height
            );
            expect(menuBox.x).toBeGreaterThanOrEqual(0);
            expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(width);
            await page.screenshot({
                path: testInfo.outputPath(`goal-${width}.png`),
            });
            await page.keyboard.press("Escape");
            await expect(menu).toHaveCount(0);
            await expect(trigger).toBeFocused();
        }
        await trigger.press("ArrowDown");
        await expect(menu).toBeVisible();
        await expect(
            page.getByRole("option", { name: copy.option("S"), exact: true })
        ).toBeFocused();
        // 마지막 항목은 Recital 서열표 — 한 칸 위가 Basic Pianist
        await page.keyboard.press("End");
        await expect(
            page.getByRole("option", {
                name: copy.option("Recital"),
                exact: true,
            })
        ).toBeFocused();
        await page.keyboard.press("ArrowUp");
        await expect(
            page.getByRole("option", {
                name: copy.option("Pianist"),
                exact: true,
            })
        ).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(trigger).toHaveText(copy.option("Pianist"));
        await expect(page).toHaveURL(/goal=pianist/);
        await expect(trigger).toBeFocused();
        await trigger.click();
        await page
            .getByRole("option", { name: copy.option("990k"), exact: true })
            .click();
        await expect(page).toHaveURL(/goal=990k/);
        const scan = await new AxeBuilder({ page })
            .include(".nl-tiers")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
        expect(scan.violations).toEqual([]);
    });
}

for (const locale of ["ko", "ja", "en"])
    test(`${locale} dark P1–P5 cross-browser navigation and reflow`, async ({
        page,
    }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        for (const path of [
            "",
            "/music",
            "/music/bfdaadfb98501907925ecf41a076108d/expert",
            "/tiers",
            "/rankings",
        ]) {
            await page.goto(`/${locale}${path}`);
            await expect(page.locator("main h1").first()).toBeVisible();
            await expect(page.locator("html")).toHaveAttribute("lang", locale);
            await expect(page.locator("html")).toHaveAttribute(
                "data-theme",
                "dark"
            );
            for (const width of [320, 390, 768, 1470]) {
                await page.setViewportSize({ width, height: 900 });
                await expect
                    .poll(
                        () =>
                            page.evaluate(() => ({
                                viewport: innerWidth,
                                overflow:
                                    document.documentElement.scrollWidth -
                                    innerWidth,
                            })),
                        {
                            message: `${locale}${path} must reflow at ${width}px`,
                        }
                    )
                    .toEqual({ viewport: width, overflow: 0 });
            }
            const scan = await new AxeBuilder({ page })
                .include("main")
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
            expect(scan.violations).toEqual([]);
        }
        expect(errors).toEqual([]);
    });
