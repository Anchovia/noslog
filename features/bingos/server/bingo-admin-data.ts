import "server-only";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

/** 관리자 빙고 목록 — 표지 곡 · 칸 수(2026-10-16 D8 — 화면에서 옮김) */
export async function listAdminBingos() {
    await requireAdmin();
    return db.bingo.findMany({
        include: {
            coverMusic: { select: { title: true } },
            _count: { select: { cells: true } },
        },
        orderBy: { updatedAt: "desc" },
    });
}

/** 빙고 편집기의 곡 고르기 목록 */
export async function listBingoMusicOptions() {
    await requireAdmin();
    return db.music.findMany({
        select: { index: true, title: true },
        orderBy: { title: "asc" },
    });
}

/** 편집할 빙고 — 칸은 위치 순 */
export async function getAdminBingo(bingoId: number) {
    await requireAdmin();
    return db.bingo.findUnique({
        where: { id: bingoId },
        include: { cells: { orderBy: { position: "asc" } } },
    });
}
