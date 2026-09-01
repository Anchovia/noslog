import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { expectPageLoaded } from "./helpers";

const representativeRoutes = [
    { path: "/ko", existingRuleIds: ["document-title"] },
    { path: "/ja/music", existingRuleIds: ["color-contrast"] },
    { path: "/en/rankings", existingRuleIds: ["color-contrast"] },
] as const;

for (const { path, existingRuleIds } of representativeRoutes) {
    test(`${path}에 기존 기준선 밖의 WCAG A·AA 위반이 없다`, async ({
        page,
    }, testInfo) => {
        await page.goto(path);
        await expectPageLoaded(page);

        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();
        const actualRuleIds = [
            ...new Set(results.violations.map(({ id }) => id)),
        ].sort();

        testInfo.annotations.push({
            type: "existing-accessibility-debt",
            description: existingRuleIds.join(", "),
        });

        expect(
            actualRuleIds,
            results.violations
                .map(
                    ({ id, impact, help, nodes }) =>
                        `${id} (${impact ?? "impact unknown"}): ${help} [${nodes.length}]`
                )
                .join("\n")
        ).toEqual([...existingRuleIds].sort());
    });
}
