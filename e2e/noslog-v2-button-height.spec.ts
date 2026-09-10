import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

for (const locale of ["ko", "ja", "en"] as const) {
    test(`${locale} standard buttons stay 40px across page modes`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(`/${locale}/music`);
        for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            const more = page
                .locator("button.nl-button")
                .filter({ hasText: /20/ })
                .last();
            await expect(more).toHaveCSS("min-height", "40px");
            if (width < 1056) {
                await page
                    .getByRole("button", {
                        name: t["music.filter"],
                        exact: true,
                    })
                    .click();
                const dialog = page.getByRole("dialog");
                const apply = dialog.locator("button.nl-button").last();
                await expect(apply).toHaveCSS("min-height", "40px");
                await expect
                    .poll(async () => (await apply.boundingBox())?.height)
                    .toBe(40);
                await page.keyboard.press("Escape");
                await expect(dialog).toHaveCount(0);
            }
        }
    });
}
