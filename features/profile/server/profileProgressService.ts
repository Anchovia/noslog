import "server-only";

import db from "@/lib/db";
import { getProfileRating } from "@/features/profile/server/profilePlaysService";
import { profileProgressPayloadSchema } from "@/features/profile/schemas/publicProfileSchema";
import type { ProfileProgressQuery } from "@/features/profile/schemas/publicProfileSchema";

export async function getPublicProfileProgress(
    userId: number,
    query: ProfileProgressQuery,
    now = new Date()
) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { grade_basic: true, grade_recital: true },
    });
    if (!user) return null;
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
            getProfileRating(userId, query.mode),
            db.userRatingHistory.findMany({
                where: {
                    user_id: userId,
                    mode: query.mode,
                    sync: { status: "completed" },
                    observed_at: {
                        ...(query.range === "all" ? {} : { gte: since }),
                        lte: now,
                    },
                },
                select: { observed_at: true, rating: true },
                orderBy: [{ observed_at: "asc" }, { id: "asc" }],
            }),
        ]);
        current = rating?.rating ?? null;
        points = history.map((row) => ({
            date: row.observed_at.toISOString(),
            value: row.rating,
        }));
    } else {
        const field = query.mode === "basic" ? "grade_basic" : "grade_recital";
        const history = await db.userBestGrade.findMany({
            where: { user_id: userId },
            select: { besttime: true, grade_basic: true, grade_recital: true },
            orderBy: [{ besttime: "asc" }, { id: "asc" }],
        });
        current = user[field] && user[field] > 0 ? user[field] / 100 : null;
        points = history.flatMap((row) => {
            // Existing history uses the Korean sync calendar, not the reader's timezone.
            const date = new Date(
                `${row.besttime.slice(0, 10)}T00:00:00+09:00`
            );
            return Number.isFinite(date.getTime()) &&
                date.getTime() >= cutoff &&
                date <= now &&
                row[field] > 0
                ? [{ date: date.toISOString(), value: row[field] / 100 }]
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
