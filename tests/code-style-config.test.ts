import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const eslint = new ESLint();
const ruleId = "@typescript-eslint/consistent-type-imports";

describe("feature code-style enforcement", () => {
    it("rejects value imports that are only used as types", async () => {
        const [result] = await eslint.lintText(
            'import { Locale } from "@/lib/i18n/routing"; export type ExampleLocale = Locale;',
            { filePath: "features/profile/types/styleCheck.ts" }
        );

        expect(
            result.messages.some((message) => message.ruleId === ruleId)
        ).toBe(true);
    });

    it("accepts explicit type imports and real runtime imports", async () => {
        const [result] = await eslint.lintText(
            'import { z, type ZodType } from "zod"; export const exampleSchema = z.string(); export type ExampleSchema = ZodType;',
            { filePath: "features/profile/schemas/styleCheck.ts" }
        );

        expect(result.messages).toEqual([]);
    });

    it("does not extend the migration rule into the preserved viewer", async () => {
        const config = await eslint.calculateConfigForFile(
            "components/chart-pattern/styleCheck.tsx"
        );

        expect(config.rules[ruleId]).toBeUndefined();
    });
});
