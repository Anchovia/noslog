import { unstable_cache } from "next/cache";

import { getCachedTierBand } from "./publicTierData";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import {
    getLocalizedMusicTitle,
    getMusicTitleDisplayPreference,
} from "@/lib/i18n/musicTitle";
import type { Locale } from "@/lib/i18n/routing";
import { isTierGoalAchieved } from "@/lib/tiers";
import type { TierMode } from "@/lib/tiers";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_TOP_COUNT,
    calculateBasicRatingTheoreticalMax,
    getBasicRatingCoefficient,
    getBasicRatingMaxContribution,
} from "@/lib/tiers/basicRating";
import type {
    TierBrowserBand,
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";

const getPublishedTierInventory = unstable_cache(
    async (mode: TierMode, goal: TierBrowserQuery["goal"]) => {
        return db.tierList.findFirst({
            where: { mode, goal, status: "published" },
            select: {
                id: true,
                slug: true,
                description: true,
                updatedAt: true,
                bands: {
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        value: true,
                        position: true,
                        entries: {
                            select: {
                                chartId: true,
                                chart: {
                                    select: {
                                        difficulty: true,
                                        level: true,
                                        music_idx: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    },
    ["tier-browser-inventory-v4"],
    { revalidate: 3600, tags: [CACHE_TAGS.tierLists] }
);

export const getModePianistRatingBasis = unstable_cache(
    async (mode: TierMode) => {
        const list = await getPublishedTierInventory(mode, "pianist");
        const entries =
            list?.bands.flatMap((band) =>
                band.entries.map((entry) => ({
                    chartId: entry.chartId,
                    value: band.value,
                }))
            ) ?? [];
        const theoreticalMax =
            entries.length >= BASIC_RATING_TOP_COUNT
                ? calculateBasicRatingTheoreticalMax(
                      entries.map((entry) => entry.value)
                  )
                : null;
        return {
            entries,
            theoreticalMax:
                theoreticalMax && theoreticalMax > 0 ? theoreticalMax : null,
        };
    },
    ["tier-browser-pianist-rating-v2"],
    { revalidate: 3600, tags: [CACHE_TAGS.tierLists] }
);

/**
 * 검색어에 맞는 악곡 코드 — 악곡 목록 검색과 같은 필드 · 대소문자 무시 부분 일치(2026-09-22).
 * 검색어가 없으면 null(좁히지 않음)
 */
async function findMatchingMusic(q: string) {
    if (!q) return null;
    const contains = { contains: q, mode: "insensitive" as const };
    const music = await db.music.findMany({
        where: {
            OR: [
                { index: contains },
                { title: contains },
                { title_kana: contains },
                { artist: contains },
                {
                    translations: {
                        some: { status: "approved", title: contains },
                    },
                },
            ],
        },
        select: { index: true },
    });
    return new Set(music.map((item) => item.index));
}

function matchesChart(
    chart: { difficulty: string; level: number },
    query: TierBrowserQuery
) {
    return (
        (!query.difficulties.length ||
            query.difficulties.some((value) => value === chart.difficulty)) &&
        (!query.levels.length ||
            query.levels.includes(
                chart.difficulty === "Real"
                    ? `real-${chart.level}`
                    : String(chart.level)
            ))
    );
}

export async function getTierBrowserOverview(
    query: TierBrowserQuery,
    viewerId: number | null
): Promise<TierBrowserOverview> {
    const [list, basis, showLocalizedTitle, music] = await Promise.all([
        getPublishedTierInventory(query.mode, query.goal),
        getModePianistRatingBasis(query.mode),
        getMusicTitleDisplayPreference(viewerId ?? undefined),
        findMatchingMusic(query.q),
    ]);
    const matches = (entry: {
        chart: { difficulty: string; level: number; music_idx: string };
    }) =>
        matchesChart(entry.chart, query) &&
        (!music || music.has(entry.chart.music_idx));
    const chartIds =
        list?.bands.flatMap((band) =>
            band.entries.filter(matches).map((entry) => entry.chartId)
        ) ?? [];
    const records =
        viewerId && chartIds.length
            ? await db.playData.findMany({
                  where: { user_id: viewerId, chart_id: { in: chartIds } },
                  select: {
                      chart_id: true,
                      score: true,
                      rank: true,
                      fc_type: true,
                      grade_recital: true,
                  },
              })
            : [];
    const byChart = new Map(records.map((record) => [record.chart_id, record]));
    return {
        viewerId,
        showLocalizedTitle,
        theoreticalMax: basis.theoreticalMax,
        list: list
            ? {
                  id: list.id,
                  slug: list.slug,
                  description: list.description,
                  updatedAt: new Date(list.updatedAt).toISOString(),
                  bands: list.bands.map((band) => {
                      const entries = band.entries.filter(matches);
                      return {
                          id: band.id,
                          value: band.value,
                          position: band.position,
                          totalCount: entries.length,
                          achievedCount: viewerId
                              ? entries.filter((entry) => {
                                    const record = byChart.get(entry.chartId);
                                    return (
                                        isTierGoalAchieved(
                                            record,
                                            query.goal
                                        ) &&
                                        (query.mode === "basic" ||
                                            (record?.grade_recital ?? 0) > 0)
                                    );
                                }).length
                              : null,
                      };
                  }),
              }
            : null,
    };
}

export async function getTierBrowserBand(
    query: TierBrowserQuery,
    bandId: number,
    viewerId: number | null,
    locale: Locale
): Promise<TierBrowserBand | null> {
    const [list, basis, showLocalizedTitle, music] = await Promise.all([
        getPublishedTierInventory(query.mode, query.goal),
        getModePianistRatingBasis(query.mode),
        getMusicTitleDisplayPreference(viewerId ?? undefined),
        findMatchingMusic(query.q),
    ]);
    if (!list?.bands.some((band) => band.id === bandId)) return null;
    const cached = await getCachedTierBand(
        list.slug,
        bandId,
        query.difficulties,
        query.levels
    );
    if (!cached) return null;
    const band = music
        ? {
              ...cached,
              entries: cached.entries.filter((entry) =>
                  music.has(entry.chart.music.index)
              ),
          }
        : cached;
    const records =
        viewerId && band.entries.length
            ? await db.playData.findMany({
                  where: {
                      user_id: viewerId,
                      chart_id: {
                          in: band.entries.map((entry) => entry.chartId),
                      },
                  },
                  select: {
                      chart_id: true,
                      score: true,
                      rank: true,
                      fc_type: true,
                      grade_basic: true,
                      grade_recital: true,
                  },
              })
            : [];
    const byChart = new Map(records.map((record) => [record.chart_id, record]));
    const constants = new Map(
        basis.entries.map((entry) => [entry.chartId, entry.value])
    );
    return {
        id: band.id,
        value: band.value,
        position: band.position,
        entries: band.entries.map((entry) => {
            const record = byChart.get(entry.chartId);
            const played =
                record &&
                record.score > 0 &&
                (query.mode === "basic" || (record.grade_recital ?? 0) > 0);
            const constant = constants.get(entry.chartId);
            return {
                id: entry.id,
                chartId: entry.chartId,
                position: entry.position,
                chart: {
                    difficulty: entry.chart.difficulty,
                    level: entry.chart.level,
                    music: {
                        index: entry.chart.music.index,
                        title: entry.chart.music.title,
                        background: entry.chart.music.background,
                        localizedTitle: getLocalizedMusicTitle(
                            entry.chart.music,
                            locale,
                            showLocalizedTitle
                        ),
                    },
                },
                record: played
                    ? {
                          score: record.score,
                          rank: record.rank,
                          fc_type: record.fc_type,
                          grade:
                              (query.mode === "basic"
                                  ? record.grade_basic
                                  : (record.grade_recital ?? 0)) / 100,
                          rating:
                              constant !== undefined && basis.theoreticalMax
                                  ? getBasicRatingMaxContribution(
                                        constant,
                                        basis.theoreticalMax
                                    ) *
                                    getBasicRatingCoefficient(
                                        record.score,
                                        BASIC_RATING_ACTIVE_CURVE
                                    )
                                  : null,
                      }
                    : null,
            };
        }),
    };
}
