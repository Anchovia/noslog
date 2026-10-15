import type { Prisma } from "@prisma/client";

type PlayerStatsValues = Omit<
    Prisma.PlayerStatsUncheckedCreateInput,
    "userId" | "updatedAt"
>;

/**
 * 동기화가 계산한 사람별 값을 player_stats 에 쓴다(2026-10-16 DB 재설계 P3 늘리기).
 * 지금은 User 의 같은 열에도 같은 트랜잭션에서 쓴다(양쪽 쓰기) — 읽기를 옮긴 뒤(P4) User 쪽 쓰기를 뺀다
 */
export function writePlayerStats(
    tx: Prisma.TransactionClient,
    userId: number,
    values: PlayerStatsValues
) {
    return tx.playerStats.upsert({
        where: { userId },
        create: { userId, ...values },
        update: values,
    });
}
