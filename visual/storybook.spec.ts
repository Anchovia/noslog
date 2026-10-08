import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

async function story(page: Page, id: string, locale: Locale = "ko") {
    const failures: string[] = [];
    page.on("pageerror", (error) => failures.push(error.message));
    await page.goto(
        `/iframe.html?id=${id}&viewMode=story&globals=locale:${locale}`
    );
    await expect(page.locator("#storybook-root")).not.toBeEmpty();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await page.evaluate(async () => {
        await document.fonts.ready;
    });
    await expect(page.locator(".sb-errordisplay")).toBeHidden();
    expect(failures).toEqual([]);
}

for (const [name, id] of [
    ["buttons", "ui-button--variants-and-sizes"],
    ["form-error", "ui-formfield--error"],
    ["select", "ui-select--default"],
    ["dialog", "ui-modaldialog--initially-open"],
] as const) {
    test(`foundation ${name}`, async ({ page }) => {
        await story(page, id);
        await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
    });
}
for (const locale of ["ko", "ja", "en"] as const) {
    test(`onboarding ${locale}`, async ({ page }) => {
        await story(page, "features-profile-onboardingform--default", locale);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            getMessages(locale)["onboarding.title"]
        );
        await expect(page).toHaveScreenshot(`onboarding-${locale}.png`, {
            fullPage: true,
        });
    });
    test(`feedback ${locale}`, async ({ page }) => {
        await story(page, "features-feedback-feedbackdialog--open", locale);
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(
            page.getByRole("textbox", {
                name: getMessages(locale)["feedback.contentLabel"],
            })
        ).toBeVisible();
        await expect(page).toHaveScreenshot(`feedback-${locale}.png`, {
            fullPage: true,
        });
    });
    test(`responsive forms ${locale}`, async ({ page }) => {
        for (const id of [
            "features-profile-onboardingform--default",
            "features-feedback-feedbackdialog--open",
        ]) {
            await story(page, id, locale);
            for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1280]) {
                await page.setViewportSize({ width, height: 900 });
                const input = page.getByRole("textbox").first();
                await expect(input).toHaveCSS("font-size", "16px");
                await expect
                    .poll(() =>
                        page.evaluate(
                            () =>
                                document.documentElement.scrollWidth <=
                                innerWidth
                        )
                    )
                    .toBe(true);
                if (id.includes("feedback")) {
                    await expect(
                        page.locator(
                            width < 672 ? ".nl-full-dialog" : ".nl-dialog"
                        )
                    ).toBeVisible();
                } else {
                    await expect(input).toHaveCSS(
                        "height",
                        width >= 1056 ? "40px" : "44px"
                    );
                }
            }
        }
    });
}
