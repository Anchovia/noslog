import { unstable_cache } from "next/cache";
import { cache } from "react";

import type {
    TierBrowserBand,
    TierBrowserEntry,
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tier-browser-schema";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import {
    getLocalizedMusicTitle,
    getMusicTitleDisplayPreference,
} from "@/lib/i18n/music-title";
import type { Locale } from "@/lib/i18n/routing";
import type { TierMode } from "@/lib/tiers";
import { isTierGoalAchieved } from "@/lib/tiers";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_TOP_COUNT,
    calculateBasicRatingTheoreticalMax,
    getBasicRatingCoefficient,
    getBasicRatingMaxContribution,
} from "@/lib/tiers/basic-rating";

import { getCachedTierBand } from "./public-tier-data";

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
                                        musicIdx: true,
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
const findMatchingMusic = cache(async (q: string) => {
    if (!q) return null;
    const contains = { contains: q, mode: "insensitive" as const };
    const music = await db.music.findMany({
        where: {
            OR: [
                { index: contains },
                { title: contains },
                { titleKana: contains },
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
});

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
        chart: { difficulty: string; level: number; musicIdx: string };
    }) =>
        matchesChart(entry.chart, query) &&
        (!music || music.has(entry.chart.musicIdx));
    const chartIds =
        list?.bands.flatMap((band) =>
            band.entries.filter(matches).map((entry) => entry.chartId)
        ) ?? [];
    const records =
        viewerId && chartIds.length
            ? await db.playData.findMany({
                  where: { userId: viewerId, chartId: { in: chartIds } },
                  select: {
                      chartId: true,
                      score: true,
                      rank: true,
                      fcType: true,
                      gradeRecital: true,
                  },
              })
            : [];
    const byChart = new Map(records.map((record) => [record.chartId, record]));
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
                                            record && {
                                                score: record.score,
                                                rank: record.rank,
                                                fc_type: record.fcType,
                                            },
                                            query.goal
                                        ) &&
                                        (query.mode === "basic" ||
                                            (record?.gradeRecital ?? 0) > 0)
                                    );
                                }).length
                              : null,
                      };
                  }),
              }
            : null,
    };
}

type TierBrowserRecord = NonNullable<TierBrowserEntry["record"]>;

// 구간 본문(공개) — 서열표 · 레이팅 기준 · 곡 검색으로 좁힌 구간
async function loadTierBrowserBand(query: TierBrowserQuery, bandId: number) {
    const [list, basis, music] = await Promise.all([
        getPublishedTierInventory(query.mode, query.goal),
        getModePianistRatingBasis(query.mode),
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
    return { band, basis };
}

/**
 * 구간 공개 응답(2026-10-15 S7) — 세션을 읽지 않아 같은 주소면 누구에게나 같다(CDN 캐시).
 * 내 기록은 getTierBrowserBandRecords 로 따로 받는다
 */
export async function getPublicTierBrowserBand(
    query: TierBrowserQuery,
    bandId: number,
    locale: Locale,
    showLocalizedTitle: boolean
): Promise<TierBrowserBand | null> {
    const loaded = await loadTierBrowserBand(query, bandId);
    if (!loaded) return null;
    const { band } = loaded;
    return {
        id: band.id,
        value: band.value,
        position: band.position,
        entries: band.entries.map((entry) => ({
            id: entry.id,
            chartId: entry.chartId,
            position: entry.position,
            chart: {
                difficulty: entry.chart.difficulty,
                level: entry.chart.level,
                music: {
                    index: entry.chart.music.index,
                    title: entry.chart.music.title,
                    reading:
                        entry.chart.music.titleKana?.trim() ||
                        entry.chart.music.title,
                    background: entry.chart.music.background,
                    localizedTitle: getLocalizedMusicTitle(
                        entry.chart.music,
                        locale,
                        showLocalizedTitle
                    ),
                },
            },
            record: null,
        })),
    };
}

/** 구간 안 내 기록(채보 id → 기록) — 사람마다 달라 캐시하지 않는다 */
export async function getTierBrowserBandRecords(
    query: TierBrowserQuery,
    bandId: number,
    viewerId: number
): Promise<Record<number, TierBrowserRecord> | null> {
    const loaded = await loadTierBrowserBand(query, bandId);
    if (!loaded) return null;
    const { band, basis } = loaded;
    const records = band.entries.length
        ? await db.playData.findMany({
              where: {
                  userId: viewerId,
                  chartId: {
                      in: band.entries.map((entry) => entry.chartId),
                  },
              },
              select: {
                  chartId: true,
                  score: true,
                  rank: true,
                  fcType: true,
                  gradeBasic: true,
                  gradeRecital: true,
              },
          })
        : [];
    const constants = new Map(
        basis.entries.map((entry) => [entry.chartId, entry.value])
    );
    const result: Record<number, TierBrowserRecord> = {};
    for (const record of records) {
        if (record.chartId === null) continue;
        const played =
            record.score > 0 &&
            (query.mode === "basic" || (record.gradeRecital ?? 0) > 0);
        if (!played) continue;
        const constant = constants.get(record.chartId);
        // 공식 Grd 가 0 이면(상위 기록 밖이라 수집되지 않음) 값이 없는 것 — 띠 · 기여에 「+0.00」 대신 비운다
        const grade =
            query.mode === "basic" ? record.gradeBasic : record.gradeRecital;
        result[record.chartId] = {
            score: record.score,
            rank: record.rank,
            fc_type: record.fcType,
            grade: grade ? grade / 100 : null,
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
        };
    }
    return result;
}

/** 공개 구간 + 내 기록 — 첫 화면(SSR)이 한 번에 쓴다 */
export async function getTierBrowserBand(
    query: TierBrowserQuery,
    bandId: number,
    viewerId: number | null,
    locale: Locale
): Promise<TierBrowserBand | null> {
    const showLocalizedTitle = await getMusicTitleDisplayPreference(
        viewerId ?? undefined
    );
    const [band, records] = await Promise.all([
        getPublicTierBrowserBand(query, bandId, locale, showLocalizedTitle),
        viewerId ? getTierBrowserBandRecords(query, bandId, viewerId) : null,
    ]);
    if (!band || !records) return band;
    return {
        ...band,
        entries: band.entries.map((entry) => ({
            ...entry,
            record: records[entry.chartId] ?? null,
        })),
    };
}

/** 옛 서열표 주소(/tiers/{slug})를 모드 · 목표 주소로 넘길 때 쓰는 표의 범위(2026-10-16 D8 — 화면에서 옮김) */
export function getTierListScope(slug: string) {
    return db.tierList.findUnique({
        where: { slug },
        select: { mode: true, goal: true },
    });
}
