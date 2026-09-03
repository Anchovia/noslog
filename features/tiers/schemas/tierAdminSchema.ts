import { z } from "zod";

import {
    MAX_TIER_VALUE,
    MIN_TIER_VALUE,
    TIER_GOALS,
    TIER_MODES,
} from "@/lib/tiers";

const tierModeSchema = z.enum(TIER_MODES, {
    error: "서열표 모드를 확인해주세요.",
});

const tierGoalSchema = z.enum(TIER_GOALS, {
    error: "서열표 목표를 확인해주세요.",
});

const tierStatusSchema = z.enum(["draft", "published", "archived"], {
    error: "서열표 상태를 확인해주세요.",
});

export function normalizeTierMode(value: string) {
    const result = tierModeSchema.safeParse(value);
    return result.success ? result.data : "basic";
}

export function normalizeTierGoal(value: string | null | undefined) {
    const result = tierGoalSchema.safeParse(value);
    return result.success ? result.data : "s";
}

export function normalizeTierStatus(value: string) {
    const result = tierStatusSchema.safeParse(value);
    return result.success ? result.data : "draft";
}

const positiveIdSchema = z.coerce
    .number({ error: "잘못된 요청입니다." })
    .int("잘못된 요청입니다.")
    .positive("잘못된 요청입니다.");

const tierValueSchema = z.coerce
    .number({ error: "서열 상수를 입력해주세요." })
    .min(MIN_TIER_VALUE, `서열 상수는 ${MIN_TIER_VALUE} 이상이어야 합니다.`)
    .max(MAX_TIER_VALUE, `서열 상수는 ${MAX_TIER_VALUE} 이하여야 합니다.`)
    .refine(
        (value) => Math.abs(value * 10 - Math.round(value * 10)) < 1e-9,
        "서열 상수는 소수점 한 자리까지 입력해주세요."
    );

export const tierListFormSchema = z.object({
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .transform((value) => value.replace(/[^a-z0-9-]/g, "-"))
        .refine((value) => /[a-z0-9]/.test(value), {
            message: "식별자에는 영문 소문자나 숫자가 필요합니다.",
        }),
    title: z.string().trim().min(1, "서열표 이름을 입력해주세요."),
    mode: tierModeSchema,
    goal: tierGoalSchema,
    description: z.string().trim(),
    status: tierStatusSchema,
});

export const tierListSaveSchema = tierListFormSchema.and(
    z.object({ id: positiveIdSchema.optional() })
);

export const tierListDeleteSchema = z.object({ id: positiveIdSchema });

export const tierBandCreateSchema = z.object({
    tierListId: positiveIdSchema,
    value: tierValueSchema,
});

export const tierBandUpdateSchema = z.object({
    id: positiveIdSchema,
    value: tierValueSchema,
});

export const tierBandDeleteSchema = z.object({ id: positiveIdSchema });

export const tierEntryAddSchema = z.object({
    tierListId: positiveIdSchema,
    tierBandId: positiveIdSchema,
    chartId: positiveIdSchema,
});

export const tierEntryDeleteSchema = z.object({ id: positiveIdSchema });

export const tierEntryMoveSchema = z.object({
    entryId: positiveIdSchema,
    tierBandId: positiveIdSchema,
});

export const tierEntryPlacementSchema = z.object({
    id: positiveIdSchema,
    tierBandId: positiveIdSchema,
    position: positiveIdSchema,
});

export const tierBoardLayoutSchema = z.object({
    tierListId: positiveIdSchema,
    placements: z.array(tierEntryPlacementSchema),
});

export const tierChartSearchSchema = z.object({
    query: z.string().trim().max(100),
    tierListId: positiveIdSchema,
});

export type TierListFormValues = z.input<typeof tierListFormSchema>;
export type TierListValues = z.output<typeof tierListFormSchema>;
export type TierListSaveValues = z.output<typeof tierListSaveSchema>;
export type TierListFormFieldName = Extract<keyof TierListFormValues, string>;
export type TierEntryPlacement = z.output<typeof tierEntryPlacementSchema>;

export function tierListSaveInputFromFormData(formData: FormData) {
    return {
        id: formData.get("id") || undefined,
        slug: String(formData.get("slug") ?? ""),
        title: String(formData.get("title") ?? ""),
        mode: String(formData.get("mode") ?? ""),
        goal: String(formData.get("goal") ?? ""),
        description: String(formData.get("description") ?? ""),
        status: String(formData.get("status") ?? ""),
    };
}

export function tierIdInputFromFormData(formData: FormData) {
    return { id: formData.get("id") };
}

export function tierBandCreateInputFromFormData(formData: FormData) {
    return {
        tierListId: formData.get("tierListId"),
        value: formData.get("value"),
    };
}

export function tierBandUpdateInputFromFormData(formData: FormData) {
    return {
        id: formData.get("id"),
        value: formData.get("value"),
    };
}

export function tierEntryAddInputFromFormData(formData: FormData) {
    return {
        tierListId: formData.get("tierListId"),
        tierBandId: formData.get("tierBandId"),
        chartId: formData.get("chartId"),
    };
}

export function tierEntryMoveInputFromFormData(formData: FormData) {
    return {
        entryId: formData.get("entryId"),
        tierBandId: formData.get("tierBandId"),
    };
}

export function createTierListFormData(values: TierListValues, id?: number) {
    const formData = new FormData();
    if (id !== undefined) formData.set("id", String(id));
    formData.set("slug", values.slug);
    formData.set("title", values.title);
    formData.set("mode", values.mode);
    formData.set("goal", values.goal);
    formData.set("description", values.description);
    formData.set("status", values.status);
    return formData;
}

export function createTierIdFormData(id: number) {
    const formData = new FormData();
    formData.set("id", String(id));
    return formData;
}

export function createTierBandFormData(input: {
    id?: number;
    tierListId?: number;
    value: number;
}) {
    const formData = new FormData();
    if (input.id !== undefined) formData.set("id", String(input.id));
    if (input.tierListId !== undefined) {
        formData.set("tierListId", String(input.tierListId));
    }
    formData.set("value", String(input.value));
    return formData;
}

export function createTierEntryAddFormData(input: {
    tierListId: number;
    tierBandId: number;
    chartId: number;
}) {
    const formData = new FormData();
    formData.set("tierListId", String(input.tierListId));
    formData.set("tierBandId", String(input.tierBandId));
    formData.set("chartId", String(input.chartId));
    return formData;
}

export function createTierEntryMoveFormData(input: {
    entryId: number;
    tierBandId: number;
}) {
    const formData = new FormData();
    formData.set("entryId", String(input.entryId));
    formData.set("tierBandId", String(input.tierBandId));
    return formData;
}
