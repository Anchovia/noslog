import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

test.skip(
    process.env.NOSLOG_SETTINGS_FIXTURE !== "true",
    "Requires isolated local P10 presentation fixtures."
);
for (const locale of ["ko", "ja", "en"] as const) {
    test(`P10 ${locale} loading preserves category orientation until streaming resolves`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(
            `/${locale}/p7-verification?fixture=settings&category=loading`,
            { waitUntil: "commit" }
        );
        const heading = page.getByRole("heading", {
            name: t["settings.profileTitle"],
            exact: true,
        });
        await expect(heading).toBeVisible();
        await expect(
            page.getByRole("status").filter({ hasText: t["profile.loading"] })
        ).toBeVisible();
        const rows = page.locator(".nl-settings__loading .nl-result-skeleton");
        await expect(rows).toHaveCount(4);
        await expect(
            page.locator(".nl-settings__loading .nl-record-list-skeleton")
        ).toHaveAttribute("aria-hidden", "true");
        await expect(rows.first()).toHaveCSS("height", "64px");
        await expect(
            page.locator(".nl-settings__loading .nl-record-list-skeleton")
        ).toHaveCSS("gap", "24px");
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        const before = await heading.boundingBox();
        await page.screenshot({
            path: testInfo.outputPath("loading-390.png"),
            fullPage: true,
        });
        await expect(
            page.getByRole("status").filter({ hasText: "P10 fixture loaded" })
        ).toBeVisible();
        expect(await heading.boundingBox()).toEqual(before);
        await expect(page.locator(".nl-settings__loading")).toHaveCount(0);
    });
    test(`P10 ${locale} connections separate refresh and confirmed account change`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=settings&category=connections`
        );
        await page.setViewportSize({ width: 390, height: 844 });
        await expect(page.getByRole("textbox")).toHaveCount(0);
        await expect(
            page.getByRole("button", {
                name: t["settings.refreshDiscord"],
                exact: true,
            })
        ).toBeVisible();
        await page.screenshot({
            path: testInfo.outputPath("connections-390.png"),
            fullPage: true,
        });
        const change = page.getByRole("button", {
            name: t["settings.changeLoginAccount"],
            exact: true,
        });
        await change.click();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toHaveAccessibleName(
            t["settings.changeLoginAccount"]
        );
        await expect(
            dialog.getByRole("button", {
                name: t["settings.cancel"],
                exact: true,
            })
        ).toBeFocused();
        await page.setViewportSize({ width: 320, height: 600 });
        expect(
            (
                await new AxeBuilder({ page })
                    .include('[role="dialog"]')
                    .analyze()
            ).violations
        ).toEqual([]);
        await dialog
            .getByRole("button", { name: t["settings.cancel"], exact: true })
            .click();
        await expect(change).toBeFocused();
        await expect(page).toHaveURL(/fixture=settings&category=connections/);
    });
    test(`P10 ${locale} avatar crop stays local and supports keyboard controls`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const uploads: string[] = [];
        page.on("request", (request) => {
            if (
                request.method() !== "GET" &&
                request.url().includes("blob.vercel-storage.com")
            )
                uploads.push(request.method());
        });
        await page.goto(`/${locale}/p7-verification?fixture=settings`);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('input[type="file"]').setInputFiles({
            name: "invalid.txt",
            mimeType: "text/plain",
            buffer: Buffer.from("invalid image"),
        });
        await expect(
            page.locator(".nl-settings__form").getByRole("alert")
        ).toHaveText(t["settings.invalidImage"]);
        await page
            .locator('input[type="file"]')
            .setInputFiles("public/icon/crown.png");
        const dialog = page.getByRole("dialog");
        await expect(dialog).toHaveAccessibleName(t["settings.changePhoto"]);
        await expect(dialog).toHaveCSS("padding", "16px");
        const confirm = dialog.getByRole("button", {
            name: t["common.confirm"],
            exact: true,
        });
        await expect(confirm).toBeEnabled();
        await dialog
            .getByRole("button", { name: t["settings.zoomIn"], exact: true })
            .click();
        const position = dialog.getByRole("group", {
            name: t["settings.cropPosition"],
            exact: true,
        });
        await position.focus();
        await position.press("Shift+ArrowRight");
        await position.press("ArrowDown");
        await page.screenshot({
            path: testInfo.outputPath("crop-390.png"),
            fullPage: true,
        });
        await page.setViewportSize({ width: 320, height: 600 });
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth
            )
        ).toBe(true);
        expect(
            (
                await new AxeBuilder({ page })
                    .include('[role="dialog"]')
                    .analyze()
            ).violations
        ).toEqual([]);
        await confirm.click();
        await expect(dialog).not.toBeVisible();
        await expect(
            page.getByRole("button", {
                name: t["settings.changePhoto"],
                exact: true,
            })
        ).toBeFocused();
        await expect(
            page.locator(".nl-settings__identity-row img")
        ).toHaveAttribute("src", /^blob:/);
        await expect(
            page.getByRole("button", { name: t["settings.save"], exact: true })
        ).toBeEnabled();
        expect(uploads).toEqual([]);
        await page
            .getByRole("button", {
                name: t["settings.removePhoto"],
                exact: true,
            })
            .click();
        await expect(
            page.locator(".nl-settings__identity-row img")
        ).toHaveCount(0);
        await expect(
            page.getByRole("button", { name: t["settings.save"], exact: true })
        ).toBeDisabled();
    });
    test(`P10 ${locale} profile staging, dialogs and failure preservation`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/p7-verification?fixture=settings`);
        const form = page.locator(".nl-settings__form");
        const save = form.getByRole("button", {
            name: t["settings.save"],
            exact: true,
        });
        await expect(save).toBeDisabled();
        for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1470, 1055]) {
            await page.setViewportSize({ width, height: 900 });
            await expect(page.locator("#settings-nickname")).toHaveCSS(
                "height",
                "44px"
            );
            await page.evaluate(async () => {
                await document.fonts.ready;
                await new Promise<void>((resolve) =>
                    requestAnimationFrame(() =>
                        requestAnimationFrame(() => resolve())
                    )
                );
            });
            const profileLink = page.locator(".nl-settings__view-profile");
            await expect(profileLink).toHaveCSS("height", "20px");
            const linkBox = (await profileLink.boundingBox())!;
            const saveBox = (await save.boundingBox())!;
            expect(saveBox.y - linkBox.y - linkBox.height).toBe(12);
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            if (width >= 1056) {
                await expect(
                    page.locator(".nl-settings__navigation")
                ).toBeVisible();
                await expect(
                    page.locator(".nl-settings__back")
                ).not.toBeVisible();
                expect(
                    (await page
                        .locator(".nl-settings__navigation")
                        .boundingBox())!.width
                ).toBe(292);
                expect(
                    (await page.locator(".nl-settings__detail").boundingBox())!
                        .width
                ).toBeLessThanOrEqual(640);
            } else {
                await expect(
                    page.locator(".nl-settings__navigation")
                ).not.toBeVisible();
                await expect(page.locator(".nl-settings__back")).toBeVisible();
            }
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`profile-${width}.png`),
                    fullPage: true,
                });
        }
        await page.setViewportSize({ width: 320, height: 600 });
        expect(
            (await new AxeBuilder({ page }).include(".nl-settings").analyze())
                .violations
        ).toEqual([]);
        const nickname = form.getByRole("textbox", {
            name: t["onboarding.nickname"],
            exact: true,
        });
        await nickname.fill("Changed Ｎos 한글カナ");
        await save.click();
        await expect(form).toHaveAttribute("aria-busy", "true");
        await expect(form.getByRole("alert")).toHaveText(
            t["settings.saveError"]
        );
        await expect(nickname).toHaveValue("Changed Ｎos 한글カナ");
        await form
            .getByRole("radio", {
                name: t["onboarding.country.jp"],
                exact: true,
            })
            .click();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toHaveAccessibleName(t["settings.changeCountry"]);
        await expect(
            dialog.getByRole("button", {
                name: t["settings.cancel"],
                exact: true,
            })
        ).toBeFocused();
        await dialog
            .getByRole("button", {
                name: t["settings.changeArcade"],
                exact: true,
            })
            .click();
        await expect(
            form.getByRole("radio", {
                name: t["onboarding.country.jp"],
                exact: true,
            })
        ).toBeChecked();
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await form
            .getByRole("button", {
                name: t["settings.changeArcade"],
                exact: true,
            })
            .click();
        await expect(dialog.getByRole("combobox")).toBeFocused();
        await dialog.getByRole("combobox").fill("does not exist");
        await expect(dialog.getByRole("option")).toHaveCount(0);
        await dialog.getByRole("combobox").fill("fixture");
        await expect(dialog.getByRole("option")).toHaveCount(1);
        expect(
            (
                await new AxeBuilder({ page })
                    .include('[role="dialog"]')
                    .analyze()
            ).violations
        ).toEqual([]);
        await dialog.getByRole("combobox").press("Enter");
        await expect(
            form.getByRole("button", {
                name: t["settings.changeArcade"],
                exact: true,
            })
        ).toBeFocused();
        await form
            .getByRole("link", { name: t["settings.viewProfile"], exact: true })
            .click();
        await expect(dialog).toHaveAccessibleName(t["settings.unsaved"]);
        await expect(
            dialog.getByRole("button", {
                name: t["settings.stay"],
                exact: true,
            })
        ).toBeFocused();
        await dialog
            .getByRole("button", { name: t["settings.stay"], exact: true })
            .click();
        await expect(nickname).toHaveValue("Changed Ｎos 한글カナ");
        expect(errors).toEqual([]);
    });
    test(`P10 ${locale} privacy choices retain state after failed save`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=settings&category=privacy`
        );
        await page.setViewportSize({ width: 390, height: 844 });
        const form = page.locator(".nl-settings__form");
        await expect(form.getByRole("checkbox")).toHaveCount(5);
        const save = form.getByRole("button", {
            name: t["settings.save"],
            exact: true,
        });
        await expect(save).toBeDisabled();
        await page.screenshot({
            path: testInfo.outputPath("privacy-390.png"),
            fullPage: true,
        });
        await form
            .getByRole("checkbox", {
                name: t["settings.showPlayActivity"],
                exact: true,
            })
            .uncheck();
        await save.click();
        await expect(form.getByRole("alert")).toHaveText(
            t["settings.saveError"]
        );
        await expect(
            form.getByRole("checkbox", {
                name: t["settings.showPlayActivity"],
                exact: true,
            })
        ).not.toBeChecked();
        await page.setViewportSize({ width: 320, height: 600 });
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth
            )
        ).toBe(true);
        expect(
            (await new AxeBuilder({ page }).include(".nl-settings").analyze())
                .violations
        ).toEqual([]);
    });
}
