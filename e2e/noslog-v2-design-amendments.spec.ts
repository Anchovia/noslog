import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";
import { expectNoHorizontalOverflow } from "./helpers";

test.skip(
    process.env.NOSLOG_LOCAL_DESIGN_FIXTURE !== "true",
    "Requires render-only fixtures."
);
for (const locale of ["ko", "ja", "en"] as const) {
    const t = getMessages(locale);
    test(`${locale} feedback width, form, actions and focus`, async ({
        page,
    }, testInfo) => {
        await page.goto(`/${locale}/p7-verification?fixture=feedback`);
        await page
            .getByRole("button", { name: t["shell.feedback"], exact: true })
            .click();
        const dialog = page.getByRole("dialog");
        for (const width of [320, 390, 520, 768, 1024, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await expect
                .poll(async () => (await dialog.boundingBox())!.width)
                .toBe(
                    width < 672
                        ? Math.min(334, width - 32)
                        : Math.min(768, width - 48)
                );
            const buttons = dialog.locator(".nl-dialog__actions > button");
            if (width < 672)
                expect(
                    Math.abs(
                        (await buttons.nth(0).boundingBox())!.width -
                            (await buttons.nth(1).boundingBox())!.width
                    )
                ).toBeLessThan(1);
            await expectNoHorizontalOverflow(page);
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`feedback-${width}.png`),
                });
        }
        await dialog
            .getByRole("textbox")
            .fill("A valid description for layout validation only.");
        await expect(
            dialog.getByRole("button", {
                name: t["feedback.submit"],
                exact: true,
            })
        ).toBeEnabled();
        await dialog.locator('input[type="file"]').setInputFiles({
            name: "invalid.txt",
            mimeType: "text/plain",
            buffer: Buffer.from("Invalid image fixture"),
        });
        await expect(dialog.getByRole("alert")).toHaveClass(
            /nl-status--danger/
        );
        await expect(dialog.getByRole("alert")).toContainText(
            t["feedback.invalidImage"]
        );
        expect(
            (
                await new AxeBuilder({ page })
                    .include('[role="dialog"]')
                    .analyze()
            ).violations
        ).toEqual([]);
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(
            page.getByRole("button", { name: t["shell.feedback"], exact: true })
        ).toBeFocused();
    });
    test(`${locale} wide bingo filter applies below its trigger and restores focus`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1470, height: 1400 });
        await page.goto(`/${locale}/p7-verification?fixture=bingos`);
        await expect(
            page.locator(".nl-bingo-catalog__controls")
        ).toHaveAttribute("data-filter-layout", "popover");
        const trigger = page.getByRole("button", {
            name: t["discovery.filterSort"],
            exact: false,
        });
        await trigger.click();
        const popover = page.getByRole("dialog");
        await expect(popover).toHaveClass(/nl-bingo-filter-popover/);
        const anchor = (await trigger.boundingBox())!;
        const bounds = (await popover.boundingBox())!;
        expect(bounds.width).toBe(334);
        expect(Math.abs(bounds.y - anchor.y - anchor.height - 8)).toBeLessThan(
            1
        );
        await popover
            .getByRole("radio", { name: t["bingo.catalog.full"], exact: true })
            .check();
        await expect(page).toHaveURL(/status=full/);
        await expect(
            page.locator("ul.nl-bingo-catalog__grid > li")
        ).toHaveCount(5);
        await page.keyboard.press("Escape");
        await expect(popover).toHaveCount(0);
        await expect(trigger).toBeFocused();
    });
    test(`${locale} footer centres below 840 and aligns wide`, async ({
        page,
    }) => {
        await page.goto(`/${locale}`);
        for (const width of [320, 390, 520, 768, 839, 840, 1280, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await expect(page.locator(".nl-footer__notice")).toHaveCSS(
                "text-align",
                width < 840 ? "center" : "end"
            );
            await expect(page.locator(".nl-footer__content")).toHaveCSS(
                "flex-direction",
                width < 840 ? "column" : "row"
            );
            await expectNoHorizontalOverflow(page);
        }
    });
}
