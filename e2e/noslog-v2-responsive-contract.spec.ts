import { expect, test } from "@playwright/test";

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} music detail changes page modes coherently while resizing`, async ({
        page,
    }, testInfo) => {
        test.setTimeout(120_000);
        await page.goto(`/${locale}/music/e2e-music-001/real`);
        await expect(page.locator(".nl-music-detail__layout")).toBeVisible();
        const widths = [
            320,
            390,
            488,
            ...Array.from({ length: 161 }, (_, index) => 640 + index),
            ...Array.from({ length: 161 }, (_, index) => 800 - index),
            1024,
            1055,
            1056,
            1280,
            1470,
            1920,
            1056,
            1055,
            671,
            672,
        ];
        for (const width of widths) {
            await page.setViewportSize({ width, height: 900 });
            await expect
                .poll(() =>
                    page.evaluate(() => {
                        const style = (selector: string) =>
                            getComputedStyle(document.querySelector(selector)!);
                        const area = document.querySelector(".nl-area")!;
                        return {
                            layout: style(".nl-music-detail__layout").display,
                            tabs: Boolean(
                                area.querySelector('[role="tablist"]')
                            ),
                            padding: style(".nl-main__content").paddingLeft,
                            overflow:
                                document.documentElement.scrollWidth >
                                document.documentElement.clientWidth,
                        };
                    })
                )
                .toEqual({
                    // 1056+ 는 왼쪽 머리 열 + 오른쪽 탭 내용(2026-09-16 데스크톱 B)
                    layout: width >= 1056 ? "grid" : "flex",
                    // 영역 탭은 모든 폭에서 탭 — 좁으면 탭 줄만 가로 스크롤(부품 결정 ② 2026-09-14)
                    tabs: true,
                    // 전역 좌우 여백 16 / 24 / 32(1056 이상) — 가이드 「셸과 레이아웃」
                    padding: width >= 672 ? "24px" : "16px",
                    overflow: false,
                });
            if ([390, 672, 1470].includes(width)) {
                await page.screenshot({
                    path: testInfo.outputPath(`music-detail-${width}.png`),
                    fullPage: true,
                });
            }
        }
        // A real area selection must survive resizing, and the selected tab stays in view when the row scrolls.
        await page.locator('[role="tab"]').nth(3).click();
        await expect(page).toHaveURL(/tab=tier/);
        await page.setViewportSize({ width: 320, height: 900 });
        await expect(page.locator('[role="tab"]').nth(3)).toHaveAttribute(
            "aria-selected",
            "true"
        );
        // 고른 탭을 보이는 곳으로 옮기는 건 값이 정해질 때(AreaTabs) — 좁은 폭에서 그 탭으로 열어 잰다
        await page.goto(`/${locale}/music/e2e-music-001/real?tab=tier`);
        await expect(page.locator('[role="tab"]').nth(3)).toHaveAttribute(
            "aria-selected",
            "true"
        );
        await expect(page.locator('[role="tab"]').nth(3)).toBeInViewport({
            ratio: 1,
        });
        await page.locator('[role="tab"]').nth(2).click();
        await expect(page).toHaveURL(/tab=ranking/);
        await page.setViewportSize({ width: 1470, height: 900 });
        await expect(page.locator('[role="tab"]').nth(2)).toHaveAttribute(
            "aria-selected",
            "true"
        );
        await expect(page).toHaveURL(/tab=ranking/);
    });
}

for (const locale of ["ko", "ja", "en"]) {
    test(`${locale} ordinary page columns and rails use viewport boundaries`, async ({
        page,
    }, testInfo) => {
        test.setTimeout(120_000);
        // 빙고 id 는 시드마다 새로 매겨진다 — 목록에서 첫 빙고 주소를 읽는다
        await page.goto(`/${locale}/bingo`);
        const bingoHref = await page
            .getByRole("link", { name: /E2E 빙고/ })
            .first()
            .getAttribute("href");
        expect(bingoHref).toMatch(new RegExp(`^/${locale}/bingo/\\d+$`));
        const cases = [
            { route: "/exams", selector: ".nl-exams", compact: 1, wide: 2 },
            // 격자는 폭 따라 auto-fill(672 이상 최소 156)이라 목록형으로 잰다 — 1056 이상 두 열
            {
                route: "/bingo?view=list",
                selector: ".nl-bingo-catalog__list",
                compact: 1,
                wide: 2,
            },
            {
                route: bingoHref!.slice(`/${locale}`.length),
                selector: ".nl-bingo-detail__layout",
                compact: 1,
                wide: 2,
            },
            { route: "/privacy", selector: ".nl-privacy", compact: 1, wide: 2 },
            {
                route: "/gamecenter",
                selector: ".nl-arcades__results",
                compact: 1,
                wide: 2,
            },
            {
                route: "/bookmarklet",
                selector: ".nl-sync-columns",
                compact: 1,
                wide: 1,
            },
        ];
        for (const item of cases) {
            await page.goto(`/${locale}${item.route}`);
            const region = page.locator(item.selector).first();
            await expect(region).toBeVisible();
            for (const width of [1024, 1055, 1056, 1470, 1056, 1055, 672]) {
                await page.setViewportSize({ width, height: 900 });
                await expect
                    .poll(() =>
                        region.evaluate((element) => {
                            const columns =
                                getComputedStyle(element).gridTemplateColumns;
                            return columns === "none"
                                ? 1
                                : columns.split(" ").length;
                        })
                    )
                    .toBe(width >= 1056 ? item.wide : item.compact);
                if (item.route === "/exams") {
                    await expect(page.locator(".nl-exam-rail")).toBeVisible({
                        visible: width >= 1056,
                    });
                    await expect(page.locator(".nl-exam-select")).toBeVisible({
                        visible: width < 1056,
                    });
                    if (width >= 1056) {
                        // 지금 급 = 검정 선택 목록 고른 줄과 같은 surface/control 면 · 600. 토큰 값은 테마마다 달라 그 자리에서 읽는다
                        const current = await page
                            .locator('.nl-exam-rail [aria-current="true"]')
                            .evaluate((element) => {
                                const probe = document.createElement("span");
                                probe.style.backgroundColor =
                                    "var(--nl-surface-control)";
                                element.parentElement!.append(probe);
                                const surface =
                                    getComputedStyle(probe).backgroundColor;
                                probe.remove();
                                const style = getComputedStyle(element);
                                return {
                                    fill: style.backgroundColor,
                                    surface,
                                    weight: style.fontWeight,
                                };
                            });
                        expect(current.surface).not.toBe("rgba(0, 0, 0, 0)");
                        expect(current.fill).toBe(current.surface);
                        expect(current.weight).toBe("600");
                    }
                }
                if (item.route === "/privacy") {
                    await expect(
                        page.locator(".nl-privacy-contents__wide")
                    ).toBeVisible({ visible: width >= 1056 });
                }
                expect(
                    await page.evaluate(
                        () =>
                            document.documentElement.scrollWidth <=
                            document.documentElement.clientWidth
                    )
                ).toBe(true);
                if (width === 1470)
                    await page.screenshot({
                        path: testInfo.outputPath(
                            `${item.route.replaceAll("/", "-")}-wide.png`
                        ),
                        fullPage: true,
                    });
            }
        }
    });
}
