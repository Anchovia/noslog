import "server-only";

import { invalidateEvents } from "@/features/events/server/eventService";
import {
    eventReviewSchema,
    reviewUpdate,
    type EventStatus,
} from "@/features/events/schemas/eventSchema";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

export const ADMIN_EVENT_TABS = [
    "PENDING",
    "CHANGES_REQUESTED",
    "PUBLISHED",
    "REJECTED",
] as const satisfies readonly EventStatus[];

export async function getAdminEventList(status: EventStatus) {
    await requireAdmin();
    const [items, counts] = await Promise.all([
        db.communityEvent.findMany({
            where: { status },
            orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
            take: 100,
            select: {
                id: true,
                title: true,
                startsAt: true,
                endsAt: true,
                submittedAt: true,
                updatedAt: true,
                publishedAt: true,
                author: { select: { id: true, username: true } },
            },
        }),
        db.communityEvent.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    return {
        items,
        counts: Object.fromEntries(
            counts.map((row) => [row.status, row._count._all])
        ) as Partial<Record<EventStatus, number>>,
    };
}

export async function getAdminEvent(id: number) {
    await requireAdmin();
    return db.communityEvent.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, username: true } },
            reviewer: { select: { username: true } },
        },
    });
}

// 승인 · 수정 요청 · 반려. 검토 대기인 글만 받는다(다른 관리자가 먼저 처리했으면 거절)
export async function reviewEvent(
    formData: FormData
): Promise<ActionResult<Record<never, never>, "decision" | "note">> {
    const admin = await requireAdmin();
    const parsed = eventReviewSchema.safeParse({
        id: formData.get("id"),
        decision: formData.get("decision"),
        note: String(formData.get("note") ?? ""),
    });
    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            message:
                fieldErrors.note?.[0] ??
                fieldErrors.decision?.[0] ??
                "입력을 확인해 주세요.",
            fieldErrors: {
                decision: fieldErrors.decision,
                note: fieldErrors.note,
            },
        };
    }
    const event = await db.communityEvent.findUnique({
        where: { id: parsed.data.id },
        select: {
            status: true,
            title: true,
            content: true,
            startsAt: true,
            endsAt: true,
            bannerUrl: true,
            publishedAt: true,
            publishedBannerUrl: true,
        },
    });
    if (!event) return { success: false, message: "글을 찾을 수 없습니다." };
    if (event.status !== "PENDING")
        return {
            success: false,
            message: "검토 대기인 글만 처리할 수 있습니다. 새로고침해 주세요.",
        };
    try {
        const update = reviewUpdate(
            parsed.data.decision,
            event,
            parsed.data.note,
            admin.id,
            new Date(),
            event.publishedAt
        );
        const changed = await db.communityEvent.updateMany({
            where: { id: parsed.data.id, status: "PENDING" },
            data: update,
        });
        if (!changed.count)
            return {
                success: false,
                message:
                    "검토 대기인 글만 처리할 수 있습니다. 새로고침해 주세요.",
            };
        invalidateEvents();
        return {
            success: true,
            message:
                parsed.data.decision === "approve"
                    ? "승인했습니다."
                    : parsed.data.decision === "requestChanges"
                      ? "수정을 요청했습니다."
                      : "반려했습니다.",
        };
    } catch (error) {
        logServerError(error, {
            event: "events.review.failed",
            routePath: "/admin/events",
            routeType: "action",
        });
        return { success: false, message: "검토 결과를 저장하지 못했습니다." };
    }
}
