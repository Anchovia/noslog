import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
    getPrivacyCopy,
    privacyHistoryCopy,
} from "@/features/privacy/content/privacyContent";

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P15 ${locale} complete policy, reflow, contents and history`, async ({
        page,
    }, testInfo) => {
        const copy = getPrivacyCopy(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/privacy`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            copy.title
        );
        await expect(page.locator(".nl-privacy-section")).toHaveCount(12);
        await expect(
            page.locator(".nl-privacy .nl-status--warning")
        ).toHaveCount(4);
        for (const width of [320, 390, 520, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            const wide = page.locator(".nl-privacy-contents__wide");
            if (width === 1470) await expect(wide).toBeVisible();
            else await expect(wide).toBeHidden();
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`privacy-${width}.png`),
                    fullPage: true,
                });
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator(".nl-privacy-contents summary").click();
        const toc = page.locator(".nl-privacy-contents__compact nav");
        await expect(toc.getByRole("link")).toHaveCount(12);
        await toc
            .getByRole("link", { name: copy.sections[8].title, exact: true })
            .click();
        await expect(page.locator("#privacy-storage")).toBeFocused();
        await expect(
            page.locator(".nl-privacy-contents__compact")
        ).not.toHaveAttribute("open", "");
        expect(
            await page
                .locator("#privacy-storage")
                .evaluate((el) => el.getBoundingClientRect().top)
        ).toBeGreaterThanOrEqual(60);
        await expect(
            page.getByRole("link", {
                name: "sodacandy77@naver.com",
                exact: true,
            })
        ).toHaveAttribute("href", "mailto:sodacandy77@naver.com");
        expect(
            (await new AxeBuilder({ page }).include(".nl-privacy").analyze())
                .violations
        ).toEqual([]);
        await page
            .getByRole("link", { name: copy.historyLink, exact: true })
            .click();
        await expect(
            page.getByText(privacyHistoryCopy[locale].empty, { exact: true })
        ).toBeVisible();
        await page
            .getByRole("link", { name: copy.title, exact: true })
            .first()
            .click();
        await expect(page.locator(".nl-privacy-section")).toHaveCount(12);
        expect(errors).toEqual([]);
    });

    test(`P15 ${locale} text spacing and complete print flow`, async ({
        page,
    }, testInfo) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await page.goto(`/${locale}/privacy`);
        await expect(page.locator(".nl-privacy-section")).toHaveCount(12);
        const textSpacing = await page.addStyleTag({
            content:
                ".nl-privacy * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } .nl-privacy p { margin-bottom: 2em !important; }",
        });
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth
            )
        ).toBe(true);
        await textSpacing.evaluate((style) =>
            style.parentNode?.removeChild(style)
        );
        await page.emulateMedia({ media: "print" });
        await expect(page.locator("html")).toHaveCSS(
            "background-color",
            "rgb(255, 255, 255)"
        );
        await expect(page.locator("body")).toHaveCSS(
            "background-color",
            "rgb(255, 255, 255)"
        );
        await expect(page.locator(".nl-privacy-contents")).toBeHidden();
        await expect(page.locator(".nl-header")).toBeHidden();
        await expect(page.locator(".nl-footer")).toBeHidden();
        await expect(page.locator("#privacy-history")).toBeVisible();
        await expect(
            page.locator(".nl-privacy .nl-status--warning")
        ).toHaveCount(4);
        expect(
            (await new AxeBuilder({ page }).include(".nl-privacy").analyze())
                .violations
        ).toEqual([]);
        if (testInfo.project.name === "desktop-chromium")
            await page.pdf({
                path: testInfo.outputPath(`privacy-${locale}.pdf`),
                format: "A4",
                printBackground: true,
            });
    });
}
