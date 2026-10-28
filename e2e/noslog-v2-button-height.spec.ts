import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

for (const locale of ["ko", "ja", "en"] as const) {
    // 주 · 보조 버튼 기본은 모든 폭 --nl-control-height-large(40). 1056 미만은 고스트 「초기화」 의 줄 높이도 40
    test(`${locale} standard buttons follow the control height across page modes`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(`/${locale}/music`);
        for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            const height = 40;
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
                // 잉크 = 상자 왼쪽 + 경계 + 좌우 안쪽. 상자 왼쪽은 발 안쪽 16 에서 안쪽(11 + 경계 1)만큼 당긴 4
                await expect
                    .poll(() =>
                        reset.evaluate((element) => {
                            const style = getComputedStyle(element);
                            return (
                                element.getBoundingClientRect().x +
                                parseFloat(style.borderLeftWidth) +
                                parseFloat(style.paddingLeft)
                            );
                        })
                    )
                    .toBe(16);
                await page.keyboard.press("Escape");
                await expect(dialog).toHaveCount(0);
            }
        }
    });
}
