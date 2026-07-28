import { expect, test } from "@playwright/test";

import {
    expectAccessiblePageStructure,
    expectLocalizedDocument,
    expectNoHorizontalOverflow,
    expectPageLoaded,
    localeCopy,
    type TestLocale,
} from "./helpers";

const locales = Object.keys(localeCopy) as TestLocale[];

const coreRoutes = [
    { path: "", heading: "home" },
    { path: "/music", heading: "music" },
    { path: "/rankings", heading: "rankings" },
    { path: "/tiers", heading: "tiers" },
] as const;

const secondaryRoutes = [
    "/bingo",
    "/exams",
    "/gamecenter",
    "/bookmarklet",
    "/privacy",
    "/login",
] as const;

for (const locale of locales) {
    test(`${locale} 핵심 공개 페이지가 번역된 경로로 열린다`, async ({
        page,
    }) => {
        for (const route of coreRoutes) {
            await test.step(`${locale}${route.path || "/"}`, async () => {
                await page.goto(`/${locale}${route.path}`);
                await expectPageLoaded(page);
                await expectLocalizedDocument(page, locale);
                await expect(
                    page.getByRole("heading", {
                        name: localeCopy[locale][route.heading],
                        exact: true,
                    })
                ).toBeVisible();
                await expectNoHorizontalOverflow(page);
                await expectAccessiblePageStructure(page);
            });
        }
    });
}

test("모바일에서 모든 보조 공개 페이지의 다국어 경로를 확인한다", async ({
    page,
}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium");

    for (const locale of locales) {
        for (const path of secondaryRoutes) {
            await test.step(`${locale}${path}`, async () => {
                await page.goto(`/${locale}${path}`);
                await expectPageLoaded(page);
                await expectLocalizedDocument(page, locale);
                await expectNoHorizontalOverflow(page);
                await expectAccessiblePageStructure(page);
            });
        }
    }
});

test("비로그인 사용자가 전체 메뉴에서 언어를 변경한다", async ({ page }) => {
    await page.goto("/ko/music?sort=level&view=grid");
    await expectPageLoaded(page);

    await page.getByRole("button", { name: localeCopy.ko.openMenu }).click();
    const menu = page.getByRole("navigation", { name: "전체 메뉴" });
    await expect(menu.getByRole("region", { name: "언어" })).toBeVisible();
    await menu.getByRole("link", { name: "日本語" }).click();

    await expect(page).toHaveURL(
        /\/ja\/music\?(?=.*sort=level)(?=.*view=grid)/
    );
    await expectLocalizedDocument(page, "ja");
    await expect(
        page.getByRole("button", { name: localeCopy.ja.openMenu })
    ).toBeVisible();
});

test("비로그인 설정 접근은 같은 언어의 로그인 화면으로 연결한다", async ({
    page,
}) => {
    await page.goto("/en/profile/settings");

    await expect(page).toHaveURL(/\/en\/login$/);
    await expectLocalizedDocument(page, "en");
    await expect(
        page.getByRole("link", { name: localeCopy.en.login })
    ).toBeVisible();
});
