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
}

interface MusicCursor {
    index: string;
    title: string;
    representativeLevel: number;
}

function encodeCursor(row: MusicRow) {
    return Buffer.from(
        JSON.stringify({
            index: row.index,
            title: row.title,
            representativeLevel: row.representative_level,
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
            Number.isInteger(parsed.representativeLevel)
            ? (parsed as MusicCursor)
            : null;
    } catch {
        return null;
    }
}

function buildWhere(query: NormalizedMusicQuery) {
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

    return conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
        : Prisma.empty;
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

    return query.order === "asc"
        ? Prisma.sql`catalog."title" ASC, catalog."index" ASC`
        : Prisma.sql`catalog."title" DESC, catalog."index" ASC`;
}

async function queryMusicPage(
    query: NormalizedMusicQuery,
    cursorValue: string | null
) {
    const cursor = decodeCursor(cursorValue);
    const selectedDifficulties = query.difficulties.map(
        ({ difficulty }) => difficulty
    );
    const representativeDifficulties =
        selectedDifficulties.length > 0 ? selectedDifficulties : ["Expert"];
    const rows = await db.$queryRaw<MusicRow[]>(Prisma.sql`
        WITH catalog AS (
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
            ${buildWhere(query)}
            GROUP BY
                music."index",
                music."title",
                music."artist",
                music."category_short",
                music."background"
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
    cursor: string | null = null
) {
    return getCachedMusicPage(normalizeMusicQuery(searchParams), cursor);
}
