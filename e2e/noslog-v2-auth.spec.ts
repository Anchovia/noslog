import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P9 ${locale} login matches the compact auth shell and accessible recovery`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/login`);
        await expect(page.locator(".nl-auth-column")).toBeVisible();
        await expect(
            page.getByRole("combobox", {
                name: t["header.language"],
                exact: true,
            })
        ).toContainText(
            locale === "ko" ? "한국어" : locale === "ja" ? "日本語" : "English"
        );
        await expect(page.getByRole("banner")).toHaveCount(0);
        await expect(page.getByRole("contentinfo")).toHaveCount(0);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
            "content",
            /noindex/
        );
        for (const width of [320, 390, 520, 768, 1280, 1470]) {
            await page.setViewportSize({ width, height: 844 });
            const box = await page.locator(".nl-auth-column").boundingBox();
            expect(box!.width).toBe(Math.min(358, width - 32));
            const main = await page.locator(".nl-auth-main").boundingBox();
            expect(
                Math.abs(box!.y + box!.height / 2 - main!.y - main!.height / 2)
            ).toBeLessThan(1);
            expect(Math.abs(box!.x + box!.width / 2 - width / 2)).toBeLessThan(
                1
            );
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            if (width === 390 || width === 1280) {
                await page.screenshot({
                    path: testInfo.outputPath(`login-${width}.png`),
                    fullPage: true,
                });
            }
        }
        await page.setViewportSize({ width: 320, height: 500 });
        expect(
            (await new AxeBuilder({ page }).include(".nl-auth").analyze())
                .violations
        ).toEqual([]);
        for (const state of [
            "cancelled",
            "invalid_state",
            "token_exchange",
            "oauth_config",
            "session_expired",
            "destination_rejected",
        ]) {
            await page.goto(`/${locale}/login?error=${state}`);
            await expect(
                page.getByRole("alert").filter({ hasText: /.+/ }).first()
            ).toBeVisible();
            const line = await page
                .locator(".nl-auth-actions > p")
                .boundingBox();
            const action = await page.locator(".nl-auth-discord").boundingBox();
            expect(line!.y + line!.height).toBeLessThanOrEqual(action!.y);
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
        }
        await page.goto(`/${locale}/login?returnTo=/bookmarklet`);
        await expect(page.locator(".nl-auth-actions")).toContainText(
            t["header.dataSync"]
        );
        await expect(page.locator(".nl-auth-discord")).toHaveAttribute(
            "href",
            `/discord/start?returnTo=${encodeURIComponent(`/${locale}/bookmarklet`)}`
        );
        await page.goto(
            `/${locale}/login?returnTo=${encodeURIComponent("//example.com")}`
        );
        await expect(page.locator(".nl-auth-actions > p")).toHaveText(
            t["auth.error.destinationRejected"]
        );
        await expect(page.locator(".nl-auth-discord")).toHaveAttribute(
            "href",
            `/discord/start?returnTo=${encodeURIComponent(`/${locale}`)}`
        );
        expect(errors).toEqual([]);
    });

    test(`P9 ${locale} language control preserves destination and restores focus`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(`/${locale}/login?returnTo=/bookmarklet`);
        const trigger = page.getByRole("combobox", {
            name: t["header.language"],
            exact: true,
        });
        await trigger.click();
        await expect(page.getByRole("option")).toHaveCount(3);
        await page.keyboard.press("Escape");
        await expect(trigger).toBeFocused();
        await trigger.click();
        await page
            .getByRole("option", {
                name: locale === "ja" ? "English" : "日本語",
                exact: true,
            })
            .click();
        await expect(page).toHaveURL(
            (url) =>
                url.pathname === `/${locale === "ja" ? "en" : "ja"}/login` &&
                url.searchParams.get("returnTo") === "/bookmarklet"
        );
        await expect(page.locator(".nl-auth-discord")).toHaveAttribute(
            "href",
            `/discord/start?returnTo=${encodeURIComponent(`/${locale === "ja" ? "en" : "ja"}/bookmarklet`)}`
        );
    });
}
