import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";
import { expectNoHorizontalOverflow } from "./helpers";

test.skip(
    process.env.NOSLOG_MISSING_FIXTURE !== "true",
    "Requires isolated account/reset presentation fixtures; never deletes real accounts."
);
for (const locale of ["ko", "ja", "en"] as const) {
    const t = getMessages(locale);
    test(`${locale} Account layout, unverified deletion, focus and logout failure`, async ({
        page,
    }, testInfo) => {
        await page.goto(
            `/${locale}/p7-verification?fixture=account&state=unverified`
        );
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await expect(
                page.getByRole("button", {
                    name: t["profile.logout"],
                    exact: true,
                })
            ).toBeVisible();
            await expectNoHorizontalOverflow(page);
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`account-${width}.png`),
                    fullPage: true,
                });
        }
        await page
            .getByRole("button", { name: t["profile.logout"], exact: true })
            .click();
        await expect(
            page
                .getByRole("alert")
                .filter({ hasText: t["settings.logoutError"] })
        ).toBeVisible();
        await page
            .getByRole("button", {
                name: t["settings.deleteTitle"],
                exact: true,
            })
            .click();
        const dialog = page.getByRole("dialog");
        await expect(
            dialog.getByRole("button", {
                name: t["settings.cancel"],
                exact: true,
            })
        ).toBeFocused();
        await dialog
            .getByRole("textbox")
            .fill(t["settings.deleteConfirmation"]);
        await expect(
            dialog.getByRole("button", {
                name: t["settings.deleteEverything"],
                exact: true,
            })
        ).toBeDisabled();
        await expect(
            dialog.getByRole("link", {
                name: t["settings.reauthenticate"],
                exact: true,
            })
        ).toHaveAttribute("href", /mode=delete/);
        for (const width of [320, 390, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await expectNoHorizontalOverflow(page);
            await page.screenshot({
                path: testInfo.outputPath(`account-dialog-${width}.png`),
                fullPage: false,
            });
        }
        expect(
            (
                await new AxeBuilder({ page })
                    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                    .analyze()
            ).violations
        ).toEqual([]);
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(
            page.getByRole("button", {
                name: t["settings.deleteTitle"],
                exact: true,
            })
        ).toBeFocused();
    });
    test(`${locale} deletion requires exact phrase and preserves modal on pending/failure`, async ({
        page,
    }) => {
        await page.goto(
            `/${locale}/p7-verification?fixture=account&state=ready`
        );
        await page
            .getByRole("button", {
                name: t["settings.deleteTitle"],
                exact: true,
            })
            .click();
        const dialog = page.getByRole("dialog");
        const submit = dialog.getByRole("button", {
            name: t["settings.deleteEverything"],
            exact: true,
        });
        await dialog
            .getByRole("textbox")
            .fill(` ${t["settings.deleteConfirmation"]}`);
        await expect(submit).toBeDisabled();
        await dialog
            .getByRole("textbox")
            .fill(t["settings.deleteConfirmation"]);
        await expect(submit).toBeEnabled();
        await submit.click();
        await expect(submit).toHaveAttribute("aria-busy", "true");
        await page.keyboard.press("Escape");
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole("alert")).toContainText(
            t["settings.deleteError"]
        );
        await expect(dialog.getByRole("textbox")).toHaveValue(
            t["settings.deleteConfirmation"]
        );
        await expect(submit).toBeEnabled();
    });
    test(`${locale} deletion grant expires without logging out`, async ({
        page,
    }) => {
        await page.goto(
            `/${locale}/p7-verification?fixture=account&state=expiry`
        );
        await page
            .getByRole("button", {
                name: t["settings.deleteTitle"],
                exact: true,
            })
            .click();
        const dialog = page.getByRole("dialog");
        await dialog
            .getByRole("textbox")
            .fill(t["settings.deleteConfirmation"]);
        await expect(
            dialog.getByRole("button", {
                name: t["settings.deleteEverything"],
                exact: true,
            })
        ).toBeEnabled();
        await expect(
            dialog.getByRole("link", {
                name: t["settings.reauthenticate"],
                exact: true,
            })
        ).toBeVisible({ timeout: 6000 });
        await expect(
            dialog.getByRole("button", {
                name: t["settings.deleteEverything"],
                exact: true,
            })
        ).toBeDisabled();
        await expect(page).toHaveURL(/fixture=account/);
    });
    test(`${locale} Bingo reset cancel, failure, success and restored focus`, async ({
        page,
    }) => {
        for (const state of ["detail-reset-failure", "detail"]) {
            await page.goto(
                `/${locale}/p7-verification?fixture=bingos&state=${state}`
            );
            await page.setViewportSize({ width: 320, height: 900 });
            const trigger = page.getByRole("button", {
                name: t["bingo.resetTitle"],
                exact: true,
            });
            await trigger.click();
            const dialog = page.getByRole("dialog");
            const cancel = dialog.getByRole("button", {
                name: t["settings.cancel"],
                exact: true,
            });
            await expect(cancel).toBeFocused();
            await cancel.click();
            await expect(trigger).toBeFocused();
            await expect(
                page.locator(".nl-bingo-mission input:checked")
            ).toHaveCount(8);
            await trigger.click();
            await expectNoHorizontalOverflow(page);
            await dialog
                .getByRole("button", {
                    name: t["bingo.resetAction"],
                    exact: true,
                })
                .click();
            await expect(cancel).toBeDisabled();
            await page.keyboard.press("Escape");
            await expect(dialog).toBeVisible();
            if (state.includes("failure")) {
                await expect(dialog.getByRole("alert")).toContainText(
                    "Fixture reset failure"
                );
                await cancel.click();
                await expect(
                    page.locator(".nl-bingo-mission input:checked")
                ).toHaveCount(8);
            } else {
                await expect(dialog).toHaveCount(0);
                await expect(
                    page.locator(".nl-bingo-mission input:checked")
                ).toHaveCount(0);
                await expect(page.locator("#bingo-title")).toBeFocused();
                await expect(trigger).toHaveCount(0);
            }
        }
    });
}
