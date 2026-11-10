import "server-only";

import type { Prisma } from "@prisma/client";

const DAY_MS = 86_400_000;

export function lockInTransaction(tx: Prisma.TransactionClient, key: string) {
    return tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
}

/** 키로 잠근 뒤 최근 24시간 건수를 세어 한도 안인지 답한다 — 세기와 넣기가 같은 트랜잭션 안에 있어야 한다 */
export async function isWithinDailyLimit(
    tx: Prisma.TransactionClient,
    {
        lockKey,
        limit,
        countRecent,
    }: {
        lockKey: string;
        limit: number;
        countRecent: (since: Date) => Promise<number>;
    }
) {
    await lockInTransaction(tx, lockKey);
    const recent = await countRecent(new Date(Date.now() - DAY_MS));
    return recent < limit;
}
