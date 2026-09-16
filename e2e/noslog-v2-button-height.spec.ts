import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

for (const locale of ["ko", "ja", "en"] as const) {
    // 버튼은 입력칸과 같은 --nl-control-height — 1056px 미만 44 · 이상 40 (2026-09-14 H2)
    test(`${locale} standard buttons follow the control height across page modes`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(`/${locale}/music`);
        for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            const height = width >= 1056 ? 40 : 44;
            const more = page
                .locator("button.nl-button")
                .filter({ hasText: /20/ })
                .last();
            await expect(more).toHaveCSS("min-height", `${height}px`);
            if (width < 1056) {
                await page
                    .getByRole("button", {
                        name: t["music.filter"],
                        exact: true,
                    })
                    .click();
                const dialog = page.getByRole("dialog");
                const apply = dialog.locator("button.nl-button").last();
                await expect(apply).toHaveCSS("min-height", `${height}px`);
                await expect
                    .poll(async () => (await apply.boundingBox())?.height)
                    .toBe(height);
                // 발 왼쪽 「초기화」 는 주 액션과 같은 줄 = L (2026-09-16), 잉크는 발 안쪽 16 선
                const reset = dialog.getByRole("button", {
                    name: t["common.reset"],
                    exact: true,
                });
                await expect(reset).toHaveCSS("min-height", `${height}px`);
                await expect
                    .poll(async () => (await reset.boundingBox())?.x)
                    .toBe(0);
                await page.keyboard.press("Escape");
                await expect(dialog).toHaveCount(0);
            }
        }
    });
}
