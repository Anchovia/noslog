import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

test.skip(
    process.env.NOSLOG_AUTH_FIXTURE !== "true",
    "Requires the isolated local authentication fixture."
);
for (const locale of ["ko", "ja", "en"] as const) {
    test(`P9 ${locale} onboarding keeps inputs through validation, duplicate and save failure`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/p9-verification?state=long`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            t["onboarding.title"]
        );
        await expect(
            page.getByRole("region", { name: t["onboarding.connectedAccount"] })
        ).toContainText("NosLog fixture");
        for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1470, 1055]) {
            await page.setViewportSize({ width, height: 600 });
            await expect(page.locator("#onboarding-nickname")).toHaveCSS(
                "height",
                "44px"
            );
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            const column = await page.locator(".nl-auth-column").boundingBox();
            expect(column!.width).toBeLessThanOrEqual(
                Math.min(358, width - 32)
            );
            if (width === 390 || width === 1470) {
                await page.screenshot({
                    path: testInfo.outputPath(`onboarding-${width}.png`),
                    fullPage: true,
                });
            }
        }
        await page.setViewportSize({ width: 320, height: 500 });
        expect(
            (await new AxeBuilder({ page }).include(".nl-auth").analyze())
                .violations
        ).toEqual([]);
        const input = page.getByRole("textbox", {
            name: t["onboarding.nickname"],
            exact: true,
        });
        const submit = page.getByRole("button", {
            name: t["onboarding.start"],
            exact: true,
        });
        await expect(submit).toHaveCSS("min-height", "40px");
        await submit.click();
        await expect(input).toBeFocused();
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await input.fill("Ｎos 한글カナ");
        await page
            .getByRole("radio", {
                name: t["onboarding.country.jp"],
                exact: true,
            })
            .check();
        await submit.click();
        await expect(page.locator(".nl-auth-form")).toHaveAttribute(
            "aria-busy",
            "true"
        );
        await expect(
            page.getByRole("button", {
                name: t["onboarding.setting"],
                exact: true,
            })
        ).toBeDisabled();
        await expect(
            page
                .getByRole("alert")
                .filter({ hasText: t["onboarding.error.generic"] })
        ).toBeVisible();
        await expect(input).toHaveValue("Ｎos 한글カナ");
        await expect(
            page.getByRole("radio", {
                name: t["onboarding.country.jp"],
                exact: true,
            })
        ).toBeChecked();
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await page.goto(`/${locale}/p9-verification?state=duplicate`);
        await input.fill("Ｎos 한글カナ");
        await page
            .getByRole("radio", {
                name: t["onboarding.country.jp"],
                exact: true,
            })
            .check();
        await submit.click();
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expect(input).toBeFocused();
        await expect(input).toHaveValue("Ｎos 한글カナ");
        await expect(page.locator("#onboarding-nickname-error")).toHaveText(
            t["onboarding.error.nicknameTaken"]
        );
        expect(errors).toEqual([]);
    });
}
