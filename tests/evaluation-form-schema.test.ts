import { zodResolver } from "@hookform/resolvers/zod";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
    createChartEvaluationFormSchema,
    createChartEvaluationInput,
    createChartEvaluationSchema,
    type ChartEvaluationFormValues,
    type ChartEvaluationValues,
} from "@/features/music/schemas/chartEvaluationSchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";

const validForm: ChartEvaluationFormValues = {
    perceivedConstant: 12.3,
    stairs: 0,
    chord: 1,
    trill: 2,
    glissando: 3,
    repetition: 4,
    comment: "  Pattern comment  ",
};
const patternFields = [
    "stairs",
    "chord",
    "trill",
    "glissando",
    "repetition",
] as const;

describe.each(SUPPORTED_LOCALES)("evaluation form (%s)", (locale) => {
    const t = createTranslator(getMessages(locale));
    const formSchema = createChartEvaluationFormSchema(t);
    const serverSchema = createChartEvaluationSchema(t);

    it("normalizes form values and maps them to the server input", () => {
        const values = formSchema.parse(validForm);
        expectTypeOf(values).toEqualTypeOf<ChartEvaluationValues>();
        expectTypeOf(values.stairs).toEqualTypeOf<number>();
        const input = createChartEvaluationInput(10, values);

        expect(input).toEqual({
            ...validForm,
            chartId: 10,
            comment: "Pattern comment",
        });
        expect(serverSchema.parse(input)).toEqual(input);
    });

    it.each([1, 1.1, 12.3, 14])("accepts constant %s", (perceivedConstant) => {
        expect(
            formSchema.safeParse({ ...validForm, perceivedConstant }).success
        ).toBe(true);
    });

    it.each([
        [Number.NaN, "music.tier.required"],
        [0.9, "music.tier.min"],
        [14.1, "music.tier.max"],
        [12.05, "music.tier.step"],
    ] as const)("localizes invalid constant %s", (perceivedConstant, key) => {
        const result = formSchema.safeParse({
            ...validForm,
            perceivedConstant,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0]).toMatchObject({
                path: ["perceivedConstant"],
                message: t(key),
            });
        }
    });

    it.each(patternFields)("requires the %s pattern", (field) => {
        const result = formSchema.safeParse({ ...validForm, [field]: null });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues).toContainEqual(
                expect.objectContaining({
                    path: [field],
                    message: t("music.tier.patternMissing"),
                })
            );
        }
    });

    it.each([-1, 5, 1.5, "1", undefined])(
        "rejects malformed pattern %s at both boundaries",
        (stairs) => {
            const values = { ...validForm, stairs };
            expect(formSchema.safeParse(values).success).toBe(false);
            expect(
                serverSchema.safeParse({ ...values, chartId: 10 }).success
            ).toBe(false);
        }
    );

    it.each(["", "   ", "\n\t"])("rejects blank comment %j", (comment) => {
        const result = formSchema.safeParse({ ...validForm, comment });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                t("music.tier.commentRequired")
            );
        }
    });

    it.each(["가", "あ", "a"])(
        "preserves the 120-character limit for %s",
        (letter) => {
            expect(
                formSchema.safeParse({
                    ...validForm,
                    comment: letter.repeat(120),
                }).success
            ).toBe(true);
            const result = formSchema.safeParse({
                ...validForm,
                comment: letter.repeat(121),
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    t("music.tier.commentMax")
                );
            }
        }
    );

    it("preserves the raw form limit and the existing trimmed server limit", () => {
        const values = { ...validForm, comment: ` ${"a".repeat(120)} ` };
        expect(formSchema.safeParse(values).success).toBe(false);
        expect(serverSchema.parse({ ...values, chartId: 10 }).comment).toBe(
            "a".repeat(120)
        );
    });

    it("returns field errors through the actual RHF resolver", async () => {
        const resolver = zodResolver(formSchema);
        const options = { fields: {}, shouldUseNativeValidation: false };
        const result = await resolver(
            {
                ...validForm,
                perceivedConstant: Number.NaN,
                stairs: null,
                comment: "",
            },
            undefined,
            options
        );

        expect(result.values).toEqual({});
        expect(result.errors).toMatchObject({
            perceivedConstant: { message: t("music.tier.required") },
            stairs: { message: t("music.tier.patternMissing") },
            comment: { message: t("music.tier.commentRequired") },
        });
        const success = await resolver(validForm, undefined, options);
        expect(success.errors).toEqual({});
        expect(success.values).toEqual({
            ...validForm,
            comment: "Pattern comment",
        });
    });
});
