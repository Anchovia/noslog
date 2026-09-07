import { expect, test } from "@playwright/test";

declare global {
    interface Window {
        p7ObservedHeadings?: string[];
    }
}

test.skip(
    process.env.NOSLOG_RECOVERY_FIXTURE !== "true",
    "Runs only through the local recovery verification harness."
);
const labels = {
    ko: {
        page: "페이지를 불러오지 못했습니다.",
        fatal: "NosLog을 불러오지 못했습니다.",
        retry: "다시 시도",
    },
    ja: {
        page: "ページを読み込めませんでした。",
        fatal: "NosLogを読み込めませんでした。",
        retry: "再試行",
    },
    en: {
        page: "Could Not Load the Page",
        fatal: "Could Not Load NosLog",
        retry: "Try Again",
    },
};
for (const locale of ["ko", "ja", "en"] as const) {
    test(`P7 ${locale} recoverable server failure retries the same route and restores its content`, async ({
        page,
    }) => {
        await page.setExtraHTTPHeaders({
            "x-noslog-page-fixture-error": "true",
        });
        await page.goto(`/${locale}/p7-verification?context=retained`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            labels[locale].page
        );
        await expect(page).toHaveTitle(`${labels[locale].page} | NosLog`);
        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(page.getByRole("main")).not.toContainText(
            "P7_PRIVATE_RENDER_FIXTURE"
        );
        await page.setExtraHTTPHeaders({});
        await page
            .getByRole("button", { name: labels[locale].retry, exact: true })
            .click();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            "P7 recovered"
        );
        await expect(page).toHaveURL(
            new RegExp(`/${locale}/p7-verification\\?context=retained$`)
        );
    });

    test(`P7 ${locale} fatal recovery has no wrong-language heading and reloads without broken providers`, async ({
        page,
    }, testInfo) => {
        await page.addInitScript(() => {
            const seen: string[] = [];
            Object.assign(window, { p7ObservedHeadings: seen });
            new MutationObserver(() => {
                const text = document.querySelector("h1")?.textContent;
                if (text && !seen.includes(text)) seen.push(text);
            }).observe(document, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        });
        await page.setExtraHTTPHeaders({
            "x-noslog-root-fixture-error": "true",
        });
        await page.goto(`/${locale}/p7-verification?context=retained`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            labels[locale].fatal
        );
        await expect(page).toHaveTitle(`${labels[locale].fatal} | NosLog`);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark"
        );
        await expect(page.getByRole("banner")).toHaveCount(0);
        await expect(page.getByRole("contentinfo")).toHaveCount(0);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("main")).not.toContainText(
            "P7_PRIVATE_ROOT_FIXTURE"
        );
        const headings = await page.evaluate(() => window.p7ObservedHeadings);
        expect(headings).toEqual([labels[locale].fatal]);
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 600 });
            await expect
                .poll(() =>
                    page.evaluate(
                        () => document.documentElement.scrollWidth <= innerWidth
                    )
                )
                .toBe(true);
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({
            path: testInfo.outputPath(`p7-fatal-${locale}.png`),
        });
        await page.setExtraHTTPHeaders({});
        await page
            .getByRole("button", { name: labels[locale].retry, exact: true })
            .click();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            "P7 recovered"
        );
        await expect(page).toHaveURL(
            new RegExp(`/${locale}/p7-verification\\?context=retained$`)
        );
    });
}
