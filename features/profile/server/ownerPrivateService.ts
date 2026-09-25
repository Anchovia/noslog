import "server-only";

import db from "@/lib/db";

/**
 * 본인에게만 보이는 비공개 항목(2026-09-26 P1) — 공개 설정으로 숨긴 값만 돌려준다(공개된 값은 공개 캐시가 이미 가짐).
 * 본인 요청일 때만 부르고, 공개 캐시(`getCachedProfileData`)에는 섞지 않는다
 */
export async function getOwnerPrivateFields(userId: number) {
    const [user, lastPlay] = await Promise.all([
        db.user.findUnique({
            where: { id: userId },
            select: {
                nostalgia_name: true,
                discord_name: true,
                discord_username: true,
                play_count: true,
                hide_nostalgia_name: true,
                hide_discord_name: true,
                hide_preferred_arcade: true,
                hide_play_count: true,
                hide_play_activity: true,
                preferredArcade: { select: { name: true } },
            },
        }),
        db.chartPlayHistory.findFirst({
            where: { user_id: userId },
            orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
            select: { source_play_time: true },
        }),
    ]);
    if (!user) return null;
    const discord = [
        user.discord_name,
        user.discord_username ? `@${user.discord_username}` : "",
    ]
        .filter(Boolean)
        .join(" ");
    return {
        nostalgiaName: user.hide_nostalgia_name ? user.nostalgia_name : null,
        discord: user.hide_discord_name && discord ? discord : null,
        arcade: user.hide_preferred_arcade
            ? (user.preferredArcade?.name ?? null)
            : null,
        playCount: user.hide_play_count ? user.play_count : null,
        lastPlayedAt: user.hide_play_activity
            ? (lastPlay?.source_play_time ?? null)
            : null,
        activityHidden: user.hide_play_activity,
    };
}
export type OwnerPrivateFields = NonNullable<
    Awaited<ReturnType<typeof getOwnerPrivateFields>>
>;
