import "server-only";

import type { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

/** 관리자 검정 목록 — 단계 수 · 심사 대기 수(2026-10-16 D8 — 화면에서 옮김) */
export async function listAdminExams(where: Prisma.ExamWhereInput) {
    await requireAdmin();
    return db.exam.findMany({
        where,
        select: {
            id: true,
            title: true,
            slug: true,
            mode: true,
            grade: true,
            status: true,
            updatedAt: true,
            _count: {
                select: {
                    stages: true,
                    submissions: { where: { status: "pending" } },
                },
            },
        },
        orderBy: [{ mode: "asc" }, { grade: "desc" }, { id: "desc" }],
    });
}
