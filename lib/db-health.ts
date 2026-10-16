import "server-only";

import db from "@/lib/db";

/** 건강 확인 — DB 에 한 번 닿는지만 본다(2026-10-16 D8 — 라우트에서 옮김) */
export async function pingDatabase() {
    await db.$queryRaw`SELECT 1`;
}
