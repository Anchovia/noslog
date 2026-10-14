import { z } from "zod";

import { tierBandCreateSchema } from "@/features/tiers/schemas/tier-admin-schema";
import {
    isTierModeGoal,
    TIER_DIFFICULTIES,
    TIER_GOALS,
    TIER_MODES,
} from "@/lib/tiers";

export const tierChangeImageRowSchema = z
    .object({
        musicIndex: z.string().min(1, "곡을 선택해주세요."),
        title: z.string().trim().min(1, "곡 제목이 필요합니다."),
        difficulty: z.enum(TIER_DIFFICULTIES),
        level: z.number().int().positive(),
        before: tierBandCreateSchema.shape.value,
        after: tierBandCreateSchema.shape.value,
    })
    .refine((row) => row.before !== row.after, {
        path: ["after"],
        error: "변경 전후 값이 같습니다.",
    });

/** 생성용 입력만 검증한다. 실제 서열표나 공지를 저장하는 스키마가 아니다. */
export const tierChangeImageSchema = z
    .object({
        mode: z.enum(TIER_MODES),
        goal: z.enum(TIER_GOALS),
        date: z.iso.date({ error: "변경 날짜를 확인해주세요." }),
        rows: z
            .array(tierChangeImageRowSchema)
            .min(1, "변경할 곡을 추가해주세요."),
    })
    .superRefine((value, ctx) => {
        if (!isTierModeGoal(value.mode, value.goal))
            ctx.addIssue({
                code: "custom",
                path: ["goal"],
                message: "Recital은 Pianist 목표만 사용합니다.",
            });
        const seen = new Set<string>();
        value.rows.forEach((row, index) => {
            const key = `${row.musicIndex}:${row.difficulty}`;
            if (seen.has(key))
                ctx.addIssue({
                    code: "custom",
                    path: ["rows", index, "difficulty"],
                    message: "같은 곡·난이도가 중복되었습니다.",
                });
            seen.add(key);
        });
    });
export type TierChangeImageInput = z.input<typeof tierChangeImageSchema>;
export type TierChangeImageData = z.output<typeof tierChangeImageSchema>;
export type TierChangeImageRow = z.output<typeof tierChangeImageRowSchema>;
