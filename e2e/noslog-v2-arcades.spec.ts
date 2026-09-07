import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

test.skip(
    process.env.NOSLOG_ARCADES_FIXTURE !== "true",
    "Requires the isolated local arcade presentation harness."
);
test("P12 Figma detail composition uses pinned spacing and type at compact and wide widths", async ({
    page,
}, testInfo) => {
    await page.goto("/ko/p7-verification?fixture=arcades&state=figma-detail");
    await expect(page.locator(".nl-arcade-detail h1")).toHaveText(
        "라운드원 강남"
    );
    await expect(page.locator(".nl-arcade-hours > div").first()).toHaveText(
        "월10:00–24:00"
    );
    await expect(page.locator(".nl-arcade-hours > div").last()).toHaveText(
        "일휴무"
    );
    await expect(
        page.locator(".nl-arcade-detail__cabinets > li").last()
    ).toContainText("이용 불가 · 점검 중");
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 390, 960, 1280, 1470]) {
        await page.setViewportSize({ width, height: 900 });
        const wide = width >= 960;
        await expect(
            page
                .locator(".nl-arcade-detail__cards > .nl-arcade-detail__card")
                .first()
        ).toHaveCSS("padding", wide ? "24px" : "16px");
        await expect(page.locator(".nl-arcade-detail__cards")).toHaveCSS(
            "gap",
            wide ? "16px" : "24px"
        );
        await expect(
            page.locator(".nl-arcade-detail__cabinet-summary")
        ).toHaveCSS("font-size", wide ? "14px" : "16px");
        await expect(
            page.locator(".nl-arcade-detail__cabinet-summary")
        ).toHaveCSS("line-height", wide ? "20px" : "24px");
        await expect(page.locator(".nl-arcade-photos")).toHaveCSS(
            "height",
            wide ? "360px" : "220px"
        );
        await expect(
            page.locator(".nl-arcade-detail__map .nl-arcade-map")
        ).toHaveCSS("height", wide ? "200px" : "160px");
        if (wide) {
            await expect(
                page.locator(".nl-arcade-detail__open-state")
            ).toHaveCSS("font-size", "16px");
            await expect(
                page.locator(
                    ".nl-arcade-detail__wide-preference .nl-arcade-detail__preferred-count"
                )
            ).toHaveCSS("order", "1");
            await expect(
                page.locator(
                    ".nl-arcade-detail__wide-preference .nl-arcade-detail__preferred-count"
                )
            ).toHaveCSS("font-size", "12px");
            await expect(
                page.locator(
                    ".nl-arcade-detail__wide-contact .nl-arcade-detail__facts"
                )
            ).toHaveCSS("gap", "8px");
        } else {
            await expect(
                page.locator(
                    ".nl-arcade-detail__compact-preference .nl-arcade-detail__compact-report"
                )
            ).toHaveCSS("margin-top", "16px");
        }
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth
            )
        ).toBe(true);
        if (width === 390 || width === 1280)
            await page.screenshot({
                path: testInfo.outputPath(`figma-detail-${width}.png`),
                fullPage: true,
            });
    }
});

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P12 ${locale} discovery retains its list after map failure and stages filters`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/p7-verification?fixture=arcades`);
        await expect(page.locator(".nl-arcades__list > li")).toHaveCount(2);
        await expect(
            page.getByText(t["arcades.mapListFallback"], { exact: true })
        ).toBeVisible();
        for (const width of [320, 390, 520, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`discovery-${width}.png`),
                    fullPage: true,
                });
        }
        await page.setViewportSize({ width: 390, height: 900 });
        await page
            .getByRole("button", {
                name: t["discovery.filterSort"],
                exact: true,
            })
            .click();
        const dialog = page.getByRole("dialog");
        await dialog
            .getByRole("checkbox", { name: t["arcades.availableFilter"] })
            .check();
        await dialog
            .getByRole("button", { name: t["common.close"], exact: true })
            .click();
        await expect(page.locator(".nl-arcades__list > li")).toHaveCount(2);
        await page
            .getByRole("button", {
                name: t["discovery.filterSort"],
                exact: true,
            })
            .click();
        await expect(
            dialog.getByRole("checkbox", { name: t["arcades.availableFilter"] })
        ).not.toBeChecked();
        await dialog
            .getByRole("checkbox", { name: t["arcades.availableFilter"] })
            .check();
        await dialog.locator(".nl-arcades__apply").click();
        await expect(page.locator(".nl-arcades__list > li")).toHaveCount(1);
        expect(new URL(page.url()).searchParams.get("available")).toBe("1");
        expect(
            (await new AxeBuilder({ page }).include(".nl-arcades").analyze())
                .violations
        ).toEqual([]);
        expect(errors).toEqual([]);
        await page.goto(`/${locale}/p7-verification?fixture=arcades&mode=map`);
        await expect(page.locator(".nl-arcades__catalog")).toBeVisible();
        await expect(page.locator(".nl-arcades__list > li")).toHaveCount(2);
    });
    test(`P12 ${locale} detail reflows, scopes unknown facts and provides a guest report entry`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=arcades&state=detail`
        );
        await expect(page.locator(".nl-arcade-detail h1")).toHaveText(
            "노스로그 검증 오락실"
        );
        await expect(
            page.locator(".nl-arcade-detail__cabinets > li")
        ).toHaveCount(2);
        await expect(page.locator(".nl-arcade-photos")).toHaveCount(0);
        for (const width of [320, 390, 520, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            const compact = page.locator(
                ".nl-arcade-detail__compact-preference"
            );
            const wide = page.locator(".nl-arcade-detail__wide-preference");
            if (width === 1470) {
                await expect(wide).toBeVisible();
                await expect(compact).toBeHidden();
            } else {
                await expect(compact).toBeVisible();
                await expect(wide).toBeHidden();
            }
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`detail-${width}.png`),
                    fullPage: true,
                });
        }
        await page.setViewportSize({ width: 320, height: 700 });
        const trigger = page
            .locator(".nl-arcade-detail__compact-preference")
            .getByRole("button", { name: t["arcades.report"], exact: true });
        await trigger.click();
        await expect(
            page
                .getByRole("dialog")
                .getByRole("link", { name: t["common.login"], exact: true })
        ).toHaveAttribute("href", new RegExp(`/${locale}/login\\?returnTo=`));
        await page.getByRole("dialog").press("Escape");
        await expect(trigger).toBeFocused();
        expect(
            (
                await new AxeBuilder({ page })
                    .include(".nl-arcade-detail")
                    .analyze()
            ).violations
        ).toEqual([]);
        await page.goto(
            `/${locale}/p7-verification?fixture=arcades&state=unknown`
        );
        await expect(
            page.locator(".nl-arcade-detail__cabinets > li")
        ).toHaveCount(0);
        await expect(
            page.getByText(t["arcades.addressPending"], { exact: true })
        ).toBeVisible();
        await expect(
            page
                .locator(".nl-arcade-detail__compact-preference")
                .getByText(t["arcades.collectingPreference"], { exact: true })
        ).toBeVisible();
    });
    test(`P12 ${locale} photo gallery supports keyboard controls and restores focus`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=arcades&state=photos`
        );
        await page.setViewportSize({ width: 390, height: 800 });
        const main = page.locator(".nl-arcade-photos__main");
        await expect(main.locator("img")).toHaveAttribute(
            "alt",
            "Synthetic gallery test image 1"
        );
        await page
            .getByRole("button", { name: t["arcades.photoNext"], exact: true })
            .click();
        await expect(main.locator("img")).toHaveAttribute(
            "alt",
            "Synthetic gallery test image 2"
        );
        await main.focus();
        await main.press("Enter");
        const dialog = page.getByRole("dialog");
        await expect(dialog.locator("img")).toHaveAttribute(
            "alt",
            "Synthetic gallery test image 2"
        );
        await dialog
            .getByRole("button", { name: t["arcades.photoNext"], exact: true })
            .click();
        await expect(dialog.locator("img")).toHaveAttribute(
            "alt",
            "Synthetic gallery test image 3"
        );
        await dialog.press("Escape");
        await expect(main).toBeFocused();
        await page.setViewportSize({ width: 1470, height: 900 });
        await expect(page.locator(".nl-arcade-photos")).toHaveCSS(
            "height",
            "360px"
        );
        const thumbnail = page
            .locator(".nl-arcade-photos__thumbnails button")
            .first();
        await thumbnail.click();
        await dialog.press("Escape");
        await expect(thumbnail).toBeFocused();
        await page.screenshot({
            path: testInfo.outputPath("gallery-wide.png"),
            fullPage: true,
        });
        expect(
            (
                await new AxeBuilder({ page })
                    .include(".nl-arcade-detail")
                    .analyze()
            ).violations
        ).toEqual([]);
    });
}
