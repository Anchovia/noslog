import { z } from "zod";

export const chartRankingRowSchema = z.object({
    position: z.number().int().positive(),
    rank: z.string(),
    score: z.number().int().positive(),
    fc_type: z.number().int(),
    user_id: z.number().int().positive(),
    user: z.object({
        id: z.number().int().positive(),
        username: z.string().nullable(),
        avatar: z.string().nullable(),
        // 유저 랭킹 페이지와 같은 행 — 이름 앞 국기
        country: z.string().nullable().default(null),
    }),
});

export type ChartRankingRow = z.infer<typeof chartRankingRowSchema>;

// 점수 분포 곡선 위 사진 — 순위표 행 + 순위표 페이지를 찾을 줄 번호 (2026-09-17)
export const chartScorePlayerSchema = chartRankingRowSchema.extend({
    row_number: z.number().int().positive(),
});

export type ChartScorePlayer = z.infer<typeof chartScorePlayerSchema>;
