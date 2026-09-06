import { expect, test } from "@playwright/test";
import { globalRankingPayloadSchema } from "@/features/rankings/schemas/globalRankingSchema";
import { expectNoHorizontalOverflow } from "./helpers";

const rankLabels = { ko: "순위", ja: "順位", en: "Rank" };

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

        const rankSummary = page.getByRole("article").filter({
            has: page.getByText(rankLabels[locale], { exact: true }),
        });
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
                .getByRole("button", {
                    name: mode === "basic" ? "Basic" : "Recital",
                    exact: true,
                })
                .click();
            await expect(rankSummary.locator("p").nth(1)).toHaveText(
                `#${ranks[0].rank.toLocaleString("ko-KR")}`
            );
            await expect(rankSummary.locator("p").nth(2)).toHaveText(
                `KR#${ranks[1].rank.toLocaleString("ko-KR")}`
            );
            await expect(
                page.getByRole("article").locator("strong")
            ).toHaveText(ranks[0].value.toLocaleString("ko-KR"));
            await expectNoHorizontalOverflow(page);
        }
        expect(pageErrors).toEqual([]);
    });
}
