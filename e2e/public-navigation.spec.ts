import { expect, test } from "@playwright/test";

import { expectNoHorizontalOverflow, expectPageLoaded } from "./helpers";

const publicRoutes = [
    { label: "악곡", path: "/ko/music", heading: "악곡 검색" },
    { label: "랭킹", path: "/ko/rankings", heading: "유저 랭킹" },
    { label: "서열", path: "/ko/tiers", heading: "서열표" },
    {
        label: "빙고",
        path: "/ko/bingo",
        heading: "빙고",
        requiresMenu: true,
    },
];

test("모바일 헤더에서 주요 공개 페이지로 이동한다", async ({ page }) => {
    await page.goto("/ko");
    await expectPageLoaded(page);

    const banner = page.getByRole("banner");
    const primaryNavigation = banner.getByRole("navigation", {
        name: "주요 메뉴",
    });
    await expect(primaryNavigation).toBeVisible();
    await expect(banner.getByRole("link", { name: "로그인" })).toBeVisible();

    for (const route of publicRoutes) {
        const navigation = route.requiresMenu
            ? banner.getByRole("navigation", { name: "전체 메뉴" })
            : primaryNavigation;

        if (route.requiresMenu) {
            await banner
                .getByRole("button", { name: "전체 메뉴 열기" })
                .click();
            await expect(navigation).toBeVisible();
        }

        await navigation.getByRole("link", { name: route.label }).click();
        await expect(page).toHaveURL(new RegExp(`${route.path}(?:\\?.*)?$`));
        await expect(
            page.getByRole("heading", { name: route.heading, exact: true })
        ).toBeVisible();
        await expectPageLoaded(page);
        await expectNoHorizontalOverflow(page);

        if (route.requiresMenu) {
            await expect(
                banner.getByRole("button", { name: "전체 메뉴 열기" })
            ).toBeVisible();
        }
    }
});

test("로그인 페이지에서 Discord 로그인과 비회원 이동을 제공한다", async ({
    page,
}) => {
    await page.goto("/ko/login");

    await expect(
        page.getByRole("heading", { name: "NosLog", exact: true })
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "Discord로 계속하기" })
    ).toHaveAttribute("href", /\/discord\/start/);

    await page.getByRole("link", { name: "로그인 없이 둘러보기" }).click();
    await expect(page).toHaveURL(/\/ko$/);
    await expectNoHorizontalOverflow(page);
});

test("랭킹 페이지에서 Basic과 Recital을 전환한다", async ({ page }) => {
    await page.goto("/ko/rankings");

    const recitalButton = page.getByRole("radio", {
        name: "Recital",
        exact: true,
    });
    await recitalButton.click();

    await expect(page).toHaveURL(/(?:\?|&)mode=recital(?:&|$)/);
    await expect(recitalButton).toHaveAttribute("aria-checked", "true");

    const basicButton = page.getByRole("radio", {
        name: "Basic",
        exact: true,
    });
    await basicButton.click();

    await expect(page).toHaveURL(/(?:\?|&)mode=basic(?:&|$)/);
    await expect(basicButton).toHaveAttribute("aria-checked", "true");
});

test("핵심 공개 화면은 390px에서 가로로 넘치지 않는다", async ({ page }) => {
    for (const path of [
        "/ko",
        "/ko/music",
        "/ko/rankings",
        "/ko/tiers",
        "/ko/bingo",
        "/ko/exams",
    ]) {
        await page.goto(path);
        await expectPageLoaded(page);
        await expectNoHorizontalOverflow(page);
    }
});
