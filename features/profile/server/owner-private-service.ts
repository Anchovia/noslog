import "server-only";

import { cache } from "react";

import db from "@/lib/db";
import { formatKstPlayTime } from "@/lib/player-stats";

/**
 * 본인에게만 보이는 비공개 항목(2026-09-26 P1) — 공개 설정으로 숨긴 값만 돌려준다(공개된 값은 공개 캐시가 이미 가짐).
 * 본인 요청일 때만 부르고, 공개 캐시(`getCachedProfileData`)에는 섞지 않는다
 */
// 한 요청에서 셸 · 탭이 함께 불러도 한 번만 읽는다(2026-10-16 D8 · Q2)
export const getOwnerPrivateFields = cache(async (userId: number) => {
    const [user, lastPlay] = await Promise.all([
        db.user.findUnique({
            where: { id: userId },
            select: {
                nostalgiaName: true,
                discordName: true,
                discordUsername: true,
                stats: { select: { playCount: true } },
                hideNostalgiaName: true,
                hideDiscordName: true,
                hidePreferredArcade: true,
                hidePlayCount: true,
                hidePlayActivity: true,
                preferredArcade: { select: { name: true } },
            },
        }),
        db.chartPlayHistory.findFirst({
            where: { userId: userId },
            orderBy: [{ playedAt: "desc" }, { id: "desc" }],
            select: { playedAt: true },
        }),
    ]);
    if (!user) return null;
    const discord = [
        user.discordName,
        user.discordUsername ? `@${user.discordUsername}` : "",
    ]
        .filter(Boolean)
        .join(" ");
    return {
        nostalgiaName: user.hideNostalgiaName ? user.nostalgiaName : null,
        discord: user.hideDiscordName && discord ? discord : null,
        arcade: user.hidePreferredArcade
            ? (user.preferredArcade?.name ?? null)
            : null,
        playCount: user.hidePlayCount ? (user.stats?.playCount ?? null) : null,
        lastPlayedAt: user.hidePlayActivity
            ? formatKstPlayTime(lastPlay?.playedAt)
            : null,
        activityHidden: user.hidePlayActivity,
    };
});
export type OwnerPrivateFields = NonNullable<
    Awaited<ReturnType<typeof getOwnerPrivateFields>>
>;
