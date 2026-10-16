import db from "@/lib/db";
import { writePlayerStats } from "@/lib/services/user/player-stats";
import { recordBestAt } from "@/lib/services/user/recent-record-merge";

// 공식 플레이어 정보 중 쓰는 것만 — 브로치 · NOS 는 읽는 곳이 없어 받지 않는다(2026-10-16 DB 재설계 K5)
export interface SyncPlayerProfile {
    name: string;
    play_count: number;
    last: {
        playtime: string;
    };
}

export async function updatePlayerProfile(
    userId: number,
    player: SyncPlayerProfile
) {
    const startTime = Date.now();
    await db.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: userId },
            data: { nostalgia_name: player.name },
        });
        await writePlayerStats(tx, userId, {
            playCount: player.play_count,
            lastPlayedAt: recordBestAt(player.last.playtime),
        });
    });

    const duration = Date.now() - startTime;
    console.info(`===[플레이어 정보 업데이트 성공(${duration}ms)]===`);
}
