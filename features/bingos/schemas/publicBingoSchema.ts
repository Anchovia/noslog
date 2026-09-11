import { z } from "zod";

export const bingoCatalogItemSchema = z.object({
    id: z.number().int().positive(),
    title: z.string(),
    musicIndex: z.string(),
    background: z.string().nullable(),
    sourceVersion: z.string().nullable(),
    rewardNos: z.number(),
    requiredLines: z.number(),
    completedPositions: z.array(z.number().int().min(1).max(25)),
    completedLines: z.number(),
    chanceLines: z.number(),
    lastModifiedAt: z.string().nullable(),
});
export type BingoCatalogItem = z.infer<typeof bingoCatalogItemSchema>;

export const bingoCatalogQuerySchema = z.object({
    status: z
        .enum(["all", "progress", "unlocked", "full", "chance"])
        .catch("all"),
    sort: z.enum(["release", "recent", "progress"]).catch("release"),
});
export type BingoCatalogQuery = z.infer<typeof bingoCatalogQuerySchema>;

export const bingoMissionSchema = z.object({
    id: z.number().int().positive(),
    position: z.number().int().min(1).max(25),
    challenge: z.string(),
    language: z.enum(["ko", "ja", "en"]),
    missionType: z.string(),
    musicIndex: z.string().nullable(),
    categoryShort: z.string().nullable(),
});
export const bingoDetailSchema = z.object({
    id: z.number().int().positive(),
    title: z.string(),
    musicIndex: z.string(),
    background: z.string().nullable(),
    sourceVersion: z.string().nullable(),
    requiredLines: z.number(),
    rewardNos: z.number(),
    lineRewardNos: z.number(),
    completionRewardNos: z.number(),
    cells: z.array(bingoMissionSchema),
    completedCellIds: z.array(z.number()),
    hasSavedProgress: z.boolean().optional(),
    isAuthenticated: z.boolean(),
});
export type BingoDetail = z.infer<typeof bingoDetailSchema>;
export type BingoMission = z.infer<typeof bingoMissionSchema>;
