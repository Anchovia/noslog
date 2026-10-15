import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { getNameLabels } from "@/features/contributions/server/contribution-point-service";
import type {
    DiscoveryCounts,
    DiscoveryPage,
    DiscoveryQuery,
} from "@/features/music/schemas/discovery-schema";
import {
    discoveryCountsSchema,
    discoveryPageSchema,
    discoveryQuerySchema,
    getDiscoveryOrder,
    getDiscoverySort,
} from "@/features/music/schemas/discovery-schema";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
    contributionBaseRevision,
    isExtractedChart,
} from "@/lib/chart-pattern/chartSource";
import db from "@/lib/db";

export function publicDiscoveryQuery(
    query: DiscoveryQuery,
    userId: number | null
): DiscoveryQuery {
    return userId
        ? query
        : {
              ...query,
              records: [],
              missMin: undefined,
              missMax: undefined,
              sort: query.sort === "recent" ? undefined : query.sort,
          };
}

function chartConditions(query: DiscoveryQuery, userId: number | null) {
    const conditions: Prisma.Sql[] = [];
    // 공개 채보 — 공개 버전 번호로 판단한다(2026-10-15 S13). 공개본 JSON 은 늘 번호와 함께 써져 큰 값을 비교하지 않는다
    if (query.scope === "chart")
        conditions.push(
            Prisma.sql`pattern."published_revision" IS NOT NULL AND pattern."published_content" IS NOT NULL`
        );
    if (query.difficulties.length)
        conditions.push(
            Prisma.sql`(${Prisma.join(
                query.difficulties.map(
                    (range) =>
                        Prisma.sql`(chart."difficulty" = ${range.difficulty} AND chart."level" BETWEEN ${range.min} AND ${range.max})`
                ),
                " OR "
            )})`
        );
    if (userId) {
        if (query.records.includes("unplayed"))
            conditions.push(Prisma.sql`COALESCE(play."play_count", 0) = 0`);
        const achieved = query.records
            .filter((record) => record !== "unplayed")
            .map((record) => {
                if (record === "s") return Prisma.sql`UPPER(play."rank") = 'S'`;
                if (record === "fc")
                    return Prisma.sql`(play."fc_type" > 0 OR play."fullcombo_count" > 0)`;
                return Prisma.sql`(play."score" >= 1000000 OR play."pianistic_count" > 0)`;
            });
        if (achieved.length)
            conditions.push(
                Prisma.sql`play."play_count" > 0 AND (${Prisma.join(achieved, " OR ")})`
            );
        if (query.missMin !== undefined)
            conditions.push(
                Prisma.sql`play."play_count" > 0 AND play."judge_miss" >= ${query.missMin}`
            );
        if (query.missMax !== undefined)
            conditions.push(
                Prisma.sql`play."play_count" > 0 AND play."judge_miss" <= ${query.missMax}`
            );
    }
    return conditions.length
        ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
        : Prisma.empty;
}

// 목록과 개수 미리보기는 같은 공개 범위·검색·채보 조건을 사용한다.
function discoveryCriteria(input: DiscoveryQuery, userId: number | null) {
    const query = publicDiscoveryQuery(
        discoveryQuerySchema.parse(input),
        userId
    );
    const escaped = query.q.replace(/[\\%_]/g, "\\$&");
    const prefix = `${escaped}%`;
    const contains = `%${escaped}%`;
    const filters: Prisma.Sql[] = [];
    if (query.categories.length)
        filters.push(
            Prisma.sql`music."category_short" IN (${Prisma.join(query.categories)})`
        );
    if (query.q)
        filters.push(Prisma.sql`(music."index" ILIKE ${contains} OR music."title" ILIKE ${contains} OR music."title_kana" ILIKE ${contains} OR music."artist" ILIKE ${contains}
        OR EXISTS (SELECT 1 FROM "MusicTranslation" AS translation WHERE translation."music_index" = music."index" AND translation."status" = 'approved' AND translation."title" ILIKE ${contains}))`);
    return {
        query,
        prefix,
        contains,
        eligible: Prisma.sql`
            SELECT chart."id", chart."music_idx", chart."difficulty", chart."level", pattern."published_at"
            FROM "MusicChart" AS chart
            LEFT JOIN "ChartPattern" AS pattern ON pattern."chart_id" = chart."id"
            LEFT JOIN "PlayData" AS play ON play."chart_id" = chart."id" AND play."user_id" = ${userId}
            ${chartConditions(query, userId)}
        `,
        musicWhere: filters.length
            ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
            : Prisma.empty,
    };
}

/*
 * 비로그인 탐색은 같은 질의면 누구에게나 같다 — 곡 · 공개 채보가 바뀔 때 비워지는 태그로 캐시(2026-10-15 S7).
 * 로그인하면 내 기록 조건이 붙어 캐시하지 않는다. 채보 줄 작성자 라벨(기여 Lv)은 최대 한 시간 늦게 바뀔 수 있다
 */
const PUBLIC_DISCOVERY_CACHE = {
    tags: [CACHE_TAGS.musicCatalog, CACHE_TAGS.musicDetails],
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
};
const getCachedPublicDiscoveryCounts = unstable_cache(
    (input: DiscoveryQuery) => queryDiscoveryCounts(input, null),
    ["public-discovery-counts-v1"],
    PUBLIC_DISCOVERY_CACHE
);
const getCachedPublicDiscoveryPage = unstable_cache(
    (input: DiscoveryQuery, offset: number) =>
        queryDiscoveryPage(input, offset, null),
    ["public-discovery-page-v1"],
    PUBLIC_DISCOVERY_CACHE
);

export function getDiscoveryCounts(
    input: DiscoveryQuery,
    userId: number | null = null
): Promise<DiscoveryCounts> {
    return userId === null
        ? getCachedPublicDiscoveryCounts(publicDiscoveryQuery(input, null))
        : queryDiscoveryCounts(input, userId);
}

export function getDiscoveryPage(
    input: DiscoveryQuery,
    offset = 0,
    userId: number | null = null
): Promise<DiscoveryPage> {
    return userId === null
        ? getCachedPublicDiscoveryPage(
              publicDiscoveryQuery(input, null),
              Math.max(0, Math.min(100000, Math.floor(offset)))
          )
        : queryDiscoveryPage(input, offset, userId);
}

async function queryDiscoveryCounts(
    input: DiscoveryQuery,
    userId: number | null
): Promise<DiscoveryCounts> {
    const { eligible, musicWhere } = discoveryCriteria(input, userId);
    const rows = await db.$queryRaw<DiscoveryCounts[]>(Prisma.sql`
        WITH eligible AS (${eligible})
        SELECT COUNT(DISTINCT music."index")::int AS total,
            COUNT(eligible."id")::int AS "chartTotal"
        FROM "Music" AS music JOIN eligible ON eligible."music_idx" = music."index"
        ${musicWhere}
    `);
    return discoveryCountsSchema.parse(rows[0] ?? { total: 0, chartTotal: 0 });
}

async function queryDiscoveryPage(
    input: DiscoveryQuery,
    offset: number,
    userId: number | null
): Promise<DiscoveryPage> {
    const { query, prefix, contains, eligible, musicWhere } = discoveryCriteria(
        input,
        userId
    );
    const safeOffset = Math.max(0, Math.min(100000, Math.floor(offset)));
    const sort = getDiscoverySort(query);
    const sortColumn =
        sort === "name"
            ? Prisma.sql`reading`
            : sort === "level"
              ? Prisma.sql`sort_level`
              : sort === "published"
                ? Prisma.sql`published`
                : sort === "recent"
                  ? Prisma.sql`recent`
                  : Prisma.sql`relevance`;
    const direction =
        getDiscoveryOrder(query) === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;
    // 채보 보기는 채보마다 한 줄(2026-09-25 A2) — 정렬 · 페이지 · 개수가 모두 채보 단위. 악곡 보기는 곡 묶음 그대로
    const chartScope = query.scope === "chart";
    const catalog = chartScope
        ? Prisma.sql`
            SELECT music."index", music."title", music."artist", music."category_short", music."background",
                NULL::text AS "localizedTitle",
                COALESCE(NULLIF(TRIM(music."title_kana"), ''), music."title") AS reading,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Normal') AS normal,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Hard') AS hard,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Expert') AS expert,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Real') AS real,
                CASE WHEN eligible."difficulty" = ${query.sortDifficulty ?? null} THEN eligible."level" END AS sort_level,
                eligible."published_at" AS published,
                ${sort === "recent" ? Prisma.sql`(SELECT MAX(REPLACE(history."source_play_time", '/', '.')) FROM "ChartPlayHistory" AS history WHERE history."user_id" = ${userId} AND history."chart_id" = eligible."id")` : Prisma.sql`NULL::text`} AS recent,
                CASE WHEN LOWER(music."index") = LOWER(${query.q}) OR LOWER(music."title") = LOWER(${query.q}) OR LOWER(music."title_kana") = LOWER(${query.q})
                    OR EXISTS (SELECT 1 FROM "MusicTranslation" t WHERE t."music_index" = music."index" AND t."status" = 'approved' AND LOWER(t."title") = LOWER(${query.q})) THEN 4
                    WHEN music."title" ILIKE ${prefix} OR music."title_kana" ILIKE ${prefix} THEN 3
                    WHEN music."title" ILIKE ${contains} OR music."title_kana" ILIKE ${contains} THEN 2
                    WHEN LOWER(music."artist") = LOWER(${query.q}) THEN 2 ELSE 1 END AS relevance,
                1 AS target_count,
                CASE eligible."difficulty" WHEN 'Normal' THEN 0 WHEN 'Hard' THEN 1 WHEN 'Expert' THEN 2 ELSE 3 END AS difficulty_order,
                eligible."id" AS "chartId",
                jsonb_build_array(jsonb_build_object('difficulty', eligible."difficulty", 'level', eligible."level")) AS targets
            FROM "Music" AS music JOIN eligible ON eligible."music_idx" = music."index"
            ${musicWhere}
            GROUP BY music."index", music."title", music."title_kana", music."artist", music."category_short", music."background",
                eligible."id", eligible."difficulty", eligible."level", eligible."published_at"
        `
        : Prisma.sql`
            SELECT music."index", music."title", music."artist", music."category_short", music."background",
                NULL::text AS "localizedTitle",
                COALESCE(NULLIF(TRIM(music."title_kana"), ''), music."title") AS reading,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Normal') AS normal,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Hard') AS hard,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Expert') AS expert,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = 'Real') AS real,
                (SELECT MAX(chart."level") FROM "MusicChart" chart WHERE chart."music_idx" = music."index" AND chart."difficulty" = ${query.sortDifficulty ?? null}) AS sort_level,
                MAX(eligible."published_at") AS published,
                ${sort === "recent" ? Prisma.sql`(SELECT MAX(REPLACE(history."source_play_time", '/', '.')) FROM "ChartPlayHistory" AS history JOIN eligible AS target ON target."id" = history."chart_id" WHERE history."user_id" = ${userId} AND target."music_idx" = music."index")` : Prisma.sql`NULL::text`} AS recent,
                CASE WHEN LOWER(music."index") = LOWER(${query.q}) OR LOWER(music."title") = LOWER(${query.q}) OR LOWER(music."title_kana") = LOWER(${query.q})
                    OR EXISTS (SELECT 1 FROM "MusicTranslation" t WHERE t."music_index" = music."index" AND t."status" = 'approved' AND LOWER(t."title") = LOWER(${query.q})) THEN 4
                    WHEN music."title" ILIKE ${prefix} OR music."title_kana" ILIKE ${prefix} THEN 3
                    WHEN music."title" ILIKE ${contains} OR music."title_kana" ILIKE ${contains} THEN 2
                    WHEN LOWER(music."artist") = LOWER(${query.q}) THEN 2 ELSE 1 END AS relevance,
                COUNT(eligible."id")::int AS target_count,
                jsonb_agg(jsonb_build_object('difficulty', eligible."difficulty", 'level', eligible."level")
                    ORDER BY CASE eligible."difficulty" WHEN 'Normal' THEN 0 WHEN 'Hard' THEN 1 WHEN 'Expert' THEN 2 ELSE 3 END) AS targets
            FROM "Music" AS music JOIN eligible ON eligible."music_idx" = music."index"
            ${musicWhere}
            GROUP BY music."index", music."title", music."title_kana", music."artist", music."category_short", music."background"
        `;
    const rows = await db.$queryRaw<
        {
            total: number;
            chartTotal: number;
            items: (DiscoveryPage["items"][number] & { chartId?: number })[];
        }[]
    >(Prisma.sql`
        WITH eligible AS (${eligible}), catalog AS (${catalog}), page AS (
            SELECT * FROM catalog ORDER BY ${sortColumn} ${direction} NULLS LAST, reading ASC, "index" ASC${chartScope ? Prisma.sql`, difficulty_order ASC` : Prisma.empty} LIMIT 20 OFFSET ${safeOffset}
        )
        SELECT COUNT(*)::int AS total, COALESCE(SUM(target_count), 0)::int AS "chartTotal",
            COALESCE((SELECT jsonb_agg(to_jsonb(page)) FROM page), '[]'::jsonb) AS items FROM catalog
    `);
    const row = rows[0] ?? { total: 0, chartTotal: 0, items: [] };
    const charts = chartScope
        ? await getChartRowInfo(
              row.items.flatMap((item) =>
                  item.chartId === undefined ? [] : [item.chartId]
              )
          )
        : null;
    return discoveryPageSchema.parse({
        ...row,
        items: row.items.map(({ chartId, ...item }) => ({
            ...item,
            normal: item.normal ?? 0,
            hard: item.hard ?? 0,
            expert: item.expert ?? 0,
            ...(charts && chartId !== undefined
                ? { chart: charts.get(chartId) }
                : {}),
        })),
        nextOffset:
            safeOffset + row.items.length < row.total
                ? safeOffset + row.items.length
                : null,
    });
}

/**
 * 채보 줄의 작성자 · 출처 · 공개일(2026-09-25 I2) — 뷰어 머리와 같은 규칙: 작성자는 유저 기여면 그 사람, 아니면 공개한 사람.
 * 이름 옆 라벨은 기여 Lv(이름 라벨 규칙의 최소 등급 이상)만 — 운영자 라벨은 목록에 두지 않는다
 */
async function getChartRowInfo(chartIds: number[]) {
    const info = new Map<
        number,
        NonNullable<DiscoveryPage["items"][number]["chart"]>
    >();
    if (!chartIds.length) return info;
    const patterns = await db.chartPattern.findMany({
        where: { chartId: { in: chartIds } },
        select: {
            chartId: true,
            publishedAt: true,
            publishedRevision: true,
            author: { select: { id: true, username: true } },
            publishedBy: { select: { username: true } },
            revisions: {
                where: { kind: { in: ["vid2bmap", "contribution"] } },
                select: { number: true, kind: true, message: true },
            },
        },
    });
    const labels = await getNameLabels(
        patterns.flatMap((pattern) =>
            pattern.author?.username ? [pattern.author.id] : []
        )
    );
    for (const pattern of patterns) {
        const author = pattern.author?.username ? pattern.author : null;
        const label = author ? labels.get(author.id) : null;
        info.set(pattern.chartId, {
            publishedAt: pattern.publishedAt?.toISOString() ?? null,
            author: author?.username ?? pattern.publishedBy?.username ?? null,
            authorLevel: label?.kind === "level" ? label.level : null,
            extracted:
                pattern.publishedRevision !== null &&
                isExtractedChart(
                    pattern.publishedRevision,
                    pattern.revisions.map((revision) => ({
                        number: revision.number,
                        kind: revision.kind,
                        baseRevision:
                            revision.kind === "contribution"
                                ? contributionBaseRevision(revision.message)
                                : null,
                    }))
                ),
        });
    }
    return info;
}
