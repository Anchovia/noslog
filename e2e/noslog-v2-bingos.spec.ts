import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

test.skip(
    process.env.NOSLOG_BINGOS_FIXTURE !== "true",
    "Requires the isolated local P14 presentation harness."
);

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P14 ${locale} reset cancellation and failure preserve progress`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        for (const state of ["detail-reset-failure", "detail"]) {
            await page.goto(
                `/${locale}/p7-verification?fixture=bingos&state=${state}`
            );
            await page.setViewportSize({ width: 320, height: 800 });
            const trigger = page.getByRole("button", {
                name: t["bingo.resetTitle"],
                exact: true,
            });
            await trigger.click();
            const dialog = page.getByRole("dialog");
            await dialog.press("Escape");
            await expect(trigger).toBeFocused();
            await expect(page.getByLabel("Fixture saves")).toHaveText("0");
            await expect(
                page.locator(".nl-bingo-mission input:checked")
            ).toHaveCount(8);
            await trigger.click();
            await expect(dialog).toBeVisible();
            expect(
                (
                    await new AxeBuilder({ page })
                        .include('[role="dialog"]')
                        .analyze()
                ).violations
            ).toEqual([]);
            await dialog
                .getByRole("button", {
                    name: t["bingo.resetAction"],
                    exact: true,
                })
                .click();
            await expect(page.getByLabel("Fixture saves")).toHaveText("1");
            if (state === "detail-reset-failure") {
                await expect(dialog.getByRole("alert")).toContainText(
                    "Fixture reset failure"
                );
                await expect(
                    page.locator(".nl-bingo-mission input:checked")
                ).toHaveCount(8);
            } else {
                await expect(dialog).toBeHidden();
                await expect(
                    page.locator(".nl-bingo-mission input:checked")
                ).toHaveCount(0);
            }
        }
    });
    test(`P14 ${locale} initial catalog streams from a decorative skeleton`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(
            `/${locale}/p7-verification?fixture=bingos&state=loading`,
            { waitUntil: "commit" }
        );
        await expect(page.getByRole("status")).toHaveText(t["bingo.loading"]);
        await expect(page.getByRole("status")).toHaveCSS(
            "color",
            "rgb(175, 175, 175)"
        );
        // 필터 창이 없어지고 상태 칩은 목록이 온 뒤에 보인다(2026-09-22) — 스켈레톤은 격자(기본 보기) 카드 6장
        const cards = page.locator(
            'ul.nl-bingo-catalog__grid[aria-hidden="true"] .nl-bingo-card'
        );
        await expect(cards).toHaveCount(6);
        await expect(page.locator(".nl-bingo-catalog__grid")).toHaveAttribute(
            "aria-hidden",
            "true"
        );
        await expect(page.locator(".nl-bingo-catalog__grid")).toHaveCSS(
            "gap",
            "8px"
        );
        // 폰 격자 3열 · 사이 8 — (358 − 16) ÷ 3
        expect((await cards.first().boundingBox())!.width).toBe(114);
        expect(
            (await cards
                .first()
                .locator(".nl-bingo-card__cover")
                .boundingBox())!.height
        ).toBe(114);
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        await page.screenshot({
            path: testInfo.outputPath("catalog-loading-390.png"),
            fullPage: true,
        });
        await expect(
            page.locator("ul.nl-bingo-catalog__grid > li")
        ).toHaveCount(44);
        await expect(cards).toHaveCount(0);
        await expect(
            page.getByRole("heading", { name: t["bingo.title"], exact: true })
        ).toBeVisible();
    });
    test(`P14 ${locale} catalog reflow, full list and status chips`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(`/${locale}/p7-verification?fixture=bingos`);
        await expect(
            page.locator("ul.nl-bingo-catalog__grid > li")
        ).toHaveCount(44);
        for (const [width, columns] of [
            [320, 3],
            [390, 3],
            [520, 3],
            [768, 4],
            [1470, 6],
        ]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page
                    .locator("ul.nl-bingo-catalog__grid")
                    .evaluate(
                        (element) =>
                            getComputedStyle(element).gridTemplateColumns.split(
                                " "
                            ).length
                    )
            ).toBe(columns);
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`catalog-${width}.png`),
                    fullPage: true,
                });
        }
        // 상태는 늘 보이는 칩 — 누르면 바로 적용되고 한 걸음씩 뒤로가기에 남는다(2026-09-22)
        await page.setViewportSize({ width: 390, height: 900 });
        const chips = page.getByRole("group", {
            name: t["bingo.catalog.status"],
            exact: true,
        });
        await expect(
            chips.getByRole("button", {
                name: new RegExp(`^${t["bingo.catalog.all"]}`),
            })
        ).toHaveAttribute("aria-pressed", "true");
        await chips
            .getByRole("button", {
                name: new RegExp(`^${t["bingo.catalog.full"]}`),
            })
            .click();
        await expect(page).toHaveURL(/status=full/);
        await expect(
            page.locator("ul.nl-bingo-catalog__grid > li")
        ).toHaveCount(5);
        await page.goBack();
        await expect(
            page.locator("ul.nl-bingo-catalog__grid > li")
        ).toHaveCount(44);
        // 보기 전환 — 목록형은 주소 view=list, 넓은 화면 두 열
        await page
            .getByRole("radio", { name: t["discovery.list"], exact: true })
            .click();
        await expect(page).toHaveURL(/view=list/);
        await expect(
            page.locator("ul.nl-bingo-catalog__list > li")
        ).toHaveCount(44);
        expect(
            (
                await new AxeBuilder({ page })
                    .include(".nl-bingo-catalog")
                    .analyze()
            ).violations
        ).toEqual([]);
    });

    test(`P14 ${locale} detail board text, missions, terms and selection`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(
            `/${locale}/p7-verification?fixture=bingos&state=detail`
        );
        await expect(page.locator(".nl-bingo-board button")).toHaveCount(25);
        await expect(page.locator(".nl-bingo-mission")).toHaveCount(25);
        await expect(
            page.locator(".nl-bingo-mission input:checked")
        ).toHaveCount(8);
        for (const width of [320, 390, 520, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`detail-${width}.png`),
                    fullPage: true,
                });
        }
        // 칸에는 좌표 대신 미션 글, 위치는 화면 읽기 글(2행 4열)로만(2026-09-22)
        await expect(
            page.locator(".nl-bingo-board button").nth(8)
        ).not.toContainText("B4");
        // 넓은 화면: 칸을 누르면 판 오른쪽 상세가 바뀌고 팝오버는 없다
        await page.locator(".nl-bingo-board button").nth(8).click();
        await expect(
            page.locator(".nl-bingo-detail-panel .sr-only")
        ).toHaveText(
            t["bingo.position"].replace("{row}", "2").replace("{column}", "4")
        );
        await expect(page.locator(".nl-bingo-cell-popover")).toHaveCount(0);
        // 폰: 칸 팝오버
        await page.setViewportSize({ width: 390, height: 900 });
        await page.locator(".nl-bingo-board button").nth(8).click();
        await expect(
            page.locator(".nl-bingo-cell-popover .nl-bingo-position .sr-only")
        ).toHaveText(
            t["bingo.position"].replace("{row}", "2").replace("{column}", "4")
        );
        await page.keyboard.press("Escape");
        await expect(page.locator(".nl-bingo-cell-popover")).toHaveCount(0);
        await expect(page.locator("#bingo-mission-900009")).toHaveAttribute(
            "data-selected",
            "true"
        );
        await expect(
            page.locator(".nl-bingo-board button").nth(8)
        ).toHaveAttribute("aria-pressed", "true");
        await expect(
            page.locator(".nl-bingo-mission input:checked")
        ).toHaveCount(8);
        await expect(page.getByLabel("Fixture saves")).toHaveText("0");
        await page.locator(".nl-term__trigger").first().click();
        await expect(
            page.getByText(t["bingo.term.sjust"], { exact: true })
        ).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator(".nl-term__popover")).toHaveCount(0);
        expect(
            (
                await new AxeBuilder({ page })
                    .include(".nl-bingo-detail")
                    .analyze()
            ).violations
        ).toEqual([]);
        expect(errors).toEqual([]);
    });

    test(`P14 ${locale} failed saves roll back and busy saves prevent repeats`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=bingos&state=detail-failure`
        );
        await page.getByRole("checkbox").first().click();
        await expect(page.getByRole("checkbox").first()).toBeChecked();
        await expect(
            page.locator(".nl-bingo-detail").getByRole("alert")
        ).toContainText("Fixture save failure");
        await page
            .getByRole("button", { name: t["common.retry"], exact: true })
            .click();
        await expect(page.getByLabel("Fixture saves")).toHaveText("2");
        await expect(page.getByRole("checkbox").first()).toBeChecked();
        await page.goto(
            `/${locale}/p7-verification?fixture=bingos&state=detail-busy`
        );
        await page.getByRole("checkbox").nth(3).check();
        await expect(page.getByRole("checkbox").nth(3)).toBeDisabled();
        await expect(page.locator("#bingo-mission-900004")).toHaveAttribute(
            "aria-busy",
            "true"
        );
        await expect(page.locator("#bingo-mission-900004")).toHaveAttribute(
            "data-selected",
            "false"
        );
        await expect(page.getByLabel("Fixture saves")).toHaveText("1");
        expect(
            (
                await new AxeBuilder({ page })
                    .include(".nl-bingo-detail")
                    .analyze()
            ).violations
        ).toEqual([]);
        await page
            .getByRole("button", { name: "Finish fixture save", exact: true })
            .click();
        await expect(page.getByRole("checkbox").nth(3)).toBeEnabled();
        await expect(page.getByRole("checkbox").nth(3)).toBeChecked();
    });

    test(`P14 ${locale} signed-out omissions and real-route restoration`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=bingos&state=guest`
        );
        await expect(
            page.locator(
                ".nl-bingo-mini, .nl-bingo-card__track, .nl-bingo-recent"
            )
        ).toHaveCount(0);
        await expect(
            page.getByRole("group", {
                name: t["bingo.catalog.status"],
                exact: true,
            })
        ).toHaveCount(0);
        await page.goto(
            `/${locale}/p7-verification?fixture=bingos&state=detail-guest`
        );
        await expect(page.getByRole("checkbox")).toHaveCount(0);
        await expect(page.locator(".nl-bingo-mission")).toHaveCount(25);
        await expect(
            page.getByRole("link", {
                name: t["bingo.loginToSave"],
                exact: true,
            })
        ).toHaveAttribute("href", /returnTo=.*bingo/);
        await page.goto(`/${locale}/bingo`);
        const actualCards = page.locator("ul.nl-bingo-catalog__grid > li");
        await expect(actualCards.first()).toBeVisible();
        const actualCount = await actualCards.count();
        await page.locator("ul.nl-bingo-catalog__grid a").first().click();
        await expect(page.locator(".nl-bingo-board button")).toHaveCount(25);
        await page.goBack();
        await expect(page).toHaveURL(new RegExp(`/${locale}/bingo$`));
        await expect(actualCards).toHaveCount(actualCount);
    });
}
