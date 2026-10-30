import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
    getPrivacyCopy,
    PRIVACY_PREVIOUS_VERSIONS,
    privacyHistoryCopy,
    privacyVersionPeriod,
} from "@/features/privacy/content/privacy-content";

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P15 ${locale} contents selection follows navigation and reading`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1470, height: 900 });
        await page.goto(`/${locale}/privacy`);
        const wide = page.locator(".nl-privacy-contents__wide");
        const selected = wide.locator('[aria-current="location"]');
        await expect(selected).toHaveAttribute("href", "#privacy-operator");
        await wide.locator('a[href="#privacy-storage"]').click();
        await expect(selected).toHaveAttribute("href", "#privacy-storage");
        await expect(page.locator("#privacy-storage")).toBeFocused();
        await wide.locator('a[href="#privacy-history"]').click();
        await expect(selected).toHaveAttribute("href", "#privacy-history");
        await page.goBack();
        await expect(selected).toHaveAttribute("href", "#privacy-storage");
        await page.goForward();
        await expect(selected).toHaveAttribute("href", "#privacy-history");
        for (const id of ["data", "destruction", "operator"]) {
            // 읽는 위치 = 절 제목의 scroll-margin-top(헤더 높이 + 16, privacy.css)
            await page.locator(`#privacy-${id}`).evaluate((target) =>
                target.scrollIntoView({
                    block: "start",
                    behavior: "instant",
                })
            );
            await expect(selected).toHaveAttribute("href", `#privacy-${id}`);
        }
        await page.goto(`/${locale}/privacy#privacy-storage`);
        await expect(selected).toHaveAttribute("href", "#privacy-storage");
        for (const width of [1056, 1055, 672, 671, 320, 390, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            const visibleContents = page.locator(
                width >= 1056
                    ? ".nl-privacy-contents__wide"
                    : ".nl-privacy-contents__compact"
            );
            if (width < 1056) await visibleContents.locator("summary").click();
            await visibleContents.locator('a[href="#privacy-data"]').click();
            await expect(
                visibleContents.locator('[aria-current="location"]')
            ).toHaveAttribute("href", "#privacy-data");
            await expect(page.locator("#privacy-data")).toBeFocused();
            if (width < 1056)
                await expect(visibleContents).not.toHaveAttribute("open", "");
        }
    });

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
        await expect(page.locator(".nl-privacy-section")).toHaveCount(
            copy.sections.length
        );
        await expect(
            page.locator(".nl-privacy .nl-status--warning")
        ).toHaveCount(1);
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
        await expect(toc.getByRole("link")).toHaveCount(copy.sections.length);
        await toc
            .getByRole("link", {
                name: copy.sections.find(({ id }) => id === "storage")!.title,
                exact: true,
            })
            .click();
        await expect(page.locator("#privacy-storage")).toBeFocused();
        await expect(
            page.locator(".nl-privacy-contents__compact")
        ).not.toHaveAttribute("open", "");
        // 머리글에 가리지 않음 — 전역 scroll-padding 이 헤더 높이만큼 비운다(2026-10-27 가이드 고를 곳 27)
        const headerBottom = await page
            .locator(".nl-header")
            .evaluate((el) => el.getBoundingClientRect().bottom);
        expect(
            await page
                .locator("#privacy-storage")
                .evaluate((el) => el.getBoundingClientRect().top)
        ).toBeGreaterThanOrEqual(headerBottom);
        await expect(
            page
                .getByRole("link", {
                    name: "sodacandy77@naver.com",
                    exact: true,
                })
                .first()
        ).toHaveAttribute("href", "mailto:sodacandy77@naver.com");
        expect(
            (await new AxeBuilder({ page }).include(".nl-privacy").analyze())
                .violations
        ).toEqual([]);
        await page
            .getByRole("link", { name: copy.historyLink, exact: true })
            .click();
        const [previous] = PRIVACY_PREVIOUS_VERSIONS;
        const period = privacyVersionPeriod(previous, locale);
        await page.getByRole("link", { name: period, exact: true }).click();
        await expect(page.locator(".nl-privacy-section")).toHaveCount(12);
        await expect(
            page.getByText(privacyHistoryCopy[locale].period(period), {
                exact: true,
            })
        ).toBeVisible();
        // 날짜 · 적용 기간 두 줄은 모두 쪽 제목 아래 설명 줄 16/24
        const identityLines = page.locator(".nl-privacy-identity > p");
        await expect(identityLines).toHaveCount(2);
        for (const line of await identityLines.all()) {
            await expect(line).toHaveCSS("font-size", "16px");
            await expect(line).toHaveCSS("line-height", "24px");
        }
        await page
            .getByRole("link", {
                name: privacyHistoryCopy[locale].title,
                exact: true,
            })
            .click();
        await page
            .getByRole("link", { name: copy.title, exact: true })
            .first()
            .click();
        await expect(page.locator(".nl-privacy-section")).toHaveCount(
            copy.sections.length
        );
        expect(errors).toEqual([]);
    });

    test(`P15 ${locale} text spacing and complete print flow`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await page.goto(`/${locale}/privacy`);
        await expect(page.locator(".nl-privacy-section")).toHaveCount(
            getPrivacyCopy(locale).sections.length
        );
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
        ).toHaveCount(1);
        expect(
            (await new AxeBuilder({ page }).include(".nl-privacy").analyze())
                .violations
        ).toEqual([]);
    });
}
