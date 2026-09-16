import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

test.skip(
    process.env.NOSLOG_ARCADES_FIXTURE !== "true",
    "Requires the isolated local arcade presentation harness."
);
test("P12 detail composition keeps the section stack, action row and rail across widths", async ({
    page,
}, testInfo) => {
    await page.goto("/ko/p7-verification?fixture=arcades&state=figma-detail");
    await expect(page.locator(".nl-arcade-detail h1")).toHaveText(
        "라운드원 강남"
    );
    // 오늘부터 7일, 첫 줄이 오늘
    await expect(page.locator(".nl-arcade-hours > div")).toHaveCount(7);
    await expect(
        page.locator(".nl-arcade-hours > div").first()
    ).toHaveAttribute("data-today", "true");
    const lastCabinet = page.locator(".nl-arcade-cabinets > li").last();
    await expect(lastCabinet).toHaveAttribute("data-tone", "unavailable");
    await expect(lastCabinet).toContainText("3번기");
    await expect(lastCabinet).toContainText("점검 중");
    await expect(lastCabinet).toContainText("이용 불가");
    await expect(
        page.locator(".nl-arcade-cabinets > li").nth(1)
    ).toHaveAttribute("data-tone", "caution");
    await page.evaluate(() => document.fonts.ready);
    for (const width of [
        320, 390, 671, 672, 960, 1055, 1056, 1280, 1470, 1055,
    ]) {
        await page.setViewportSize({ width, height: 900 });
        const wide = width >= 1056;
        await expect(page.locator(".nl-arcade-detail__layout")).toHaveCSS(
            "gap",
            wide ? "24px" : "16px"
        );
        // 첫 구역(제목 없는 정보 구역)은 위 여백 없이 아래 구분선 하나, 제목 있는 구역은 위 여백 16 · 구분선 없음
        await expect(
            page.locator(".nl-arcade-detail__section").first()
        ).toHaveCSS("padding-top", "0px");
        await expect(
            page.locator(".nl-arcade-detail__section").nth(1)
        ).toHaveCSS("padding-top", "16px");
        await expect(page.locator(".nl-arcade-photos")).toHaveCSS(
            "height",
            wide ? "360px" : "220px"
        );
        await expect(
            page.locator(".nl-arcade-detail__map .nl-arcade-map")
        ).toHaveCSS("height", wide ? "240px" : "160px");
        // 액션 한 줄은 한 곳에만 보인다 — 1056 미만 하단 고정 바, 1056+ 레일. 길찾기 + 선호 + 제보 · 컨트롤 높이(44 / 40)
        const railActions = page.locator(
            ".nl-arcade-detail__rail .nl-arcade-detail__actions > *"
        );
        const barActions = page.locator(
            ".nl-arcade-detail__bar .nl-arcade-detail__actions > *"
        );
        await expect(wide ? railActions : barActions).toHaveCount(3);
        await expect((wide ? barActions : railActions).first()).toBeHidden();
        const boxes = await (wide ? railActions : barActions).evaluateAll(
            (nodes) =>
                nodes.map((node) => {
                    const box = node.getBoundingClientRect();
                    return { top: Math.round(box.top), height: box.height };
                })
        );
        expect(boxes.map((box) => box.height)).toEqual(
            wide ? [40, 40, 40] : [44, 44, 44]
        );
        expect(new Set(boxes.map((box) => box.top)).size).toBe(1);
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
            page.getByText(t["arcades.mapLoadError"], { exact: true })
        ).toBeVisible();
        await expect(page.locator(".nl-arcade-map__legend")).toBeHidden();
        await page
            .getByRole("button", { name: t["common.retry"], exact: true })
            .click();
        await expect(page.locator(".nl-arcade-map")).toHaveAttribute(
            "data-state",
            "error"
        );
        for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1470, 1055]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                (await page.locator(".nl-arcade-map").boundingBox())!.height
            ).toBeLessThan(110);
            // 시트 머리(손잡이 · 요약 줄 · 672 미만 정렬) 아래 8 에 첫 카드
            const head = (await page
                .locator(".nl-arcades__sheet-head")
                .boundingBox())!;
            const firstCard = (await page
                .locator(".nl-arcades__list > li")
                .first()
                .boundingBox())!;
            expect(firstCard.y - head.y - head.height).toBe(8);
            // 672 미만은 지도가 화면 끝까지, 그 위는 컨테이너 여백 안
            if (width < 1056) {
                const map = (await page
                    .locator(".nl-arcade-map")
                    .boundingBox())!;
                expect(map.x).toBe(width < 672 ? 0 : 24);
            }
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
            .getByRole("button", { name: t["arcades.filters"], exact: true })
            .click();
        const dialog = page.getByRole("dialog");
        const available = dialog.getByRole("button", {
            name: t["arcades.availableFilter"],
            exact: true,
        });
        await available.click();
        await dialog
            .getByRole("button", { name: t["common.close"], exact: true })
            .click();
        await expect(page.locator(".nl-arcades__list > li")).toHaveCount(2);
        await page
            .getByRole("button", { name: t["arcades.filters"], exact: true })
            .click();
        await expect(available).toHaveAttribute("aria-pressed", "false");
        await available.click();
        await dialog.locator(".nl-arcades__apply").click();
        await expect(page.locator(".nl-arcades__list > li")).toHaveCount(1);
        expect(new URL(page.url()).searchParams.get("available")).toBe("1");
        expect(
            (await new AxeBuilder({ page }).include(".nl-arcades").analyze())
                .violations
        ).toEqual([]);
        expect(errors).toEqual([]);
        // 카드를 누르면 상세로 가지 않고 펼쳐지며, 상세는 「자세히 보기」 링크로만 간다
        const firstCard = page.locator(".nl-arcades__list > li").first();
        const summary = firstCard.locator(".nl-arcade-result__summary");
        await summary.click();
        await expect(summary).toHaveAttribute("aria-expanded", "true");
        await expect(
            firstCard.getByRole("link", {
                name: t["arcades.viewDetails"],
                exact: true,
            })
        ).toHaveAttribute("href", new RegExp(`/${locale}/gamecenter/`));
        await summary.click();
        await expect(summary).toHaveAttribute("aria-expanded", "false");
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
        await expect(page.locator(".nl-arcade-cabinets > li")).toHaveCount(2);
        // 로그아웃 상태의 기체 행 — 잠긴 「가동 확인」(hover title · 탭하면 안내) + 고장 신고
        const lockedConfirm = page
            .locator(".nl-arcade-cabinets > li")
            .first()
            .getByRole("button", {
                name: t["arcades.confirmRunning"],
                exact: true,
            });
        await expect(lockedConfirm).toHaveAttribute("aria-disabled", "true");
        await expect(lockedConfirm).toHaveAttribute(
            "title",
            t["arcades.loginToUse"]
        );
        await lockedConfirm.click();
        await expect(
            page
                .locator(".nl-arcade-cabinets > li")
                .first()
                .getByText(t["arcades.loginToUse"], { exact: true })
        ).toBeVisible();
        // 사진이 없으면 같은 자리에 자리표시자
        await expect(page.locator(".nl-arcade-photos--empty")).toHaveText(
            t["arcades.photoPending"]
        );
        for (const width of [320, 390, 520, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            const rail = page.locator(".nl-arcade-detail__rail");
            const bar = page.locator(".nl-arcade-detail__bar");
            if (width === 1470) {
                await expect(rail).toBeVisible();
                await expect(bar).toBeHidden();
            } else {
                await expect(rail).toBeHidden();
                await expect(bar).toBeVisible();
            }
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`detail-${width}.png`),
                    fullPage: true,
                });
        }
        await page.setViewportSize({ width: 320, height: 700 });
        // 제보는 하단 바의 말풍선 아이콘 버튼 — 이름은 「오락실 제보」
        const trigger = page
            .locator(".nl-arcade-detail__bar")
            .getByRole("button", { name: t["arcades.report"], exact: true });
        await trigger.click();
        await expect(
            page
                .getByRole("dialog")
                .getByRole("link", { name: t["common.login"], exact: true })
        ).toHaveAttribute("href", new RegExp(`/${locale}/login\\?returnTo=`));
        await page.getByRole("dialog").press("Escape");
        await expect(trigger).toBeFocused();
        // 기체별 고장 신고는 같은 레이어를 그 기체로 미리 채워 연다
        const brokenTrigger = page
            .locator(".nl-arcade-cabinets > li")
            .first()
            .getByRole("button", { name: t["arcades.reportBroken"] });
        await brokenTrigger.click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.getByRole("dialog").press("Escape");
        await expect(brokenTrigger).toBeFocused();
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
        await expect(page.locator(".nl-arcade-cabinets")).toHaveCount(0);
        await expect(
            page.getByText(t["arcades.noCabinetInfo"], { exact: false })
        ).toBeVisible();
        await expect(
            page.getByText(t["arcades.addressPending"], { exact: true })
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
        // 672 미만은 넘김 버튼이 없다 — 밀어 넘김 · 키보드 → 로 넘긴다
        await expect(
            page.getByRole("button", {
                name: t["arcades.photoNext"],
                exact: true,
            })
        ).toBeHidden();
        await main.focus();
        await main.press("ArrowRight");
        await expect(main.locator("img")).toHaveAttribute(
            "alt",
            "Synthetic gallery test image 2"
        );
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
