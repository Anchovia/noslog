import "server-only";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

/** 관리자 공지 목록 — 최근 100건과 언어별 판(2026-10-16 D8 — 화면에서 옮김) */
export async function listAdminAnnouncements() {
    await requireAdmin();
    return db.announcement.findMany({
        orderBy: [
            { publishedAt: "desc" },
            { createdAt: "desc" },
            { id: "desc" },
        ],
        take: 100,
        include: {
            translations: {
                select: {
                    locale: true,
                    title: true,
                    content: true,
                    modifiedAt: true,
                },
            },
        },
    });
}

/** 편집할 공지 — 언어별 판 포함 */
export async function getAdminAnnouncement(id: number) {
    await requireAdmin();
    return db.announcement.findUnique({
        where: { id },
        include: {
            translations: {
                select: {
                    locale: true,
                    title: true,
                    content: true,
                    bannerUrl: true,
                    modifiedAt: true,
                },
            },
        },
    });
}
