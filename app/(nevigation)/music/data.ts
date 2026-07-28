import "server-only";

import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import {
    normalizeMusicQuery,
    type MusicSearchParams,
    type NormalizedMusicQuery,
} from "./query";

const PAGE_SIZE = 20;

interface MusicRow {
    index: string;
    title: string;
    artist: string | null;
    category_short: string;
    background: string | null;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
    representative_level: number;
    record_metric: number;
}

interface MusicCursor {
    index: string;
    title: string;
    representativeLevel: number;
    recordMetric: number;
}

function encodeCursor(row: MusicRow) {
    return Buffer.from(
        JSON.stringify({
            index: row.index,
            title: row.title,
            representativeLevel: row.representative_level,
            recordMetric: row.record_metric,
        } satisfies MusicCursor)
    ).toString("base64url");
}

function decodeCursor(value: string | null): MusicCursor | null {
    if (!value || value.length > 2_048) return null;

    try {
        const parsed = JSON.parse(
            Buffer.from(value, "base64url").toString("utf8")
        ) as Partial<MusicCursor>;
        return typeof parsed.index === "string" &&
            typeof parsed.title === "string" &&
            Number.isInteger(parsed.representativeLevel) &&
            Number.isFinite(parsed.recordMetric)
            ? (parsed as MusicCursor)
            : null;
    } catch {
        return null;
    }
}

function buildWhere(query: NormalizedMusicQuery, userId: number | null) {
    const conditions: Prisma.Sql[] = [];

    if (query.q) {
        const keyword = `%${query.q}%`;
        conditions.push(
            Prisma.sql`(music."title" ILIKE ${keyword} OR music."artist" ILIKE ${keyword})`
        );
    }
    if (query.categories.length > 0) {
        conditions.push(
            Prisma.sql`music."category_short" IN (${Prisma.join(query.categories)})`
        );
    }
    if (query.difficulties.length > 0) {
        const difficultyConditions = query.difficulties.map(
            ({ difficulty, min, max }) => Prisma.sql`
                EXISTS (
                    SELECT 1
                    FROM "MusicChart" AS filtered_chart
                    WHERE filtered_chart."music_idx" = music."index"
                      AND filtered_chart."difficulty" = ${difficulty}
                      AND filtered_chart."level" BETWEEN ${min} AND ${max}
                )
            `
        );
        conditions.push(
            Prisma.sql`(${Prisma.join(difficultyConditions, " OR ")})`
        );
    }
    const recordCondition = buildRecordWhere(query, userId);
    if (recordCondition) conditions.push(recordCondition);

    return conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
        : Prisma.empty;
}

function buildRecordWhere(query: NormalizedMusicQuery, userId: number | null) {
    if (!userId || query.recordFilters.length === 0) return null;

    const recordChartConditions = query.difficulties.map(
        ({ difficulty, min, max }) => Prisma.sql`
            (record_chart."difficulty" = ${difficulty}
             AND record_chart."level" BETWEEN ${min} AND ${max})
        `
    );
    const recordChartWhere =
        recordChartConditions.length > 0
            ? Prisma.sql`AND (${Prisma.join(recordChartConditions, " OR ")})`
            : Prisma.empty;
    const historyChartConditions = query.difficulties.map(
        ({ difficulty, min, max }) => Prisma.sql`
            (history_chart."difficulty" = ${difficulty}
             AND history_chart."level" BETWEEN ${min} AND ${max})
        `
    );
    const historyChartWhere =
        historyChartConditions.length > 0
            ? Prisma.sql`AND (${Prisma.join(historyChartConditions, " OR ")})`
            : Prisma.empty;
    const judgementTotal = Prisma.sql`
        (
            COALESCE(play."judge_sjust", 0) +
            COALESCE(play."judge_just", 0) +
            COALESCE(play."judge_good", 0) +
            COALESCE(play."judge_miss", 0) +
            COALESCE(play."judge_near", 0)
        )
    `;
    const playDataFilters = new Set([
        "clear",
        "s",
        "fc",
        "pianist",
        "miss-near",
        "sjust-low",
        "standard-low",
        "tenuto-low",
        "glissando-low",
        "trill-low",
    ]);
    const playedConditions = query.recordFilters
        .filter((filter) => playDataFilters.has(filter))
        .map((filter) => {
            if (filter === "clear")
                return Prisma.sql`COALESCE(play."clear_count", 0) > 0`;
            if (filter === "s") return Prisma.sql`UPPER(play."rank") = 'S'`;
            if (filter === "fc")
                return Prisma.sql`(play."fc_type" > 0 OR play."fullcombo_count" > 0)`;
            if (filter === "pianist")
                return Prisma.sql`(play."score" >= 1000000 OR play."pianistic_count" > 0)`;
            if (filter === "miss-near")
                return Prisma.sql`
                    ${judgementTotal} > 0
                    AND (
                        (COALESCE(play."judge_miss", 0) + COALESCE(play."judge_near", 0))::double precision /
                        ${judgementTotal}
                    ) >= 0.05
                `;
            if (filter === "sjust-low")
                return Prisma.sql`
                    ${judgementTotal} > 0
                    AND COALESCE(play."judge_sjust", 0)::double precision /
                        ${judgementTotal} < 0.85
                `;
            if (filter === "standard-low")
                return Prisma.sql`play."note_rate_standard" IS NOT NULL AND play."note_rate_standard" < 9000`;
            if (filter === "tenuto-low")
                return Prisma.sql`play."note_rate_tenuto" IS NOT NULL AND play."note_rate_tenuto" < 9000`;
            if (filter === "glissando-low")
                return Prisma.sql`play."note_rate_glissando" IS NOT NULL AND play."note_rate_glissando" < 9000`;
            return Prisma.sql`play."note_rate_trill" IS NOT NULL AND play."note_rate_trill" < 9000`;
        });
    const statusConditions: Prisma.Sql[] = [];

    if (playedConditions.length > 0) {
        statusConditions.push(Prisma.sql`
            EXISTS (
                SELECT 1
                FROM "PlayData" AS play
                JOIN "MusicChart" AS record_chart ON record_chart."id" = play."chart_id"
                WHERE play."user_id" = ${userId}
                  AND play."music_idx" = music."index"
                  AND play."play_count" > 0
                  ${recordChartWhere}
                  AND (${Prisma.join(playedConditions, " OR ")})
            )
        `);
    }
    if (query.recordFilters.includes("unplayed")) {
        statusConditions.push(Prisma.sql`
            NOT EXISTS (
                SELECT 1
                FROM "PlayData" AS play
                JOIN "MusicChart" AS record_chart ON record_chart."id" = play."chart_id"
                WHERE play."user_id" = ${userId}
                  AND play."music_idx" = music."index"
                  AND play."play_count" > 0
                  ${recordChartWhere}
            )
        `);
    }
    if (query.recordFilters.includes("recent")) {
        statusConditions.push(Prisma.sql`
            EXISTS (
                SELECT 1
                FROM "ChartPlayHistory" AS history
                JOIN "MusicChart" AS history_chart ON history_chart."id" = history."chart_id"
                WHERE history."user_id" = ${userId}
                  AND history_chart."music_idx" = music."index"
                  ${historyChartWhere}
                  AND (
                      CASE
                          WHEN history."source_play_time" ~
                              '^[0-9]{4}[./][0-9]{2}[./][0-9]{2} [0-9]{2}:[0-9]{2}'
                          THEN TO_TIMESTAMP(
                              REPLACE(
                                  SUBSTRING(history."source_play_time" FROM 1 FOR 16),
                                  '/',
                                  '.'
                              ),
                              'YYYY.MM.DD HH24:MI'
                          )
                          ELSE NULL
                      END
                  ) >= NOW() - INTERVAL '30 days'
            )
        `);
    }
    for (const timingFilter of ["fast", "slow"] as const) {
        if (!query.recordFilters.includes(timingFilter)) continue;

        const timingComparison =
            timingFilter === "fast"
                ? Prisma.sql`latest."fast_count" > latest."slow_count"`
                : Prisma.sql`latest."slow_count" > latest."fast_count"`;
        statusConditions.push(Prisma.sql`
            EXISTS (
                SELECT 1
                FROM (
                    SELECT DISTINCT ON (history."chart_id")
                        history."fast_count",
                        history."slow_count"
                    FROM "ChartPlayHistory" AS history
                    JOIN "MusicChart" AS history_chart ON history_chart."id" = history."chart_id"
                    WHERE history."user_id" = ${userId}
                      AND history_chart."music_idx" = music."index"
                      ${historyChartWhere}
                    ORDER BY
                        history."chart_id",
                        REPLACE(history."source_play_time", '/', '.') DESC,
                        history."id" DESC
                ) AS latest
                WHERE latest."fast_count" IS NOT NULL
                  AND latest."slow_count" IS NOT NULL
                  AND ${timingComparison}
            )
        `);
    }

    return Prisma.sql`(${Prisma.join(statusConditions, " OR ")})`;
}

function buildRecordMetric(query: NormalizedMusicQuery, userId: number | null) {
    if (!userId || (query.sort !== "recent" && query.sort !== "weakness")) {
        return Prisma.sql`0::double precision`;
    }

    const chartConditions = query.difficulties.map(
        ({ difficulty, min, max }) => Prisma.sql`
            (metric_chart."difficulty" = ${difficulty}
             AND metric_chart."level" BETWEEN ${min} AND ${max})
        `
    );
    const chartWhere =
        chartConditions.length > 0
            ? Prisma.sql`AND (${Prisma.join(chartConditions, " OR ")})`
            : Prisma.empty;

    if (query.sort === "recent") {
        return Prisma.sql`
            COALESCE(
                (
                    SELECT MAX(
                        CASE
                            WHEN history."source_play_time" ~
                                '^[0-9]{4}[./][0-9]{2}[./][0-9]{2} [0-9]{2}:[0-9]{2}'
                            THEN EXTRACT(
                                EPOCH FROM TO_TIMESTAMP(
                                    REPLACE(
                                        SUBSTRING(history."source_play_time" FROM 1 FOR 16),
                                        '/',
                                        '.'
                                    ),
                                    'YYYY.MM.DD HH24:MI'
                                )
                            )
                            ELSE 0
                        END
                    )
                    FROM "ChartPlayHistory" AS history
                    JOIN "MusicChart" AS metric_chart
                      ON metric_chart."id" = history."chart_id"
                    WHERE history."user_id" = ${userId}
                      AND metric_chart."music_idx" = music_catalog."index"
                      ${chartWhere}
                ),
                0
            )::double precision
        `;
    }

    const judgementTotal = Prisma.sql`
        (
            COALESCE(play."judge_sjust", 0) +
            COALESCE(play."judge_just", 0) +
            COALESCE(play."judge_good", 0) +
            COALESCE(play."judge_miss", 0) +
            COALESCE(play."judge_near", 0)
        )
    `;
    const noteRateCount = Prisma.sql`
        (
            CASE WHEN play."note_rate_standard" IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN play."note_rate_tenuto" IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN play."note_rate_glissando" IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN play."note_rate_trill" IS NOT NULL THEN 1 ELSE 0 END
        )
    `;
    const noteWeakness = Prisma.sql`
        COALESCE(
            (
                COALESCE((10000 - play."note_rate_standard") / 10000.0, 0) +
                COALESCE((10000 - play."note_rate_tenuto") / 10000.0, 0) +
                COALESCE((10000 - play."note_rate_glissando") / 10000.0, 0) +
                COALESCE((10000 - play."note_rate_trill") / 10000.0, 0)
            ) / NULLIF(${noteRateCount}, 0),
            0
        )
    `;

    return Prisma.sql`
        COALESCE(
            (
                SELECT MAX(
                    CASE
                        WHEN ${judgementTotal} > 0
                        THEN (
                            (
                                (
                                    COALESCE(play."judge_miss", 0) +
                                    COALESCE(play."judge_near", 0)
                                )::double precision /
                                ${judgementTotal}
                            ) * 0.6 +
                            (
                                1 -
                                COALESCE(play."judge_sjust", 0)::double precision /
                                ${judgementTotal}
                            ) * 0.3 +
                            ${noteWeakness} * 0.1
                        )
                        ELSE 0
                    END
                )
                FROM "PlayData" AS play
                JOIN "MusicChart" AS metric_chart
                  ON metric_chart."id" = play."chart_id"
                WHERE play."user_id" = ${userId}
                  AND play."music_idx" = music_catalog."index"
                  AND play."play_count" > 0
                  ${chartWhere}
            ),
            0
        )::double precision
    `;
}

function buildCursorWhere(
    query: NormalizedMusicQuery,
    cursor: MusicCursor | null
) {
    if (!cursor) return Prisma.empty;

    if (query.sort === "level") {
        const levelComparison =
            query.order === "asc"
                ? Prisma.sql`catalog."representative_level" > ${cursor.representativeLevel}`
                : Prisma.sql`catalog."representative_level" < ${cursor.representativeLevel}`;
        return Prisma.sql`
            WHERE ${levelComparison}
               OR (
                    catalog."representative_level" = ${cursor.representativeLevel}
                    AND (
                        catalog."title" > ${cursor.title}
                        OR (catalog."title" = ${cursor.title} AND catalog."index" > ${cursor.index})
                    )
               )
        `;
    }

    if (query.sort === "recent" || query.sort === "weakness") {
        const metricComparison =
            query.order === "asc"
                ? Prisma.sql`catalog."record_metric" > ${cursor.recordMetric}`
                : Prisma.sql`catalog."record_metric" < ${cursor.recordMetric}`;
        return Prisma.sql`
            WHERE ${metricComparison}
               OR (
                    catalog."record_metric" = ${cursor.recordMetric}
                    AND (
                        catalog."title" > ${cursor.title}
                        OR (catalog."title" = ${cursor.title} AND catalog."index" > ${cursor.index})
                    )
               )
        `;
    }

    const titleComparison =
        query.order === "asc"
            ? Prisma.sql`catalog."title" > ${cursor.title}`
            : Prisma.sql`catalog."title" < ${cursor.title}`;
    return Prisma.sql`
        WHERE ${titleComparison}
           OR (catalog."title" = ${cursor.title} AND catalog."index" > ${cursor.index})
    `;
}

function buildOrderBy(query: NormalizedMusicQuery) {
    if (query.sort === "level") {
        return query.order === "asc"
            ? Prisma.sql`catalog."representative_level" ASC, catalog."title" ASC, catalog."index" ASC`
            : Prisma.sql`catalog."representative_level" DESC, catalog."title" ASC, catalog."index" ASC`;
    }

    if (query.sort === "recent" || query.sort === "weakness") {
        return query.order === "asc"
            ? Prisma.sql`catalog."record_metric" ASC, catalog."title" ASC, catalog."index" ASC`
            : Prisma.sql`catalog."record_metric" DESC, catalog."title" ASC, catalog."index" ASC`;
    }

    return query.order === "asc"
        ? Prisma.sql`catalog."title" ASC, catalog."index" ASC`
        : Prisma.sql`catalog."title" DESC, catalog."index" ASC`;
}

async function queryMusicPage(
    query: NormalizedMusicQuery,
    cursorValue: string | null,
    userId: number | null = null
) {
    const cursor = decodeCursor(cursorValue);
    const selectedDifficulties = query.difficulties.map(
        ({ difficulty }) => difficulty
    );
    const representativeDifficulties =
        selectedDifficulties.length > 0 ? selectedDifficulties : ["Expert"];
    const rows = await db.$queryRaw<MusicRow[]>(Prisma.sql`
        WITH music_catalog AS (
            SELECT
                music."index",
                music."title",
                music."artist",
                music."category_short",
                music."background",
                COALESCE(MAX(chart."level") FILTER (WHERE chart."difficulty" = 'Normal'), 0)::int AS "normal",
                COALESCE(MAX(chart."level") FILTER (WHERE chart."difficulty" = 'Hard'), 0)::int AS "hard",
                COALESCE(MAX(chart."level") FILTER (WHERE chart."difficulty" = 'Expert'), 0)::int AS "expert",
                MAX(chart."level") FILTER (WHERE chart."difficulty" = 'Real')::int AS "real",
                COALESCE(
                    MAX(chart."level") FILTER (
                        WHERE chart."difficulty" IN (${Prisma.join(representativeDifficulties)})
                    ),
                    -1
                )::int AS "representative_level"
            FROM "Music" AS music
            JOIN "MusicChart" AS chart ON chart."music_idx" = music."index"
            ${buildWhere(query, userId)}
            GROUP BY
                music."index",
                music."title",
                music."artist",
                music."category_short",
                music."background"
        ),
        catalog AS (
            SELECT
                music_catalog.*,
                ${buildRecordMetric(query, userId)} AS "record_metric"
            FROM music_catalog
        )
        SELECT *
        FROM catalog
        ${buildCursorWhere(query, cursor)}
        ORDER BY ${buildOrderBy(query)}
        LIMIT ${PAGE_SIZE + 1}
    `);
    const hasNextPage = rows.length > PAGE_SIZE;
    const visibleRows = rows.slice(0, PAGE_SIZE);

    return {
        items: visibleRows.map((row) => ({
            index: row.index,
            title: row.title,
            artist: row.artist,
            category_short: row.category_short,
            background: row.background,
            normal: row.normal,
            hard: row.hard,
            expert: row.expert,
            real: row.real,
        })),
        nextCursor:
            hasNextPage && visibleRows.length > 0
                ? encodeCursor(visibleRows.at(-1)!)
                : null,
    };
}

const getCachedMusicPage = unstable_cache(
    queryMusicPage,
    ["music-catalog-page"],
    {
        tags: [CACHE_TAGS.musicCatalog],
        revalidate: 3600,
    }
);

export async function getMusicPage(
    searchParams: MusicSearchParams,
    cursor: string | null = null,
    userId: number | null = null
) {
    const query = normalizeMusicQuery(searchParams);
    const usesPersonalSort =
        query.sort === "recent" || query.sort === "weakness";

    if (userId && (query.recordFilters.length > 0 || usesPersonalSort)) {
        return queryMusicPage(query, cursor, userId);
    }

    const publicQuery = usesPersonalSort
        ? {
              ...query,
              sort: "name" as const,
              order: "asc" as const,
              recordFilters: [],
          }
        : { ...query, recordFilters: [] };

    return getCachedMusicPage(publicQuery, cursor);
}
