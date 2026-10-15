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
    // 검색에만 쓰는 다른 이름 — 과제곡 원제·가나·아티스트·승인된 번역 제목(한국어로 「월광」 을 쳐도 찾히게)
    searchNames: z.array(z.string()).optional(),
});
export type BingoCatalogItem = z.infer<typeof bingoCatalogItemSchema>;

export const bingoCatalogQuerySchema = z.object({
    status: z
        .enum(["all", "progress", "unlocked", "full", "chance"])
        .catch("all"),
    sort: z.enum(["release", "recent", "progress"]).catch("release"),
    q: z.string().max(200).catch(""),
    // 보기 방식(2026-09-22) — 격자(기본) · 목록, 주소 view=list
    view: z.enum(["grid", "list"]).catch("grid"),
});
export type BingoCatalogQuery = z.infer<typeof bingoCatalogQuerySchema>;

const bingoMissionSchema = z.object({
    id: z.number().int().positive(),
    position: z.number().int().min(1).max(25),
    challenge: z.string(),
    language: z.enum(["ko", "ja", "en"]),
    missionType: z.string(),
    musicIndex: z.string().nullable(),
    musicDifficulty: z.string().nullable(),
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
