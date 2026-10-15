import db from "@/lib/db";
import { writePlayerStats } from "@/lib/services/user/player-stats";
import { recordBestAt } from "@/lib/services/user/recent-record-merge";

interface SyncBrooch {
    "@index": string;
    name: string;
    description: string;
}

export interface SyncPlayerProfile {
    name: string;
    play_count: number;
    travel_info: {
        money: number;
    };
    last: {
        playtime: string;
        brooch: SyncBrooch;
    };
    brooch_list: {
        brooch: SyncBrooch[];
    };
}

export async function updatePlayerProfile(
    userId: number,
    player: SyncPlayerProfile
) {
    const startTime = Date.now();
    const brooches = new Map(
        [...player.brooch_list.brooch, player.last.brooch]
            .filter((brooch) => brooch["@index"])
            .map((brooch) => [brooch["@index"], brooch] as const)
    );
    const ownedBrooches = player.brooch_list.brooch.filter(
        (brooch) => brooch["@index"]
    );
    const equippedBroochIndex = player.last.brooch["@index"] || null;
    const syncedAt = new Date();

    // 브로치는 묶어서 · 바뀐 것만 쓴다(2026-10-15 S9) — 예전처럼 개수만큼 순차 upsert 하지 않는다
    await db.$transaction(async (tx) => {
        const indexes = [...brooches.keys()];
        const known = indexes.length
            ? await tx.brooch.findMany({
                  where: { index: { in: indexes } },
                  select: { index: true, name: true, description: true },
              })
            : [];
        const knownByIndex = new Map(known.map((item) => [item.index, item]));
        const created = [...brooches.values()].filter(
            (brooch) => !knownByIndex.has(brooch["@index"])
        );
        if (created.length > 0) {
            await tx.brooch.createMany({
                data: created.map((brooch) => ({
                    index: brooch["@index"],
                    name: brooch.name,
                    description: brooch.description,
                })),
                skipDuplicates: true,
            });
        }
        for (const brooch of brooches.values()) {
            const current = knownByIndex.get(brooch["@index"]);
            if (
                current &&
                (current.name !== brooch.name ||
                    current.description !== brooch.description)
            ) {
                await tx.brooch.update({
                    where: { index: brooch["@index"] },
                    data: {
                        name: brooch.name,
                        description: brooch.description,
                    },
                });
            }
        }

        await tx.user.update({
            where: { id: userId },
            data: {
                nostalgia_name: player.name,
                play_count: player.play_count,
                nostalgia_nos: player.travel_info.money,
                nostalgia_last_playtime: player.last.playtime,
                equipped_brooch_index: equippedBroochIndex,
            },
        });
        await writePlayerStats(tx, userId, {
            playCount: player.play_count,
            lastPlayedAt: recordBestAt(player.last.playtime),
        });

        // 보유 목록 — 빠진 것만 지우고 새것만 넣고, 남는 것은 확인 시각만 이번 동기화로(결과 행은 예전과 같다)
        const owned = new Set(ownedBrooches.map((brooch) => brooch["@index"]));
        const existing = await tx.userBrooch.findMany({
            where: { user_id: userId },
            select: { brooch_index: true },
        });
        const existingIndexes = new Set(
            existing.map((item) => item.brooch_index)
        );
        const removed = [...existingIndexes].filter(
            (index) => !owned.has(index)
        );
        const added = [...owned].filter((index) => !existingIndexes.has(index));
        const kept = [...owned].filter((index) => existingIndexes.has(index));
        if (removed.length > 0) {
            await tx.userBrooch.deleteMany({
                where: { user_id: userId, brooch_index: { in: removed } },
            });
        }
        if (added.length > 0) {
            await tx.userBrooch.createMany({
                data: added.map((index) => ({
                    user_id: userId,
                    brooch_index: index,
                    synced_at: syncedAt,
                })),
                skipDuplicates: true,
            });
        }
        if (kept.length > 0) {
            await tx.userBrooch.updateMany({
                where: { user_id: userId, brooch_index: { in: kept } },
                data: { synced_at: syncedAt },
            });
        }
    });

    const duration = Date.now() - startTime;
    console.info(`===[플레이어 정보 업데이트 성공(${duration}ms)]===`);
}
