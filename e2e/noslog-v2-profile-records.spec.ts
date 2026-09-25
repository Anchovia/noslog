import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// 프로필 「기록」 탭(2026-09-25 2단계) — 최고 기록 · 모든 기록(세그먼트), 정렬, 모드 유지, 가로 넘침 없음(검색 · 필터 없음, 2026-09-26)
test("P6 records tab switches view and sort and keeps the mode across tabs", async ({
    page,
}) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // 시드 플레이어는 기록이 없다 — 첫 화면(서버가 그림)은 빈 상태, 그 뒤 요청은 흉내 낸 응답(다른 프로필 스펙과 같은 방식)
    const plays = [
        ["Moonstone", "Real", 3, 970161, "S"],
        ["Evans", "Expert", 12, 984318, "S"],
        ["Twinkle Wonderland", "Real", 2, 985360, "S"],
    ] as const;
    await page.route("**/api/profiles/1/records?**", async (route) => {
        const query = Object.fromEntries(
            new URL(route.request().url()).searchParams
        );
        const items = (
            query.sort === "title" ? [...plays].reverse() : plays
        ).map(([title, level, number, score, rank], index) => ({
            id: index + 1,
            musicIndex: String(index + 1),
            title,
            background: null,
            difficulty: level,
            level: number,
            score,
            rank,
            fullCombo: false,
            contribution: 120 - index,
            playedAt: "2026-09-19 01:01",
            chartRank: index + 1,
            position: null,
        }));
        await route.fulfill({
            json: {
                isSuccess: true,
                code: "OK",
                message: "",
                result: {
                    query: {
                        view: query.view,
                        mode: query.mode,
                        sort: query.sort,
                        offset: Number(query.offset),
                    },
                    items,
                    total: items.length,
                    hasMore: false,
                },
            },
        });
    });
    await page.goto("/ko/profile/1/records");
    const tabs = page.getByRole("navigation", { name: "프로필 구역" });
    await expect(tabs.getByRole("link", { name: "기록" })).toHaveAttribute(
        "aria-current",
        "page"
    );
    const records = page.getByRole("region", { name: "기록", exact: true });
    const rows = records.getByRole("list").getByRole("link");
    await expect(
        records.getByText("베스트 성과 기록이 없습니다.")
    ).toBeVisible();

    await records
        .getByRole("radio", { name: "모든 기록", exact: true })
        .click();
    await expect(records).toHaveAttribute("data-kind", "all");
    await expect(rows).toHaveCount(3);
    await expect(rows.first()).toContainText("#1");

    await expect(records.getByRole("searchbox")).toHaveCount(0);
    await expect(records.getByRole("button", { name: "필터" })).toHaveCount(0);
    await records.getByRole("button", { name: /^정렬/ }).click();
    await page.getByRole("menuitemradio", { name: "곡 이름 순" }).click();
    await expect(rows.first()).toContainText("Twinkle Wonderland");

    // 모드는 주소로 — 탭을 옮겨도 그대로
    await page.getByRole("radio", { name: "Recital", exact: true }).click();
    await expect(page).toHaveURL(/mode=recital/);
    await tabs.getByRole("link", { name: "개요" }).click();
    await expect(page).toHaveURL(/\/profile\/1\?mode=recital$/);

    for (const width of [390, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await expect
            .poll(() =>
                page.evaluate(
                    () => document.documentElement.scrollWidth - innerWidth
                )
            )
            .toBe(0);
    }
    const audit = await new AxeBuilder({ page }).include("main").analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
});
