import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

for (const [locale, label, name, level] of [
    ["ko", "정렬", "일본어 읽기 순", "레벨 높은 순"],
    ["ja", "並べ替え", "読み仮名順", "レベルが高い順"],
    ["en", "Sort", "Japanese reading order", "Highest level"],
]) {
    test(`${locale} discovery sort announces its current criterion after keyboard selection`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        for (const scope of ["music", "music?scope=chart&sort=name"]) {
            await page.goto(`/${locale}/${scope}`);
            const trigger = page.getByRole("button", {
                name: `${label}: ${name}`,
                exact: true,
            });
            await expect(trigger).toHaveText(name);
            await trigger.press("Enter");
            const group = page.getByRole("group", { name: label, exact: true });
            await group
                .getByRole("menuitemradio", { name: name, exact: true })
                .focus();
            // 이름 순 → 이름 역순 → 레벨 높은 순(방향을 항목에 녹인 목록, 2026-09-23 D2)
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("Enter");
            await page
                .locator(".nl-sort-menu")
                .getByRole("button", { name: "Expert", exact: true })
                .focus();
            await page.keyboard.press("Space");
            await expect(
                page.getByRole("button", {
                    name: `${label}: ${level}`,
                    exact: true,
                })
            ).toHaveText(level);
            await expect(page).toHaveURL(/sort=level/);
            await page.keyboard.press("Escape");
            await expect(
                page.getByRole("button", {
                    name: `${label}: ${level}`,
                    exact: true,
                })
            ).toBeFocused();
        }
    });
}

for (const path of ["music", "music?scope=chart", "tiers"]) {
    test(`${path} discards staged filters on Wide transition and applies rail changes immediately`, async ({
        page,
    }) => {
        const tier = path === "tiers";
        const rail = page.locator(
            tier ? ".nl-tier-rail" : ".nl-discovery__rail"
        );
        await page.setViewportSize({ width: 1055, height: 900 });
        await page.goto(`/ko/${path}`);
        const trigger = page.getByRole("button", {
            name: /^필터(?: \d+)?$/,
        });
        await trigger.click();
        const dialog = page.getByRole("dialog");
        // 창은 칩(누름 버튼), 레일은 체크박스 목록
        const option = dialog.getByRole("button", {
            name: tier ? "Expert" : "pops",
            exact: true,
        });
        await option.click();
        expect(
            new URL(page.url()).searchParams.has(
                tier ? "difficulty" : "categories"
            )
        ).toBe(false);
        await page.setViewportSize({ width: 1056, height: 900 });
        await expect(rail).toBeVisible();
        await expect(dialog).toHaveCount(0);
        const railOption = tier
            ? rail.getByRole("button", { name: "Expert", exact: true })
            : rail.getByRole("checkbox", { name: "pops", exact: true });
        if (tier)
            await expect(railOption).toHaveAttribute("aria-pressed", "false");
        else await expect(railOption).not.toBeChecked();
        if (tier) await railOption.click();
        else await rail.getByText("pops", { exact: true }).click();
        await expect(page).toHaveURL(
            tier ? /difficulty=Expert/ : /categories=pops/
        );
        await page.setViewportSize({ width: 1055, height: 900 });
        await expect(trigger).toBeVisible();
        await expect(dialog).toHaveCount(0);
        await trigger.click();
        await expect(option).toHaveAttribute("aria-pressed", "true");
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
    });
}

for (const locale of ["ko", "ja", "en"]) {
    for (const path of ["music", "music?scope=chart", "tiers"]) {
        test(`${locale} ${path} uses viewport Wide rails inside the bounded shell`, async ({
            page,
        }, testInfo) => {
            const tier = path === "tiers";
            const root = tier ? ".nl-tiers" : ".nl-discovery";
            const rail = page.locator(
                tier ? ".nl-tier-rail" : ".nl-discovery__rail"
            );
            const errors: string[] = [];
            page.on("pageerror", (error) => errors.push(error.message));
            await page.goto(`/${locale}/${path}`);
            for (const width of [
                320, 390, 768, 1024, 1055, 1056, 1280, 1470, 1920,
            ]) {
                await page.setViewportSize({ width, height: 900 });
                await expect(page.locator(root)).toHaveAttribute(
                    "data-layout",
                    width >= 1056 ? "wide" : "compact"
                );
                await expect(rail).toHaveCount(width >= 1056 ? 1 : 0);
                expect(
                    (await page.locator(".nl-main").boundingBox())!.width
                ).toBeLessThanOrEqual(1200);
                await expectNoHorizontalOverflow(page);
                if (tier) {
                    // Wide = 정렬 · 띠 값 · 보기 전환 툴바, 결과 수는 어느 폭에서도 결과 영역에 없다(가이드 「서열표」)
                    const results = page.locator(".nl-tier-results");
                    const toolbar = results.locator(".nl-tier-toolbar");
                    await expect(results.getByRole("status")).toHaveCount(0);
                    if (width >= 1056) {
                        const sort = (await toolbar
                            .locator(".nl-filter-trigger")
                            .first()
                            .boundingBox())!;
                        const view = (await toolbar
                            .locator(".nl-segments")
                            .boundingBox())!;
                        const row = (await toolbar.boundingBox())!;
                        expect(sort.x).toBeCloseTo(row.x, 1);
                        expect(view.x + view.width).toBeCloseTo(
                            row.x + row.width,
                            1
                        );
                        expect(sort.y + sort.height / 2).toBeCloseTo(
                            view.y + view.height / 2,
                            1
                        );
                    }
                }
                if (width === 1056 || width === 1470) {
                    const box = (await rail.boundingBox())!;
                    expect(box.width).toBeGreaterThan(200);
                    expect(
                        await rail.evaluate(
                            (node) => node.scrollWidth <= node.clientWidth
                        )
                    ).toBe(true);
                    await page.screenshot({
                        path: testInfo.outputPath(`rail-${width}.png`),
                    });
                }
            }
            const scan = await new AxeBuilder({ page })
                .include(root)
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
            expect(scan.violations).toEqual([]);
            expect(errors).toEqual([]);
        });
    }
}
