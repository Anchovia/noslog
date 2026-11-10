import "server-only";

import type { SyncPlayerProfile } from "@/features/sync/schemas/sync-request-schema";
import { recordBestAt } from "@/features/sync/server/recent-record-merge";
import { writePlayerStats } from "@/features/sync/server/write-player-stats";
import db from "@/lib/db";

export async function updatePlayerProfile(
    userId: number,
    player: SyncPlayerProfile
) {
    const startTime = Date.now();
    await db.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: userId },
            data: { nostalgiaName: player.name },
        });
        await writePlayerStats(tx, userId, {
            playCount: player.play_count,
            lastPlayedAt: recordBestAt(player.last.playtime),
        });
    });

    const duration = Date.now() - startTime;
    console.info(`===[플레이어 정보 업데이트 성공(${duration}ms)]===`);
}
