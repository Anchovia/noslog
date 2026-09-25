import "server-only";

import db from "@/lib/db";
import { formatProfilePlayTime } from "@/lib/profile/profilePlayTime";
import { profileActivitySchema } from "@/features/profile/schemas/profileStatsSchema";

const DAY = 86_400_000;
const KST = 9 * 60 * 60 * 1000;
/** 달력 53주(1년) — 첫 열은 일요일부터 */
export const PROFILE_ACTIVITY_WEEKS = 53;

/** 플레이 시각(가져온 문자열, 한국 시각) → 한국 날짜 「YYYY-MM-DD」 */
export function playDay(source: string) {
    const time = formatProfilePlayTime(source, "ko")?.dateTime;
    return time
        ? new Date(Date.parse(time) + KST).toISOString().slice(0, 10)
        : null;
}

/** 지금 이어지는 연속 플레이 일수 — 오늘부터 거꾸로, 오늘 아직 안 쳤으면 어제부터(오늘은 아직 끊긴 게 아니다, 2026-09-26) */
export function currentStreak(days: readonly { count: number }[]) {
    let index = days.length - 1;
    if (index >= 0 && days[index].count === 0) index -= 1;
    let streak = 0;
    for (; index >= 0 && days[index].count > 0; index -= 1) streak += 1;
    return streak;
}

/**
 * 「활동」 탭(2026-09-26) — 최근 1년(53주) 날짜별 플레이 수와 요약(최근 1년 · 이번 달 · 지금 연속 · 가장 긴 연속).
 * 플레이 기록은 북마클릿 연동 뒤부터라 그 전 날짜는 0 이다. 날짜는 게임과 같은 한국 날짜
 */
export async function getProfileActivity(userId: number, now = new Date()) {
    const today = new Date(now.getTime() + KST);
    today.setUTCHours(0, 0, 0, 0);
    const start = new Date(
        today.getTime() -
            (today.getUTCDay() + (PROFILE_ACTIVITY_WEEKS - 1) * 7) * DAY
    );
    const day = (value: Date) => value.toISOString().slice(0, 10);
    const first = day(start);
    const last = day(today);
    const rows = await db.chartPlayHistory.findMany({
        where: {
            user_id: userId,
            source_play_time: { gte: first.slice(0, 4) },
        },
        select: { source_play_time: true },
    });
    const counts = new Map<string, number>();
    for (const row of rows) {
        const date = playDay(row.source_play_time);
        if (date && date >= first && date <= last)
            counts.set(date, (counts.get(date) ?? 0) + 1);
    }
    const days: { date: string; count: number }[] = [];
    let streak = 0;
    let longestStreak = 0;
    for (let time = start.getTime(); time <= today.getTime(); time += DAY) {
        const date = day(new Date(time));
        const count = counts.get(date) ?? 0;
        days.push({ date, count });
        streak = count ? streak + 1 : 0;
        longestStreak = Math.max(longestStreak, streak);
    }
    const month = last.slice(0, 7);
    return profileActivitySchema.parse({
        start: first,
        end: last,
        days,
        summary: {
            year: days.reduce((sum, item) => sum + item.count, 0),
            month: days
                .filter((item) => item.date.startsWith(month))
                .reduce((sum, item) => sum + item.count, 0),
            currentStreak: currentStreak(days),
            longestStreak,
        },
    });
}
