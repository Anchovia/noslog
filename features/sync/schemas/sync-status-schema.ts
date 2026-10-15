import { z } from "zod";

const syncAttemptSchema = z.object({
    id: z.number().int().positive(),
    status: z.enum([
        "processing",
        "delayed",
        "timedOut",
        "completed",
        "partial",
        "failed",
    ]),
    scope: z.enum(["full", "recent"]),
    startedAt: z.string().datetime(),
    completedAt: z.string().datetime().nullable(),
    receivedPlays: z.number().int().nonnegative(),
    insertedPlays: z.number().int().nonnegative(),
    changedRecords: z.number().int().nonnegative(),
    excludedCount: z.number().int().nonnegative().nullable(),
    // 이 동기화에서 새로 얻은 업적 단계(2026-09-24 N1 · E1) — 가장 최근 완료 시도에만 채운다
    newAchievements: z
        .array(
            z.object({
                key: z.string(),
                tier: z.number().int().min(1).max(3),
            })
        )
        .max(100)
        .default([]),
});
export const syncStatusSchema = z.object({
    observedAt: z.string().datetime(),
    attempts: z.array(syncAttemptSchema).max(5),
    coverage: z.object({
        played: z.number().int().nonnegative(),
        judgement: z.number().int().nonnegative(),
        timing: z.number().int().nonnegative(),
    }),
    firstFullImport: z.boolean(),
    previews: z
        .array(
            z.object({
                musicId: z.string(),
                title: z.string(),
                difficulty: z.string(),
                level: z.number().nullable(),
                score: z.number().int(),
            })
        )
        .max(3),
    retryAfter: z.number().int().min(0).max(30),
});
export type SyncAttempt = z.infer<typeof syncAttemptSchema>;
export type SyncStatus = z.infer<typeof syncStatusSchema>;
