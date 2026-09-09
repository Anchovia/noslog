import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const copy = {
    ko: {
        missing: "페이지를 찾을 수 없습니다.",
        home: "홈으로 이동",
        check: "다시 확인",
        maintenance: "점검 중입니다.",
    },
    ja: {
        missing: "ページが見つかりません。",
        home: "ホームへ",
        check: "再確認",
        maintenance: "ただいまメンテナンス中です。",
    },
    en: {
        missing: "Page Not Found",
        home: "Go Home",
        check: "Check Again",
        maintenance: "We're performing maintenance.",
    },
};

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P7 ${locale} real 404 preserves the ordinary shell, focus and responsive reading measure`, async ({
        page,
        browserName,
    }) => {
        const response = await page.goto(`/${locale}/p7-unmatched-route`);
        expect(response?.status()).toBe(404);
        await expect(page).toHaveTitle(`${copy[locale].missing} | NosLog`);
        await expect(
            page.locator('meta[name="robots"][content*="noindex"]').first()
        ).toBeAttached();
        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(page.getByRole("contentinfo")).toHaveCount(1);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            copy[locale].missing
        );
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 600 });
            await expect
                .poll(() =>
                    page.evaluate(
                        () => document.documentElement.scrollWidth <= innerWidth
                    )
                )
                .toBe(true);
            const heading = await page
                .getByRole("heading", { level: 1 })
                .boundingBox();
            const logo = await page
                .getByRole("banner")
                .getByRole("link", { name: "NosLog", exact: true })
                .boundingBox();
            expect(Math.abs(heading!.x - logo!.x)).toBeLessThan(1);
            expect(
                (await page.locator(".nl-recovery").boundingBox())!.width
            ).toBeLessThanOrEqual(768);
        }
        // macOS WebKit's default Tab policy skips links; Option+Tab includes them.
        await page.keyboard.press(
            browserName === "webkit" && process.platform === "darwin"
                ? "Alt+Tab"
                : "Tab"
        );
        await expect(page.locator(".nl-skip-link")).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("main")).toBeFocused();
        const audit = await new AxeBuilder({ page })
            .include(".nl-app")
            .analyze();
        expect(audit.violations).toEqual([]);
        await page.getByRole("main").getByRole("link").click();
        await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    });

    test(`P7 ${locale} maintenance uses a minimal dark shell and manual document refresh`, async ({
        page,
    }) => {
        let documents = 0;
        page.on("request", (request) => {
            if (
                request.isNavigationRequest() &&
                request.frame() === page.mainFrame()
            )
                documents += 1;
        });
        await page.goto(`/${locale}/maintenance`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            copy[locale].maintenance
        );
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark"
        );
        await expect(page.getByRole("banner")).toHaveCount(0);
        await expect(page.getByRole("contentinfo")).toHaveCount(0);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("main").locator("time")).toHaveCount(0);
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 400 });
            await expect
                .poll(() =>
                    page.evaluate(
                        () => document.documentElement.scrollWidth <= innerWidth
                    )
                )
                .toBe(true);
            expect(
                (await page.getByRole("main").boundingBox())!.width
            ).toBeLessThanOrEqual(1000);
        }
        await page
            .getByRole("button", { name: copy[locale].check, exact: true })
            .click();
        await expect.poll(() => documents).toBe(2);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            copy[locale].maintenance
        );
        expect(
            (await new AxeBuilder({ page }).include("main").analyze())
                .violations
        ).toEqual([]);
    });
}
