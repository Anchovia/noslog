import "server-only";

import db from "@/lib/db";

/** 관리자만 보는 비공개 이미지(제보 첨부 · 검정 인증)의 저장 주소(2026-10-16 D8 — 라우트에서 옮김) */
export async function getPrivateImageUrl(
    kind: "feedback" | "exam",
    id: number
) {
    if (kind === "feedback") {
        const report = await db.feedbackReport.findUnique({
            where: { id },
            select: { imageUrl: true },
        });
        return report?.imageUrl ?? null;
    }
    const submission = await db.examSubmission.findUnique({
        where: { id },
        select: { proofImageUrl: true },
    });
    return submission?.proofImageUrl ?? null;
}
