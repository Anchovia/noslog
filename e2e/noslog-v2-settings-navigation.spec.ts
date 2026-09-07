import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P10 ${locale} guest overview and private category return paths`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`/${locale}/settings`);
        const navigation = page.getByRole("navigation", {
            name: t["settings.overview"],
            exact: true,
        });
        await expect(navigation.getByRole("link")).toHaveCount(1);
        await navigation.getByRole("link").click();
        await expect(page).toHaveURL(
            new RegExp(`/${locale}/settings\\?category=experience$`)
        );
        await expect(
            page.getByRole("heading", {
                name: t["settings.appearance"],
                exact: true,
            })
        ).toBeVisible();
        await page
            .getByRole("link", { name: t["settings.overview"], exact: true })
            .click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/settings$`));
        for (const category of [
            "profile",
            "privacy",
            "connections",
            "account",
        ]) {
            await page.goto(`/${locale}/settings?category=${category}`);
            await expect(page).toHaveURL(new RegExp(`/${locale}/login\\?`));
            expect(new URL(page.url()).searchParams.get("returnTo")).toBe(
                `/${locale}/settings?category=${category}`
            );
            await expect(page.locator(".nl-settings__form")).toHaveCount(0);
        }
        await page.goto(`/${locale}/settings?category=unknown`);
        await expect(navigation).toBeVisible();
        await expect(
            page.getByRole("heading", {
                name: t["settings.overview"],
                exact: true,
            })
        ).toBeVisible();
    });
}
