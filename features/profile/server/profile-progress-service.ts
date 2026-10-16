import "server-only";

import type { ProfileProgressQuery } from "@/features/profile/schemas/public-profile-schema";
import { profileProgressPayloadSchema } from "@/features/profile/schemas/public-profile-schema";
import db from "@/lib/db";
import { STATS_GRADE_SELECT, statsGrade } from "@/lib/player-stats";

export async function getPublicProfileProgress(
    userId: number,
    query: ProfileProgressQuery,
    now = new Date()
) {
    const user = await db.user.findUnique({
        where: { id: userId },
        // 지금 Grd 는 player_stats 에서(2026-10-16 DB 재설계 P4)
        select: { stats: { select: STATS_GRADE_SELECT } },
    });
    if (!user) return null;
    const currentGrade = statsGrade(user.stats, query.mode);
    const since = new Date(now);
    if (query.range === "year")
        since.setUTCFullYear(since.getUTCFullYear() - 1);
    else if (query.range !== "all")
        since.setUTCDate(since.getUTCDate() - Number(query.range));
    const cutoff = query.range === "all" ? -Infinity : since.getTime();
    let points: { date: string; value: number }[];
    let current: number | null;
    if (query.metric === "rating") {
        const [rating, history] = await Promise.all([
            // 지금 값은 헤더 · 랭킹과 같은 저장 레이팅(2026-10-16 K3) — 없으면(0 포함) 「레이팅 없음」
            db.playerRating.findUnique({
                where: { userId_mode: { userId: userId, mode: query.mode } },
                select: { rating: true },
            }),
            db.userRatingHistory.findMany({
                where: {
                    userId: userId,
                    mode: query.mode,
                    sync: { status: "completed" },
                    observedAt: {
                        ...(query.range === "all" ? {} : { gte: since }),
                        lte: now,
                    },
                },
                select: { observedAt: true, rating: true },
                orderBy: [{ observedAt: "asc" }, { id: "asc" }],
            }),
        ]);
        current = rating?.rating ?? null;
        points = history.map((row) => ({
            date: row.observedAt.toISOString(),
            value: row.rating,
        }));
    } else {
        const field = query.mode === "basic" ? "gradeBasic" : "gradeRecital";
        // 기간 앞 하루를 넉넉히 둔 날짜부터만 읽는다(2026-10-15 S13) — 정확한 경계는 아래에서 지금처럼 가린다.
        // 날짜는 day(@db.Date, 서울 날짜, 2026-10-16 P4)로 고른다
        const lowerDay =
            query.range === "all"
                ? null
                : new Date(since.getTime() + 9 * 60 * 60 * 1000 - 86400000)
                      .toISOString()
                      .slice(0, 10);
        const history = await db.userBestGrade.findMany({
            where: {
                userId: userId,
                ...(lowerDay
                    ? { day: { gte: new Date(`${lowerDay}T00:00:00Z`) } }
                    : {}),
            },
            select: { day: true, gradeBasic: true, gradeRecital: true },
            orderBy: [{ day: "asc" }, { id: "asc" }],
        });
        current = currentGrade && currentGrade > 0 ? currentGrade / 100 : null;
        points = history.flatMap((row) => {
            // Existing history uses the Korean sync calendar, not the reader's timezone.
            const date = new Date(
                `${row.day?.toISOString().slice(0, 10)}T00:00:00+09:00`
            );
            return Number.isFinite(date.getTime()) &&
                date.getTime() >= cutoff &&
                date <= now &&
                (row[field] ?? 0) > 0
                ? [{ date: date.toISOString(), value: row[field]! / 100 }]
                : [];
        });
    }
    // Retain actual observations only. The current value is separate because
    // today's tier constants may change a rating without a new sync observation.
    const daily = new Map<string, { date: string; value: number }>();
    for (const point of points) {
        const day = new Date(Date.parse(point.date) + 9 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10);
        daily.set(day, point);
    }
    const observations = [...daily.values()];
    const meaningful = observations.filter(
        (point, index) =>
            index === 0 ||
            index === observations.length - 1 ||
            point.value !== observations[index - 1].value ||
            point.value !== observations[index + 1].value
    );
    return profileProgressPayloadSchema.parse({
        query,
        status: current === null ? "unavailable" : "available",
        points: meaningful,
        current,
    });
}
