import { z } from "zod";

import { MAX_TIER_VALUE, MIN_TIER_VALUE } from "@/lib/tiers";

export const TIER_REBALANCE_BAND_COUNT =
    Math.round((MAX_TIER_VALUE - MIN_TIER_VALUE) * 10) + 1;
export const TIER_REBALANCE_LABELS = [
    "베이직 S",
    "베이직 990k",
    "베이직 피아니스트",
    "리사이틀 단곡 Grd",
] as const;
const count = z
    .union([z.number(), z.string().trim().min(1, "숫자를 입력해주세요.")])
    .pipe(
        z.coerce
            .number<string | number>()
            .int("정수를 입력해주세요.")
            .min(0, "0 이상으로 입력해주세요.")
            .max(Number.MAX_SAFE_INTEGER, "숫자가 너무 큽니다.")
    );
const row = z.object({
    changed: count,
    added: count,
    beforeMax: count,
    afterMax: count,
});

/** 같은 채보 집합을 사용하는 네 서열표의 전체 재배치 요약. 유지 건수는 계산한다. */
export const tierRebalanceImageSchema = z
    .object({
        date: z.iso.date({ error: "변경 날짜를 확인해주세요." }),
        chartsPerTier: count.refine(
            (value) => value > 0 && Number.isSafeInteger(value * 4),
            "채보 수는 1 이상의 유효한 정수여야 합니다."
        ),
        rows: z.tuple([row, row, row, row]),
    })
    .superRefine((value, ctx) => {
        value.rows.forEach((entry, index) => {
            const issue = (field: keyof typeof entry, message: string) =>
                ctx.addIssue({
                    code: "custom",
                    path: ["rows", index, field],
                    message,
                });
            if (entry.changed > value.chartsPerTier - entry.added)
                issue(
                    "changed",
                    "변경과 신규의 합은 채보 수를 넘을 수 없습니다."
                );
            const previousCount = value.chartsPerTier - entry.added;
            if (
                entry.beforeMax > previousCount ||
                entry.beforeMax <
                    Math.ceil(previousCount / TIER_REBALANCE_BAND_COUNT)
            )
                issue(
                    "beforeMax",
                    "변경 전 최대 밀집도와 기존 채보 수가 맞지 않습니다."
                );
            if (
                entry.afterMax > value.chartsPerTier ||
                entry.afterMax <
                    Math.ceil(value.chartsPerTier / TIER_REBALANCE_BAND_COUNT)
            )
                issue(
                    "afterMax",
                    "변경 후 최대 밀집도와 채보 수가 맞지 않습니다."
                );
        });
    });
export type TierRebalanceImageData = z.output<typeof tierRebalanceImageSchema>;
