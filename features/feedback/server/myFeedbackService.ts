import "server-only";

import db from "@/lib/db";
import getSession from "@/lib/session";

export interface MyFeedbackItem {
    id: number;
    category: string | null;
    arcade: boolean;
    content: string;
    createdAt: string;
    status: "open" | "resolved";
    reply: string | null;
    repliedAt: string | null;
    /** 아직 읽지 않은 답변 */
    unread: boolean;
}

// 내 제보(2026-09-18 F1) — 최근 50건. 불러오면서 새 답변을 읽음으로 바꾼다(헤더 메뉴 · 탭의 점이 사라짐)
export async function listMyFeedback(): Promise<MyFeedbackItem[] | null> {
    const session = await getSession();
    if (!session.id) return null;
    const reports = await db.feedbackReport.findMany({
        where: { userId: session.id },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 50,
        select: {
            id: true,
            category: true,
            arcadeId: true,
            content: true,
            createdAt: true,
            status: true,
            reply: true,
            repliedAt: true,
            replySeenAt: true,
        },
    });
    const unreadIds = reports
        .filter((report) => report.reply && !report.replySeenAt)
        .map((report) => report.id);
    if (unreadIds.length)
        await db.feedbackReport.updateMany({
            where: { id: { in: unreadIds }, userId: session.id },
            data: { replySeenAt: new Date() },
        });
    return reports.map((report) => ({
        id: report.id,
        category: report.category,
        arcade: report.arcadeId !== null,
        content: report.content,
        createdAt: report.createdAt.toISOString(),
        status: report.status === "resolved" ? "resolved" : "open",
        reply: report.reply,
        repliedAt: report.repliedAt?.toISOString() ?? null,
        unread: unreadIds.includes(report.id),
    }));
}

// 헤더 메뉴의 새 답변 점 — 읽지 않은 답변 수
export async function countUnreadFeedbackReplies(userId: number) {
    return db.feedbackReport.count({
        where: { userId, reply: { not: null }, replySeenAt: null },
    });
}
