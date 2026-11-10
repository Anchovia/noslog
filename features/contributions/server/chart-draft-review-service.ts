import "server-only";

import type { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";

import type { NameLabel } from "@/features/contributions/contribution-level";
import { CONTRIBUTION_POINTS } from "@/features/contributions/contribution-level";
import {
    type ChartDraftStatus,
    draftReviewSchema,
    userDraftDocumentSchema,
} from "@/features/contributions/schemas/chart-draft-schema";
import {
    draftSelect,
    inputJson,
    logDraftError,
    toMyDraft,
} from "@/features/contributions/server/chart-draft-service";
import {
    getNameLabels,
    refreshContributionViews,
} from "@/features/contributions/server/contribution-point-service";
import { savePatternMetrics } from "@/features/music/server/pattern-metrics";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { contributionRevisionMessage } from "@/lib/chart-pattern/chartSource";
import { hasChartNoteConflicts } from "@/lib/chart-pattern/editor";
import {
    type ChartDocument,
    chartDocumentSchema,
} from "@/lib/chart-pattern/schema";
import db from "@/lib/db";

/** 공개 트랜잭션 안에서 초안이 이미 처리된 것을 알았을 때 — 되돌리고 「대기 중 아님」 으로 답한다 */
class DraftAlreadyReviewedError extends Error {}

export interface AdminChartDraft {
    id: number;
    status: ChartDraftStatus;
    submittedAt: Date | null;
    reviewedAt: Date | null;
    noteCount: number;
    /** 공개본과 다른 노트 수(더하고 뺀 것 합) — 공개본이 없으면 null(새 채보) */
    changedNotes: number | null;
    publishedNoteCount: number | null;
    user: { id: number; username: string | null; label: NameLabel | null };
    chart: {
        id: number;
        difficulty: string;
        level: number;
        musicIndex: string;
        title: string;
    };
    openComments: number;
}

function noteKey(note: ChartDocument["notes"][number]) {
    return `${note.tick}:${note.lane}:${note.width}:${note.type}:${note.hand}:${note.durationTicks}`;
}

/** 공개본 대비 바뀐 노트 수 — 고친 노트는 「빠진 것 + 생긴 것」 한 쌍이라 둘 중 큰 쪽으로 센다 */
function changedNoteCount(next: ChartDocument, base: ChartDocument) {
    const before = new Map<string, number>();
    for (const note of base.notes)
        before.set(noteKey(note), (before.get(noteKey(note)) ?? 0) + 1);
    let added = 0;
    for (const note of next.notes) {
        const key = noteKey(note);
        const count = before.get(key) ?? 0;
        if (count) before.set(key, count - 1);
        else added += 1;
    }
    let removed = 0;
    for (const count of before.values()) removed += count;
    return Math.max(added, removed);
}

export async function listChartDraftsForReview(
    status: "pending" | "changes_requested" | "approved"
): Promise<AdminChartDraft[]> {
    await requireAdmin();
    const rows = await db.chartDraft.findMany({
        where: { status },
        orderBy:
            status === "pending"
                ? { submittedAt: "asc" }
                : { updatedAt: "desc" },
        take: 100,
        select: {
            id: true,
            status: true,
            content: true,
            submittedAt: true,
            reviewedAt: true,
            user: { select: { id: true, username: true } },
            chart: {
                select: {
                    id: true,
                    difficulty: true,
                    level: true,
                    musicIdx: true,
                    music: { select: { title: true } },
                    pattern: { select: { publishedContent: true } },
                },
            },
            _count: {
                select: {
                    comments: { where: { resolved: false, hidden: false } },
                },
            },
        },
    });
    const labels = await getNameLabels(rows.map((row) => row.user.id));
    return rows.flatMap((row) => {
        const document = userDraftDocumentSchema.safeParse(row.content);
        if (!document.success) return [];
        const published = chartDocumentSchema.safeParse(
            row.chart.pattern?.publishedContent
        );
        return [
            {
                id: row.id,
                status: row.status as ChartDraftStatus,
                submittedAt: row.submittedAt,
                reviewedAt: row.reviewedAt,
                noteCount: document.data.notes.length,
                changedNotes: published.success
                    ? changedNoteCount(document.data, published.data)
                    : null,
                publishedNoteCount: published.success
                    ? published.data.notes.length
                    : null,
                user: { ...row.user, label: labels.get(row.user.id) ?? null },
                chart: {
                    id: row.chart.id,
                    difficulty: row.chart.difficulty,
                    level: row.chart.level,
                    musicIndex: row.chart.musicIdx,
                    title: row.chart.music.title,
                },
                openComments: row._count.comments,
            },
        ];
    });
}

/** 운영자 검토용 초안 전체(에디터 검토 모드에 넘긴다) */
export async function getChartDraftForReview(draftId: number) {
    await requireAdmin();
    const row = await db.chartDraft.findUnique({
        where: { id: draftId },
        select: {
            ...draftSelect,
            user: { select: { id: true, username: true } },
        },
    });
    if (!row) return null;
    const draft = toMyDraft(row);
    return draft ? { ...draft, user: row.user } : null;
}

const DRAFT_CHANGED_MESSAGE =
    "검토하는 동안 초안이 바뀌었습니다. 새로고침해 주세요.";

/**
 * 운영자 결정 — 「수정 요청」 은 상태만, 「공개」 는 한 트랜잭션으로:
 * 운영자 에디터에 공개 안 한 변경이 있으면 먼저 이력으로 보관 → 공개본 · 초안을 이 채보로 → 이력 한 줄(kind contribution)
 * → 작성자 기록 → 초안 「공개됨」 → 기여 20점(공개 버전마다 한 번).
 */
export async function reviewChartDraft(
    input: unknown
): Promise<ActionResult<{ publishedRevision?: number }>> {
    const admin = await requireAdmin();
    const parsed = draftReviewSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, message: "검토 요청을 확인해 주세요." };
    const { draftId, version, decision } = parsed.data;
    const draft = await db.chartDraft.findUnique({
        where: { id: draftId },
        select: {
            id: true,
            version: true,
            status: true,
            content: true,
            chartId: true,
            userId: true,
            baseRevision: true,
            user: { select: { username: true } },
            chart: { select: { musicIdx: true, difficulty: true } },
        },
    });
    if (!draft || draft.status !== "pending")
        return { success: false, message: "검토 대기 중인 초안이 아닙니다." };
    if (draft.version !== version)
        return { success: false, message: DRAFT_CHANGED_MESSAGE };
    const now = new Date();

    if (decision === "request_changes") {
        // 대기 중일 때만 — 다른 운영자가 먼저 처리했으면 건너뛴다(2026-10-16 D5)
        const changed = await db.chartDraft.updateMany({
            where: { id: draft.id, status: "pending", version },
            data: {
                status: "changes_requested",
                reviewedAt: now,
                reviewedById: admin.id,
                // 결과를 새로 알린다 — 전에 결과를 봤어도 다시 점이 뜬다(곡 정보 제안과 같게, 2026-10-16)
                authorSeenAt: null,
            },
        });
        if (!changed.count)
            return { success: false, message: DRAFT_CHANGED_MESSAGE };
        revalidatePath("/admin/contributions");
        return { success: true, message: "수정을 요청했습니다." };
    }

    const document = userDraftDocumentSchema.safeParse(draft.content);
    if (!document.success)
        return { success: false, message: "초안 형식이 올바르지 않습니다." };
    if (
        hasChartNoteConflicts(
            document.data.notes,
            document.data.ticksPerQuarter
        )
    )
        return {
            success: false,
            message: "겹치는 노트가 있어 공개할 수 없습니다.",
        };

    try {
        const publishedRevision = await db.$transaction(async (tx) => {
            // 먼저 대기 중인 초안을 차지한다 — 이미 처리됐으면 공개본 · 이력 · 점수를 쓰지 않고 되돌린다(2026-10-16 D5)
            const claimed = await tx.chartDraft.updateMany({
                where: { id: draft.id, status: "pending", version },
                data: {
                    status: "approved",
                    reviewedAt: now,
                    reviewedById: admin.id,
                    publishedAt: now,
                    authorSeenAt: null,
                },
            });
            if (!claimed.count) throw new DraftAlreadyReviewedError();
            const current = await tx.chartPattern.findUnique({
                where: { chartId: draft.chartId },
                select: {
                    id: true,
                    draftContent: true,
                    publishedContent: true,
                    savedRevision: true,
                },
            });
            let nextRevision = (current?.savedRevision ?? 0) + 1;
            // 운영자 초안에 공개 안 한 변경이 있으면 덮기 전에 이력으로 남긴다
            if (
                current &&
                JSON.stringify(current.draftContent) !==
                    JSON.stringify(current.publishedContent)
            ) {
                await tx.chartPatternRevision.create({
                    data: {
                        patternId: current.id,
                        number: nextRevision,
                        kind: "manual",
                        message: "기여 채보 공개 전 자동 보관",
                        content: current.draftContent as Prisma.InputJsonValue,
                        createdById: admin.id,
                    },
                });
                nextRevision += 1;
            }
            const data = {
                formatVersion: document.data.version,
                draftContent: inputJson(document.data),
                publishedContent: inputJson(document.data),
                savedRevision: nextRevision,
                publishedRevision: nextRevision,
                publishedById: admin.id,
                publishedAt: now,
                updatedById: admin.id,
                authorId: draft.userId,
            };
            const pattern = current
                ? await tx.chartPattern.update({
                      where: { id: current.id },
                      data: { ...data, draftVersion: { increment: 1 } },
                      select: { id: true },
                  })
                : await tx.chartPattern.create({
                      data: {
                          ...data,
                          chartId: draft.chartId,
                          draftVersion: 1,
                          createdById: admin.id,
                      },
                      select: { id: true },
                  });
            await tx.chartPatternRevision.create({
                data: {
                    patternId: pattern.id,
                    number: nextRevision,
                    kind: "contribution",
                    // 기준 버전을 남겨 둔다 — 공개 채보 출처(영상 추출 여부)를 줄기로 따진다
                    message: contributionRevisionMessage(
                        draft.id,
                        draft.user.username ?? "이름 없음",
                        draft.baseRevision
                    ),
                    content: inputJson(document.data),
                    createdById: admin.id,
                },
            });
            await savePatternMetrics(
                tx,
                draft.chartId,
                document.data,
                nextRevision
            );
            // 공개 버전마다 한 번 — 같은 트랜잭션에서 적립
            await tx.contributionPoint.createMany({
                data: [
                    {
                        userId: draft.userId,
                        kind: "chart",
                        sourceKey: `${draft.chartId}:${nextRevision}`,
                        points: CONTRIBUTION_POINTS.chart,
                    },
                ],
                skipDuplicates: true,
            });
            return nextRevision;
        });
        refreshContributionViews([draft.userId]);
        updateTag(CACHE_TAGS.musicDetails);
        updateTag(CACHE_TAGS.patternMetrics);
        revalidatePath("/music");
        revalidatePath(
            `/music/${encodeURIComponent(draft.chart.musicIdx)}/${draft.chart.difficulty.toLowerCase()}/pattern`
        );
        revalidatePath("/admin/contributions");
        return {
            success: true,
            message: `공개했습니다(공개 v${publishedRevision}).`,
            publishedRevision,
        };
    } catch (error) {
        if (error instanceof DraftAlreadyReviewedError)
            return {
                success: false,
                message: "검토 대기 중인 초안이 아닙니다.",
            };
        logDraftError(
            error,
            "contribution.draft.publish.failed",
            "/admin/contributions"
        );
        return { success: false, message: "공개하지 못했습니다." };
    }
}
