import "server-only";

import { Prisma } from "@prisma/client";

import db from "@/lib/db";
import type {
    SearchPreview,
    SearchPreviewQuery,
} from "@/features/music/schemas/searchPreviewSchema";

export async function getSearchPreview(
    query: SearchPreviewQuery
): Promise<SearchPreview> {
    const escaped = query.q.replace(/[\\%_]/g, "\\$&");
    const contains = `%${escaped}%`;
    const prefix = `${escaped}%`;
    const chartScope = query.scope === "chart";
    const rows = await db.$queryRaw<
        {
            index: string;
            title: string;
            artist: string | null;
            background: string | null;
            category_short: string;
            difficulty: string | null;
            level: number | null;
            total: number;
        }[]
    >(Prisma.sql`
        WITH matches AS (
            SELECT music."index", music."title", music."artist", music."background", music."category_short",
                ${chartScope ? Prisma.sql`chart."difficulty"` : Prisma.sql`NULL::text`} AS difficulty,
                ${chartScope ? Prisma.sql`chart."level"` : Prisma.sql`NULL::int`} AS level,
                CASE WHEN LOWER(music."title") = LOWER(${query.q}) THEN 0
                     WHEN music."title" ILIKE ${prefix} THEN 1
                     WHEN music."title" ILIKE ${contains} THEN 2 ELSE 3 END AS relevance
            FROM "Music" AS music
            ${
                chartScope
                    ? Prisma.sql`JOIN "MusicChart" AS chart ON chart."music_idx" = music."index"
                JOIN "ChartPattern" AS pattern ON pattern."chart_id" = chart."id"
                AND pattern."published_content" IS NOT NULL AND pattern."published_content" != 'null'::jsonb`
                    : Prisma.empty
            }
            WHERE music."title" ILIKE ${contains} OR music."artist" ILIKE ${contains}
                OR music."title_kana" ILIKE ${contains}
                OR EXISTS (SELECT 1 FROM "MusicTranslation" AS translation
                    WHERE translation."music_index" = music."index" AND translation."status" = 'approved'
                    AND translation."title" ILIKE ${contains})
        )
        SELECT *, COUNT(*) OVER()::int AS total FROM matches
        ORDER BY relevance, title, index, difficulty LIMIT 5
    `);
    const charts = rows.length
        ? await db.musicChart.findMany({
              where: { music_idx: { in: rows.map((row) => row.index) } },
              select: { music_idx: true, difficulty: true, level: true },
          })
        : [];
    return {
        total: rows[0]?.total ?? 0,
        items: rows.map(
            ({
                index,
                title,
                artist,
                background,
                category_short,
                difficulty,
                level,
            }) => {
                const levels = Object.fromEntries(
                    charts
                        .filter((chart) => chart.music_idx === index)
                        .map((chart) => [
                            chart.difficulty.toLowerCase(),
                            chart.level,
                        ])
                );
                return {
                    index,
                    title,
                    artist,
                    background,
                    category_short,
                    difficulty,
                    level,
                    localizedTitle: null,
                    normal: levels.normal ?? 0,
                    hard: levels.hard ?? 0,
                    expert: levels.expert ?? 0,
                    real: levels.real ?? null,
                };
            }
        ),
    };
}
