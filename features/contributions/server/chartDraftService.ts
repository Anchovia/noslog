import "server-only";

import type { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";

import { CONTRIBUTION_POINTS } from "@/features/contributions/contributionLevel";
import {
    CHART_COMMENT_DAILY_LIMIT,
    EDITABLE_DRAFT_STATUSES,
    chartCommentInputSchema,
    draftReviewSchema,
    saveUserDraftSchema,
    type ChartDraftStatus,
} from "@/features/contributions/schemas/chartDraftSchema";
import {
    awardContribution,
    getNameLabels,
    refreshContributionViews,
} from "@/features/contributions/server/contributionPointService";
import type { NameLabel } from "@/features/contributions/contributionLevel";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { contributionRevisionMessage } from "@/lib/chart-pattern/chartSource";
import { findChartNoteConflicts } from "@/lib/chart-pattern/editor";
import {
    chartDocumentSchema,
    createDefaultChartDocument,
    type ChartDocument,
} from "@/lib/chart-pattern/schema";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

function translatorFor(requestedLocale: string) {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    return createTranslator(getMessages(locale));
}

function inputJson(document: ChartDocument) {
    return document as unknown as Prisma.InputJsonValue;
}

function isEditable(status: string) {
    return EDITABLE_DRAFT_STATUSES.includes(status as ChartDraftStatus);
}

function logDraftError(error: unknown, event: string, routePath: string) {
    logServerError(error, { event, routePath, routeType: "action" });
}

async function isAdminUser(userId: number) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    return user?.role === "admin";
}

export interface MyChartDraft {
    id: number;
    chartId: number;
    status: ChartDraftStatus;
    version: number;
    document: ChartDocument;
    baseRevision: number | null;
    submittedAt: string | null;
    updatedAt: string;
}

function toMyDraft(row: {
    id: number;
    chartId: number;
    status: string;
    version: number;
    content: Prisma.JsonValue;
    baseRevision: number | null;
    submittedAt: Date | null;
    updatedAt: Date;
}): MyChartDraft | null {
    const document = chartDocumentSchema.safeParse(row.content);
    if (!document.success) return null;
    return {
        id: row.id,
        chartId: row.chartId,
        status: row.status as ChartDraftStatus,
        version: row.version,
        document: document.data,
        baseRevision: row.baseRevision,
        submittedAt: row.submittedAt?.toISOString() ?? null,
        updatedAt: row.updatedAt.toISOString(),
    };
}

const draftSelect = {
    id: true,
    chartId: true,
    status: true,
    version: true,
    content: true,
    baseRevision: true,
    submittedAt: true,
    updatedAt: true,
} as const;

/** 이 채보에서 내 초안 — 없으면 null(곡 상세 · 뷰어의 「고치기」 · 「내 초안」 상태에 쓴다) */
export async function getMyChartDraftStatus(
    chartId: number
): Promise<{ id: number; status: ChartDraftStatus } | null> {
    const session = await getSession();
    if (!session.id || !Number.isSafeInteger(chartId) || chartId < 1)
        return null;
    const draft = await db.chartDraft.findUnique({
        where: { userId_chartId: { userId: session.id, chartId } },
        select: { id: true, status: true },
    });
    return draft
        ? { id: draft.id, status: draft.status as ChartDraftStatus }
        : null;
}

/**
 * 내 초안을 열거나 새로 만든다. 공개 채보가 있으면 그것을 복사해 시작하고, 없으면 빈 채보.
 * 공개까지 끝난 초안을 다시 열면 지금 공개본으로 새로 시작한다.
 */
export async function openMyChartDraft(
    chartId: number
): Promise<MyChartDraft | null> {
    const session = await getSession();
    if (!session.id) return null;
    const chart = await db.musicChart.findUnique({
        where: { id: chartId },
        select: {
            id: true,
            bpm_min: true,
            duration_seconds: true,
            pattern: {
                select: { publishedContent: true, publishedRevision: true },
            },
        },
    });
    if (!chart) return null;

    const published = chartDocumentSchema.safeParse(
        chart.pattern?.publishedContent
    );
    const start = published.success
        ? published.data
        : createDefaultChartDocument({
              bpm: chart.bpm_min ?? 120,
              durationMs: (chart.duration_seconds ?? 0) * 1000,
          });
    const baseRevision = published.success
        ? (chart.pattern?.publishedRevision ?? null)
        : null;

    const existing = await db.chartDraft.findUnique({
        where: { userId_chartId: { userId: session.id, chartId } },
        select: draftSelect,
    });
    if (existing && existing.status !== "published") return toMyDraft(existing);
    const row = existing
        ? await db.chartDraft.update({
              where: { id: existing.id },
              data: {
                  content: inputJson(start),
                  version: { increment: 1 },
                  status: "draft",
                  baseRevision,
                  submittedAt: null,
                  reviewedAt: null,
                  reviewedById: null,
              },
              select: draftSelect,
          })
        : await db.chartDraft.create({
              data: {
                  userId: session.id,
                  chartId,
                  content: inputJson(start),
                  baseRevision,
              },
              select: draftSelect,
          });
    return toMyDraft(row);
}

/** 자동 저장 결과 — 관리자 에디터 결과처럼 충돌(conflict)을 따로 알린다 */
export interface SaveMyDraftResult {
    success: boolean;
    message: string;
    version?: number;
    conflict?: boolean;
}

/** 자동 저장 — 고칠 수 있는 상태에서만, 버전이 맞을 때만(다른 탭에서 고쳤으면 충돌) */
export async function saveMyChartDraft(
    input: unknown,
    requestedLocale: string
): Promise<SaveMyDraftResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    const parsed = saveUserDraftSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, message: t("contribution.draft.invalid") };
    const { chartId, baseVersion, document } = parsed.data;
    try {
        const draft = await db.chartDraft.findUnique({
            where: { userId_chartId: { userId: session.id, chartId } },
            select: { id: true, status: true },
        });
        if (!draft || !isEditable(draft.status))
            return { success: false, message: t("contribution.draft.locked") };
        const updated = await db.chartDraft.updateMany({
            where: { id: draft.id, version: baseVersion },
            data: { content: inputJson(document), version: { increment: 1 } },
        });
        if (updated.count !== 1)
            return {
                success: false,
                message: t("contribution.draft.conflict"),
                conflict: true,
            };
        return {
            success: true,
            message: t("contribution.draft.saved"),
            version: baseVersion + 1,
        };
    } catch (error) {
        logDraftError(
            error,
            "contribution.draft.save.failed",
            "/music/pattern/draft"
        );
        return { success: false, message: t("contribution.submitError") };
    }
}

/** 검토 요청 — 겹치는 노트가 없어야 한다. 요청 뒤에는 잠긴다 */
export async function submitMyChartDraft(
    chartId: number,
    requestedLocale: string
): Promise<ActionResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    try {
        const draft = await db.chartDraft.findUnique({
            where: { userId_chartId: { userId: session.id, chartId } },
            select: { id: true, status: true, content: true },
        });
        if (!draft || !isEditable(draft.status))
            return { success: false, message: t("contribution.draft.locked") };
        const document = chartDocumentSchema.safeParse(draft.content);
        if (!document.success)
            return { success: false, message: t("contribution.draft.invalid") };
        if (
            findChartNoteConflicts(
                document.data.notes,
                document.data.ticksPerQuarter
            ).length
        )
            return {
                success: false,
                message: t("contribution.draft.overlap"),
            };
        await db.chartDraft.update({
            where: { id: draft.id },
            data: { status: "submitted", submittedAt: new Date() },
        });
        revalidatePath("/admin");
        revalidatePath("/admin/contributions");
        return { success: true, message: t("contribution.draft.submitted") };
    } catch (error) {
        logDraftError(
            error,
            "contribution.draft.submit.failed",
            "/music/pattern/draft"
        );
        return { success: false, message: t("contribution.submitError") };
    }
}

/** 검토 요청 취소 — 다시 고칠 수 있게 */
export async function withdrawMyChartDraft(
    chartId: number,
    requestedLocale: string
): Promise<ActionResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    const updated = await db.chartDraft.updateMany({
        where: { userId: session.id, chartId, status: "submitted" },
        data: { status: "draft", submittedAt: null },
    });
    if (!updated.count)
        return { success: false, message: t("contribution.draft.locked") };
    revalidatePath("/admin/contributions");
    return { success: true, message: t("contribution.draft.withdrawn") };
}

export interface ChartCommentItem {
    id: number;
    timeMs: number;
    body: string;
    resolved: boolean;
    createdAt: string;
    own: boolean;
    user: { id: number; username: string | null; label: NameLabel | null };
}

/**
 * 시각 댓글 목록 — draftId 가 있으면 그 초안의 작성자와 운영자만, 없으면 공개 채보 댓글(누구나).
 * 운영자가 가린 댓글은 빠진다. 시각 순.
 */
export async function listChartComments(query: {
    chartId: number;
    draftId?: number;
}): Promise<ChartCommentItem[] | null> {
    const session = await getSession();
    if (query.draftId) {
        if (!session.id) return null;
        const draft = await db.chartDraft.findUnique({
            where: { id: query.draftId },
            select: { userId: true, chartId: true },
        });
        if (
            !draft ||
            draft.chartId !== query.chartId ||
            (draft.userId !== session.id && !(await isAdminUser(session.id)))
        )
            return null;
    }
    const rows = await db.chartComment.findMany({
        where: {
            chartId: query.chartId,
            draftId: query.draftId ?? null,
            hidden: false,
        },
        orderBy: [{ timeMs: "asc" }, { id: "asc" }],
        take: 300,
        select: {
            id: true,
            timeMs: true,
            body: true,
            resolved: true,
            createdAt: true,
            user: { select: { id: true, username: true } },
        },
    });
    const labels = await getNameLabels(rows.map((row) => row.user.id));
    return rows.map((row) => ({
        id: row.id,
        timeMs: row.timeMs,
        body: row.body,
        resolved: row.resolved,
        createdAt: row.createdAt.toISOString(),
        own: row.user.id === session.id,
        user: { ...row.user, label: labels.get(row.user.id) ?? null },
    }));
}

/** 시각 댓글 쓰기 — 초안 댓글은 작성자 · 운영자만, 공개 채보 댓글은 로그인한 누구나(하루 한도) */
export async function addChartComment(
    input: unknown,
    requestedLocale: string
): Promise<ActionResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    const parsed = chartCommentInputSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, message: t("contribution.comment.invalid") };
    const { chartId, draftId, timeMs, body } = parsed.data;
    try {
        if (draftId) {
            const draft = await db.chartDraft.findUnique({
                where: { id: draftId },
                select: { userId: true, chartId: true },
            });
            if (
                !draft ||
                draft.chartId !== chartId ||
                (draft.userId !== session.id &&
                    !(await isAdminUser(session.id)))
            )
                return {
                    success: false,
                    message: t("contribution.comment.invalid"),
                };
        } else {
            const pattern = await db.chartPattern.findUnique({
                where: { chartId },
                select: { publishedRevision: true },
            });
            if (!pattern?.publishedRevision)
                return {
                    success: false,
                    message: t("contribution.comment.invalid"),
                };
            const recent = await db.chartComment.count({
                where: {
                    userId: session.id,
                    createdAt: { gte: new Date(Date.now() - 86_400_000) },
                },
            });
            if (recent >= CHART_COMMENT_DAILY_LIMIT)
                return {
                    success: false,
                    message: t("contribution.proposal.dailyLimit"),
                };
        }
        await db.chartComment.create({
            data: {
                chartId,
                draftId: draftId ?? null,
                userId: session.id,
                timeMs,
                body,
            },
        });
        return { success: true, message: t("contribution.comment.added") };
    } catch (error) {
        logDraftError(
            error,
            "contribution.comment.add.failed",
            "/music/pattern"
        );
        return { success: false, message: t("contribution.submitError") };
    }
}

/** 내 댓글 지우기 — 해결되기 전까지만 */
export async function deleteMyChartComment(
    commentId: number,
    requestedLocale: string
): Promise<ActionResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    const deleted = await db.chartComment.deleteMany({
        where: { id: commentId, userId: session.id, resolved: false },
    });
    return deleted.count
        ? { success: true, message: t("contribution.comment.deleted") }
        : { success: false, message: t("contribution.submitError") };
}

// ─── 운영자 ───────────────────────────────────────────────

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
export function changedNoteCount(next: ChartDocument, base: ChartDocument) {
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
    status: "submitted" | "changes_requested" | "published"
): Promise<AdminChartDraft[]> {
    await requireAdmin();
    const rows = await db.chartDraft.findMany({
        where: { status },
        orderBy:
            status === "submitted"
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
                    music_idx: true,
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
        const document = chartDocumentSchema.safeParse(row.content);
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
                    musicIndex: row.chart.music_idx,
                    title: row.chart.music.title,
                },
                openComments: row._count.comments,
            },
        ];
    });
}

export async function countSubmittedChartDrafts() {
    return db.chartDraft.count({ where: { status: "submitted" } });
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
    const { draftId, decision } = parsed.data;
    const draft = await db.chartDraft.findUnique({
        where: { id: draftId },
        select: {
            id: true,
            status: true,
            content: true,
            chartId: true,
            userId: true,
            baseRevision: true,
            user: { select: { username: true } },
            chart: { select: { music_idx: true, difficulty: true } },
        },
    });
    if (!draft || draft.status !== "submitted")
        return { success: false, message: "검토 대기 중인 초안이 아닙니다." };
    const now = new Date();

    if (decision === "request_changes") {
        await db.chartDraft.update({
            where: { id: draft.id },
            data: {
                status: "changes_requested",
                reviewedAt: now,
                reviewedById: admin.id,
            },
        });
        revalidatePath("/admin/contributions");
        return { success: true, message: "수정을 요청했습니다." };
    }

    const document = chartDocumentSchema.safeParse(draft.content);
    if (!document.success)
        return { success: false, message: "초안 형식이 올바르지 않습니다." };
    if (
        findChartNoteConflicts(
            document.data.notes,
            document.data.ticksPerQuarter
        ).length
    )
        return {
            success: false,
            message: "겹치는 노트가 있어 공개할 수 없습니다.",
        };

    try {
        const publishedRevision = await db.$transaction(async (tx) => {
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
            await tx.chartDraft.update({
                where: { id: draft.id },
                data: {
                    status: "published",
                    reviewedAt: now,
                    reviewedById: admin.id,
                    publishedAt: now,
                },
            });
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
        revalidatePath("/music");
        revalidatePath(
            `/music/${encodeURIComponent(draft.chart.music_idx)}/${draft.chart.difficulty.toLowerCase()}/pattern`
        );
        revalidatePath("/admin/contributions");
        return {
            success: true,
            message: `공개했습니다(공개 v${publishedRevision}).`,
            publishedRevision,
        };
    } catch (error) {
        logDraftError(
            error,
            "contribution.draft.publish.failed",
            "/admin/contributions"
        );
        return { success: false, message: "공개하지 못했습니다." };
    }
}

/** 댓글 「해결」 — 운영자만. 공개 채보 댓글을 운영자가 아닌 사람이 썼으면 기여 1점 */
export async function resolveChartComment(
    commentId: number
): Promise<ActionResult> {
    const admin = await requireAdmin();
    const comment = await db.chartComment.findUnique({
        where: { id: commentId },
        select: {
            id: true,
            resolved: true,
            draftId: true,
            userId: true,
            user: { select: { role: true } },
        },
    });
    if (!comment || comment.resolved)
        return { success: false, message: "해결할 댓글이 아닙니다." };
    await db.chartComment.update({
        where: { id: comment.id },
        data: {
            resolved: true,
            resolvedAt: new Date(),
            resolvedById: admin.id,
        },
    });
    if (comment.draftId === null && comment.user.role !== "admin") {
        await awardContribution({
            userId: comment.userId,
            kind: "chart_comment",
            sourceKey: String(comment.id),
            points: CONTRIBUTION_POINTS.chart_comment,
        });
    }
    return { success: true, message: "해결로 표시했습니다." };
}

/** 댓글 가리기 — 운영자만(장난 · 신고 대응). 목록에서 빠진다 */
export async function hideChartComment(
    commentId: number
): Promise<ActionResult> {
    await requireAdmin();
    const updated = await db.chartComment.updateMany({
        where: { id: commentId },
        data: { hidden: true },
    });
    return updated.count
        ? { success: true, message: "댓글을 가렸습니다." }
        : { success: false, message: "댓글을 찾을 수 없습니다." };
}

export interface MyChartDraftItem {
    id: number;
    status: ChartDraftStatus;
    updatedAt: string;
    publishedAt: string | null;
    openComments: number;
    chart: {
        difficulty: string;
        level: number;
        musicIndex: string;
        title: string;
    };
}

/** 내 채보 초안 목록(최근 순) — 본인만. 프로필 「내 제안」 에 곡 정보 제안과 함께 보인다 */
export async function listMyChartDrafts(
    limit: number
): Promise<MyChartDraftItem[]> {
    const session = await getSession();
    if (!session.id) return [];
    const rows = await db.chartDraft.findMany({
        where: { userId: session.id },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        take: Math.min(Math.max(1, Math.floor(limit)), 100),
        select: {
            id: true,
            status: true,
            updatedAt: true,
            publishedAt: true,
            chart: {
                select: {
                    difficulty: true,
                    level: true,
                    music_idx: true,
                    music: { select: { title: true } },
                },
            },
            _count: {
                select: {
                    comments: { where: { resolved: false, hidden: false } },
                },
            },
        },
    });
    return rows.map((row) => ({
        id: row.id,
        status: row.status as ChartDraftStatus,
        updatedAt: row.updatedAt.toISOString(),
        publishedAt: row.publishedAt?.toISOString() ?? null,
        openComments: row._count.comments,
        chart: {
            difficulty: row.chart.difficulty,
            level: row.chart.level,
            musicIndex: row.chart.music_idx,
            title: row.chart.music.title,
        },
    }));
}
