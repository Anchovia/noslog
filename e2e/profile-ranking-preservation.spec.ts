import { expect, test } from "@playwright/test";
import { globalRankingPayloadSchema } from "@/features/rankings/schemas/globalRankingSchema";
import { expectNoHorizontalOverflow } from "./helpers";

for (const locale of ["ko", "ja", "en"] as const) {
    test(`${locale} profile retains global and country ranks after legacy ranking cleanup`, async ({
        page,
    }) => {
        const pageErrors: string[] = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));
        await page.goto(`/${locale}/rankings`);
        const playerLink = page.getByRole("link", {
            name: "E2E_RANKER",
            exact: true,
        });
        await expect(playerLink).toBeVisible();
        const profileHref = await playerLink.getAttribute("href");
        expect(profileHref).toMatch(new RegExp(`^/${locale}/profile/\\d+`));
        await playerLink.click();
        await expect(
            page.getByRole("heading", { name: "E2E_RANKER" })
        ).toBeVisible();

        const rankSummary = page.locator("#profile-performance-summary");
        for (const mode of ["basic", "recital"] as const) {
            const ranks = await Promise.all(
                ["all", "kr"].map(async (region) => {
                    const response = await page.request.get(
                        `/api/rankings?mode=${mode}&region=${region}&page=1`
                    );
                    expect(response.ok()).toBe(true);
                    const payload = globalRankingPayloadSchema.parse(
                        (await response.json()).result
                    );
                    const player = payload.rows.find(
                        (row) => row.username === "E2E_RANKER"
                    );
                    expect(player).toBeDefined();
                    return player!;
                })
            );
            await page
                .getByRole("radio", {
                    name: mode === "basic" ? "Basic" : "Recital",
                    exact: true,
                })
                .click();
            // 머리 핵심 수치(2026-09-25 K2) — 세계 · 국가 순위는 작은 줄, 공식 Grd 는 소수 둘째 자리까지(순위표는 정수)
            await expect(rankSummary.locator('[data-rank="world"]')).toHaveText(
                `#${ranks[0].rank.toLocaleString("ko-KR")}`
            );
            await expect(
                rankSummary.locator('[data-rank="country"]')
            ).toHaveText(`#${ranks[1].rank.toLocaleString("ko-KR")}`);
            const grade = await rankSummary
                .locator(".nl-metric-display")
                .first()
                .textContent();
            expect(Math.round(Number(grade!.replace(/,/g, "")))).toBe(
                ranks[0].value
            );
            await expectNoHorizontalOverflow(page);
        }
        expect(pageErrors).toEqual([]);
    });
}
