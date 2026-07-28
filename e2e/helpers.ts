import { expect, type Page } from "@playwright/test";

export const localeCopy = {
    ko: {
        lang: "ko",
        home: "NosLog",
        music: "악곡 검색",
        rankings: "유저 랭킹",
        tiers: "서열표",
        login: "Discord로 계속하기",
        openMenu: "전체 메뉴 열기",
    },
    ja: {
        lang: "ja",
        home: "NosLog",
        music: "楽曲検索",
        rankings: "ユーザーランキング",
        tiers: "難易度表",
        login: "Discordで続ける",
        openMenu: "全メニューを開く",
    },
    en: {
        lang: "en",
        home: "NosLog",
        music: "Song Search",
        rankings: "User Rankings",
        tiers: "Tier Lists",
        login: "Continue with Discord",
        openMenu: "Open full menu",
    },
} as const;

export type TestLocale = keyof typeof localeCopy;

export async function expectNoHorizontalOverflow(page: Page) {
    const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth + 1
    );
}

export async function expectPageLoaded(page: Page) {
    await page.waitForLoadState("networkidle");
    const body = page.locator("body");

    for (const errorText of [
        "페이지를 불러오지 못했습니다.",
        "ページを読み込めませんでした。",
        "This page couldn’t load",
        "Could Not Load the Page",
    ]) {
        await expect(body).not.toContainText(errorText);
    }

    const untranslatedKey = await body.evaluate((element) => {
        const text = (element as HTMLElement).innerText;
        return (
            text.match(
                /\b(?:common|header|home|music|rankings|tiers|bingo|exams|arcades|sync|profile|settings|auth|onboarding|chart|feedback)\.[a-zA-Z][\w.]*\b/
            )?.[0] ?? null
        );
    });
    expect(untranslatedKey).toBeNull();
}

export async function expectLocalizedDocument(page: Page, locale: TestLocale) {
    await expect(page.locator("html")).toHaveAttribute(
        "lang",
        localeCopy[locale].lang
    );
    await expect(page).toHaveURL(new RegExp(`/${locale}(?:/|\\?|$)`));
}

export async function expectAccessiblePageStructure(page: Page) {
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator('a[href="#main-content"]')).toHaveCount(1);

    const unnamedControls = await page
        .locator("button, a[href], input:not([type=hidden]), select, textarea")
        .evaluateAll((elements) =>
            elements
                .filter((element) => {
                    if (
                        element instanceof HTMLElement &&
                        (element.hidden ||
                            element.getAttribute("aria-hidden") === "true")
                    ) {
                        return false;
                    }

                    const ariaLabel = element.getAttribute("aria-label");
                    const labelledBy = element.getAttribute("aria-labelledby");
                    const title = element.getAttribute("title");
                    const placeholder = element.getAttribute("placeholder");
                    const text = element.textContent?.trim();
                    const imageAlt = element
                        .querySelector("img")
                        ?.getAttribute("alt")
                        ?.trim();
                    const id = element.getAttribute("id");
                    const explicitLabel =
                        id &&
                        document.querySelector(
                            `label[for="${CSS.escape(id)}"]`
                        );
                    const wrappedLabel = element.closest("label");

                    return !(
                        ariaLabel ||
                        labelledBy ||
                        title ||
                        placeholder ||
                        text ||
                        imageAlt ||
                        explicitLabel ||
                        wrappedLabel
                    );
                })
                .slice(0, 10)
                .map((element) => element.outerHTML.slice(0, 180))
        );

    expect(unnamedControls).toEqual([]);
}

export async function readPerformanceSnapshot(page: Page) {
    return page.evaluate(() => {
        const navigation = performance.getEntriesByType("navigation")[0] as
            PerformanceNavigationTiming | undefined;
        const resources = performance.getEntriesByType(
            "resource"
        ) as PerformanceResourceTiming[];
        const firstContentfulPaint = (
            performance.getEntriesByName("first-contentful-paint")[0] as
                PerformanceEntry | undefined
        )?.startTime;

        return {
            domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? 0,
            loadMs: navigation?.loadEventEnd ?? 0,
            firstContentfulPaintMs: firstContentfulPaint ?? 0,
            requestCount: resources.length,
            transferBytes: resources.reduce(
                (total, resource) => total + (resource.transferSize || 0),
                0
            ),
        };
    });
}
