import "server-only";

import type { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/admin";
import { adminPageArgs } from "@/lib/admin/page";
import db from "@/lib/db";

/** 관리자 검정 목록 한 쪽과 같은 조건의 전체 수 — 단계 수 · 심사 대기 수(2026-10-16 D8 — 화면에서 옮김) */
export async function listAdminExams(where: Prisma.ExamWhereInput, page = 1) {
    await requireAdmin();
    const [exams, totalCount] = await Promise.all([
        db.exam.findMany({
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
            ...adminPageArgs(page),
        }),
        db.exam.count({ where }),
    ]);
    return { exams, totalCount };
}
