import "server-only";

import db from "@/lib/db";
import { getProfileRating } from "@/features/profile/server/profilePlaysService";

export async function getProfileOverviewContext(
    userId: number,
    isOwner: boolean
) {
    const [basic, recital, records, sync] = await Promise.all([
        getProfileRating(userId, "basic"),
        getProfileRating(userId, "recital"),
        db.playData.findMany({
            where: { user_id: userId, play_count: { gt: 0 } },
            select: {
                judge_sjust: true,
                judge_just: true,
                judge_good: true,
                judge_near: true,
                judge_miss: true,
            },
        }),
        isOwner
            ? db.dataSync.findFirst({
                  where: { user_id: userId },
                  orderBy: [{ started_at: "desc" }, { id: "desc" }],
                  select: {
                      status: true,
                      started_at: true,
                      completed_at: true,
                      error_message: true,
                  },
              })
            : null,
    ]);
    const counts = { sjust: 0, just: 0, good: 0, near: 0, miss: 0 };
    let chartCount = 0;
    for (const record of records) {
        const values = [
            record.judge_sjust,
            record.judge_just,
            record.judge_good,
            record.judge_near,
            record.judge_miss,
        ];
        if (
            values.some(
                (value) =>
                    value === null || !Number.isFinite(value) || value < 0
            ) ||
            values.reduce<number>((sum, value) => sum + (value ?? 0), 0) === 0
        )
            continue;
        chartCount += 1;
        counts.sjust += record.judge_sjust!;
        counts.just += record.judge_just!;
        counts.good += record.judge_good!;
        counts.near += record.judge_near!;
        counts.miss += record.judge_miss!;
    }
    return {
        ratings: {
            basic: basic ? Math.round(basic.rating) : null,
            recital: recital ? Math.round(recital.rating) : null,
        },
        judgement: { counts, chartCount },
        hasRecords: records.length > 0,
        sync: sync
            ? {
                  status:
                      sync.status === "completed" && sync.error_message
                          ? "partial"
                          : sync.status,
                  startedAt: sync.started_at.toISOString(),
                  completedAt: sync.completed_at?.toISOString() ?? null,
              }
            : null,
    };
}
export type ProfileOverviewContext = Awaited<
    ReturnType<typeof getProfileOverviewContext>
>;
