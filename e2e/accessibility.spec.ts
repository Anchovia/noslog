import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { expectPageLoaded } from "./helpers";

const representativeRoutes = ["/ko", "/ja/music", "/en/rankings"] as const;

for (const path of representativeRoutes) {
    test(`${path}에 WCAG A·AA 위반이 없다`, async ({ page }) => {
        await page.goto(path);
        await expectPageLoaded(page);

        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();
        const actualRuleIds = [
            ...new Set(results.violations.map(({ id }) => id)),
        ].sort();

        expect(
            actualRuleIds,
            results.violations
                .map(
                    ({ id, impact, help, nodes }) =>
                        `${id} (${impact ?? "impact unknown"}): ${help} [${nodes.length}]`
                )
                .join("\n")
        ).toEqual([]);
    });
}
