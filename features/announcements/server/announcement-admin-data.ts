import "server-only";

import { requireAdmin } from "@/lib/admin";
import { adminPageArgs } from "@/lib/admin/page";
import db from "@/lib/db";

const adminAnnouncementInclude = {
    translations: {
        select: {
            locale: true,
            title: true,
            content: true,
            modifiedAt: true,
        },
    },
} as const;
const adminAnnouncementOrder = [
    { publishedAt: "desc" as const },
    { createdAt: "desc" as const },
    { id: "desc" as const },
];

/** 관리자 공지 목록 한 쪽과 전체 수. 홈 노출은 공개 공지 전체로 판정해야 해서 공개 공지도 함께 준다 */
export async function listAdminAnnouncements(page = 1) {
    await requireAdmin();
    const [announcements, totalCount, published] = await Promise.all([
        db.announcement.findMany({
            orderBy: adminAnnouncementOrder,
            ...adminPageArgs(page),
            include: adminAnnouncementInclude,
        }),
        db.announcement.count(),
        db.announcement.findMany({
            where: { isPublished: true },
            orderBy: adminAnnouncementOrder,
            include: adminAnnouncementInclude,
        }),
    ]);
    return { announcements, totalCount, published };
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
