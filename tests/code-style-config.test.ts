import { ESLint } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

const eslint = new ESLint();
const ruleId = "@typescript-eslint/consistent-type-imports";

describe("feature code-style enforcement", () => {
    beforeAll(async () => {
        // Load the real config and plugins outside the individual rule checks.
        await eslint.calculateConfigForFile(
            "features/profile/types/style-check.ts"
        );
    }, 30_000);

    it("rejects value imports that are only used as types", async () => {
        const [result] = await eslint.lintText(
            'import { Locale } from "@/lib/i18n/routing"; export type ExampleLocale = Locale;',
            { filePath: "features/profile/types/style-check.ts" }
        );

        expect(
            result.messages.some((message) => message.ruleId === ruleId)
        ).toBe(true);
    });

    it("accepts explicit type imports and real runtime imports", async () => {
        const [result] = await eslint.lintText(
            'import { z, type ZodType } from "zod"; export const exampleSchema = z.string(); export type ExampleSchema = ZodType;',
            { filePath: "features/profile/schemas/style-check.ts" }
        );

        expect(result.messages).toEqual([]);
    });

    it("does not extend the migration rule into the preserved viewer", async () => {
        const config = await eslint.calculateConfigForFile(
            "components/chart-pattern/style-check.tsx"
        );

        expect(config.rules[ruleId]).toBeUndefined();
    });

    it("enforces feature import sorting", async () => {
        const [result] = await eslint.lintText(
            'import { z } from "zod"; import { clsx } from "clsx"; export const example = clsx(z.string().parse("value"));',
            { filePath: "features/profile/schemas/style-check.ts" }
        );
        expect(
            result.messages.some(
                (message) => message.ruleId === "simple-import-sort/imports"
            )
        ).toBe(true);
    });

    it("rejects camelCase filenames and internal folders", async () => {
        for (const filePath of [
            "features/profile/components/ProfileCard.tsx",
            "features/profile/profileCards/card.tsx",
            "app/(publicSite)/layout.tsx",
        ]) {
            const [result] = await eslint.lintText("export {};", { filePath });
            expect(
                result.messages.filter(
                    (message) => message.ruleId === "noslog/filenames"
                )
            ).toHaveLength(1);
        }
    });

    it("accepts kebab names and preserves public routes and viewer names", async () => {
        for (const filePath of [
            "features/profile/components/profile-card.stories.tsx",
            "app/(site)/layout.tsx",
            "app/api/receivePlayerData/route.ts",
            "app/admin/drafts/[draftId]/page.tsx",
            "components/chart-pattern/ChartViewer.tsx",
        ]) {
            const [result] = await eslint.lintText("export {};", { filePath });
            expect(
                result.messages.filter(
                    (message) => message.ruleId === "noslog/filenames"
                )
            ).toEqual([]);
        }
    });
});
