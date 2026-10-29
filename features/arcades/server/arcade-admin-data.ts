import "server-only";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

/** 관리자 오락실 편집 목록 — 공개 페이지가 읽는 기체 · 영업시간 · 공개 정보(2026-10-16 D8 — 화면에서 옮김) */
export async function listAdminArcades() {
    await requireAdmin();
    return db.arcade.findMany({
        include: {
            _count: { select: { users: true } },
            // 공개 페이지가 읽는 기체·영업시간을 그대로 편집한다
            cabinets: {
                where: { isActive: true },
                orderBy: { position: "asc" },
                select: {
                    id: true,
                    label: true,
                    note: true,
                    conditionNote: true,
                    tags: true,
                    keyWeight: true,
                    screenLag: true,
                    soundVolume: true,
                    featureNote: true,
                    availability: true,
                    condition: true,
                    position: true,
                    verifiedAt: true,
                },
            },
            publicDetails: {
                select: {
                    hours: true,
                    administrativeArea: true,
                    addressLines: true,
                    phone: true,
                    website: true,
                    creditLabel: true,
                    facilities: true,
                },
            },
            // 공개 상세 맨 위 사진 — 자리(slot) 순서가 공개 순서
            publicPhotos: {
                orderBy: { slot: "asc" },
                select: { id: true, url: true, alt: true },
            },
        },
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
    });
}
