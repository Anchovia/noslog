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
            await expect(
                rankSummary.locator(".nl-metric-display").nth(2)
            ).toHaveText(`#${ranks[0].rank.toLocaleString("ko-KR")}`);
            await expect(
                rankSummary.locator(".nl-metric-display").nth(3)
            ).toHaveText(`#${ranks[1].rank.toLocaleString("ko-KR")}`);
            await expect(
                rankSummary.locator(".nl-metric-display").first()
            ).toHaveText(ranks[0].value.toLocaleString("ko-KR"));
            await expectNoHorizontalOverflow(page);
        }
        expect(pageErrors).toEqual([]);
    });
}
