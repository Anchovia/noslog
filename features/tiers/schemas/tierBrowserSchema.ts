import { z } from "zod";

import {
    TIER_DIFFICULTIES,
    TIER_GOALS,
    TIER_MODES,
    TIER_BAND_VALUES,
    isTierLevelFilter,
    normalizeTierModeGoal,
} from "@/lib/tiers";

export const TIER_BROWSER_VIEWS = ["grid", "list"] as const;
// 구간 안 곡 순서(2026-09-22 ②) — 서열표 순(기본) · 레벨 순 · 일본어 읽기 순 · 점수 낮은 순(로그인)
export const TIER_BROWSER_SORTS = [
    "position",
    "level",
    "name",
    "score",
] as const;
export type TierBrowserSort = (typeof TIER_BROWSER_SORTS)[number];

const tierBrowserQuerySchema = z.object({
    mode: z.enum(TIER_MODES).catch("basic"),
    goal: z.enum(TIER_GOALS).catch("s"),
    difficulties: z.array(z.enum(TIER_DIFFICULTIES)).default([]),
    levels: z.array(z.string().refine(isTierLevelFilter)).default([]),
    bands: z
        .array(z.number().refine((value) => TIER_BAND_VALUES.includes(value)))
        .default([]),
    // 보기 방식 — 격자(자켓) · 목록(행). 예전 주소의 view=detailed 는 목록으로 읽는다(2026-09-22)
    view: z.enum(TIER_BROWSER_VIEWS).default("grid"),
    // 곡 검색어(2026-09-22) — 악곡 목록 검색과 같은 필드(곡 코드 · 제목 · 가나 · 아티스트 · 승인된 번역 제목)
    q: z.string().trim().max(100).default(""),
    sort: z.enum(TIER_BROWSER_SORTS).catch("position"),
});
export type TierBrowserQuery = z.infer<typeof tierBrowserQuerySchema>;

export function parseTierBrowserQuery(
    params: URLSearchParams
): TierBrowserQuery {
    const split = (name: string) => [
        ...new Set((params.get(name) ?? "").split(",").filter(Boolean)),
    ];
    const query = tierBrowserQuerySchema.parse({
        mode: params.get("mode"),
        goal: params.get("goal"),
        difficulties: TIER_DIFFICULTIES.filter((value) =>
            split("difficulty").includes(value)
        ),
        levels: split("level").filter(isTierLevelFilter),
        bands: split("bands")
            .map(Number)
            .filter((value) => TIER_BAND_VALUES.includes(value)),
        view: ["list", "detailed"].includes(params.get("view") ?? "")
            ? "list"
            : "grid",
        q: (params.get("q") ?? "").trim().slice(0, 100),
        sort: params.get("sort"),
    });
    // Recital 은 서열표가 하나라 어떤 goal 이 와도 그 표로 맞춤
    return { ...query, goal: normalizeTierModeGoal(query.mode, query.goal) };
}

export function serializeTierBrowserQuery(query: TierBrowserQuery) {
    const params = new URLSearchParams({ mode: query.mode, goal: query.goal });
    if (query.difficulties.length)
        params.set("difficulty", query.difficulties.join(","));
    if (query.levels.length) params.set("level", query.levels.join(","));
    if (query.bands.length)
        params.set(
            "bands",
            query.bands.map((value) => value.toFixed(1)).join(",")
        );
    if (query.view === "list") params.set("view", "list");
    if (query.q) params.set("q", query.q);
    if (query.sort !== "position") params.set("sort", query.sort);
    return params;
}

const tierBrowserBandSummarySchema = z.object({
    id: z.number().int(),
    value: z.number(),
    position: z.number().int(),
    totalCount: z.number().int().nonnegative(),
    achievedCount: z.number().int().nonnegative().nullable(),
});
export const tierBrowserOverviewSchema = z.object({
    list: z
        .object({
            id: z.number().int(),
            slug: z.string(),
            description: z.string().nullable(),
            updatedAt: z.string(),
            bands: z.array(tierBrowserBandSummarySchema),
        })
        .nullable(),
    theoreticalMax: z.number().positive().nullable(),
    viewerId: z.number().int().nullable(),
    showLocalizedTitle: z.boolean(),
});
const tierBrowserEntrySchema = z.object({
    id: z.number().int(),
    chartId: z.number().int(),
    position: z.number().int(),
    chart: z.object({
        difficulty: z.string(),
        level: z.number(),
        music: z.object({
            index: z.string(),
            title: z.string(),
            // 일본어 읽기(가나, 없으면 원제) — 읽기 순 정렬 기준. 악곡 목록 이름 순과 같은 값
            reading: z.string(),
            localizedTitle: z.string().nullable(),
            background: z.string().nullable(),
        }),
    }),
    record: z
        .object({
            score: z.number(),
            rank: z.string(),
            fc_type: z.number(),
            grade: z.number().nullable(),
            rating: z.number().nullable(),
        })
        .nullable(),
});
export const tierBrowserBandSchema = z.object({
    id: z.number().int(),
    value: z.number(),
    position: z.number().int(),
    entries: z.array(tierBrowserEntrySchema),
});
export type TierBrowserOverview = z.infer<typeof tierBrowserOverviewSchema>;
export type TierBrowserBand = z.infer<typeof tierBrowserBandSchema>;
export type TierBrowserEntry = z.infer<typeof tierBrowserEntrySchema>;
export type TierBrowserBandSummary = z.infer<
    typeof tierBrowserBandSummarySchema
>;
