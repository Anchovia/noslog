import db from "@/lib/db";

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
        fame: string;
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

    await db.$transaction(async (tx) => {
        for (const brooch of brooches.values()) {
            await tx.brooch.upsert({
                where: { index: brooch["@index"] },
                create: {
                    index: brooch["@index"],
                    name: brooch.name,
                    description: brooch.description,
                },
                update: {
                    name: brooch.name,
                    description: brooch.description,
                },
            });
        }

        await tx.user.update({
            where: { id: userId },
            data: {
                nostalgia_name: player.name,
                play_count: player.play_count,
                nostalgia_nos: player.travel_info.money,
                nostalgia_fame: player.travel_info.fame,
                nostalgia_last_playtime: player.last.playtime,
                equipped_brooch_index: equippedBroochIndex,
            },
        });

        await tx.userBrooch.deleteMany({ where: { user_id: userId } });
        if (ownedBrooches.length > 0) {
            await tx.userBrooch.createMany({
                data: ownedBrooches.map((brooch) => ({
                    user_id: userId,
                    brooch_index: brooch["@index"],
                    synced_at: syncedAt,
                })),
                skipDuplicates: true,
            });
        }
    });

    const duration = Date.now() - startTime;
    console.info(`===[플레이어 정보 업데이트 성공(${duration}ms)]===`);
}
