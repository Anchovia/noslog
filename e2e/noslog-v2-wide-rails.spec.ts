import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

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
            name: tier ? /^필터(?: \d+)?$/ : /^필터 및 정렬(?: \d+)?$/,
        });
        await trigger.click();
        const dialog = page.getByRole("dialog");
        const option = tier
            ? dialog.getByRole("button", { name: "Expert", exact: true })
            : dialog.getByRole("checkbox", { name: "pops", exact: true });
        if (tier) await option.click();
        else await dialog.getByText("pops", { exact: true }).click();
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
        if (tier) await expect(option).toHaveAttribute("aria-pressed", "true");
        else await expect(option).toBeChecked();
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
                ).toBeLessThanOrEqual(1000);
                await expectNoHorizontalOverflow(page);
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
