import "server-only";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
    type ChartDraftStatus,
    chartRowIdSchema,
    EDITABLE_DRAFT_STATUSES,
    saveUserDraftSchema,
    USER_DRAFT_MAX_OPEN,
    userDraftDocumentSchema,
} from "@/features/contributions/schemas/chart-draft-schema";
import type { ActionResult } from "@/lib/actions/result";
import { hasChartNoteConflicts } from "@/lib/chart-pattern/editor";
import {
    type ChartDocument,
    chartDocumentSchema,
    createDefaultChartDocument,
} from "@/lib/chart-pattern/schema";
import { lockInTransaction } from "@/lib/daily-limit";
import db from "@/lib/db";
import { translatorFor } from "@/lib/i18n/messages";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import { claimUploadTokenQuota } from "@/lib/upload-rate-limit";

export function inputJson(document: ChartDocument) {
    return document as unknown as Prisma.InputJsonValue;
}

function isEditable(status: string) {
    return EDITABLE_DRAFT_STATUSES.includes(status as ChartDraftStatus);
}

export function logDraftError(
    error: unknown,
    event: string,
    routePath: string
) {
    logServerError(error, { event, routePath, routeType: "action" });
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

export function toMyDraft(row: {
    id: number;
    chartId: number;
    status: string;
    version: number;
    content: Prisma.JsonValue;
    baseRevision: number | null;
    submittedAt: Date | null;
    updatedAt: Date;
}): MyChartDraft | null {
    const document = userDraftDocumentSchema.safeParse(row.content);
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

const DRAFT_SAVE_MIN_INTERVAL_MS = 1_000;

export const draftSelect = {
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

/** 지금 고칠 수 있는 내 초안 — 쓰지 않으므로 GET 화면이 부른다. 없거나 공개까지 끝났으면 null(openMyChartDraft 로 연다) */
export async function findMyOpenChartDraft(
    chartId: number
): Promise<MyChartDraft | null> {
    const session = await getSession();
    if (!session.id || !chartRowIdSchema.safeParse(chartId).success)
        return null;
    const draft = await db.chartDraft.findUnique({
        where: { userId_chartId: { userId: session.id, chartId } },
        select: draftSelect,
    });
    return draft && draft.status !== "approved" ? toMyDraft(draft) : null;
}

/**
 * 내 초안을 열거나 새로 만든다. 공개 채보가 있으면 그것을 복사해 시작하고, 없으면 빈 채보.
 * 공개까지 끝난 초안을 다시 열면 지금 공개본으로 새로 시작한다.
 */
export async function openMyChartDraft(
    chartId: number
): Promise<MyChartDraft | "limit" | null> {
    const session = await getSession();
    if (!session.id || !chartRowIdSchema.safeParse(chartId).success)
        return null;
    const chart = await db.musicChart.findUnique({
        where: { id: chartId },
        select: {
            id: true,
            bpmMin: true,
            durationSeconds: true,
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
              bpm: chart.bpmMin ?? 120,
              durationMs: (chart.durationSeconds ?? 0) * 1000,
          });
    const baseRevision = published.success
        ? (chart.pattern?.publishedRevision ?? null)
        : null;

    const existing = await db.chartDraft.findUnique({
        where: { userId_chartId: { userId: session.id, chartId } },
        select: draftSelect,
    });
    if (existing && existing.status !== "approved") return toMyDraft(existing);
    const userId = session.id;
    // 세기와 쓰기 사이를 사람마다 잠가 동시에 연 요청이 한도를 넘지 않게 한다
    const row = await db.$transaction(async (tx) => {
        await lockInTransaction(tx, `chart-draft-open:${userId}`);
        // 잠금을 기다리는 동안 같은 채보를 연 다른 요청이 만들었을 수 있다
        const current = await tx.chartDraft.findUnique({
            where: { userId_chartId: { userId, chartId } },
            select: draftSelect,
        });
        if (current && current.status !== "approved") return current;
        const open = await tx.chartDraft.count({
            where: { userId, status: { not: "approved" } },
        });
        if (open >= USER_DRAFT_MAX_OPEN) return null;
        return current
            ? tx.chartDraft.update({
                  where: { id: current.id },
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
            : tx.chartDraft.create({
                  data: {
                      userId,
                      chartId,
                      content: inputJson(start),
                      baseRevision,
                  },
                  select: draftSelect,
              });
    });
    if (!row) return "limit";
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
            select: { id: true, status: true, updatedAt: true },
        });
        if (!draft || !isEditable(draft.status))
            return { success: false, message: t("contribution.draft.locked") };
        const quota = await claimUploadTokenQuota(session.id, "draft-save");
        if (!quota.allowed)
            return { success: false, message: t("common.tooManyRequests") };
        // 초당 1번으로 막되 거절하지 않고 기다린다 — 검토 요청 직전 저장은 자동 저장 바로 뒤에 올 수 있다. 수를 세지 않으니 행도 늘지 않고, 동시 요청은 아래 버전 조건이 막는다
        const wait = Math.min(
            draft.updatedAt.getTime() + DRAFT_SAVE_MIN_INTERVAL_MS - Date.now(),
            DRAFT_SAVE_MIN_INTERVAL_MS
        );
        if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
        const updated = await db.chartDraft.updateMany({
            // 기다리는 동안 검토 요청 · 삭제가 끝났을 수 있어 상태도 다시 본다
            where: {
                id: draft.id,
                version: baseVersion,
                status: { in: [...EDITABLE_DRAFT_STATUSES] },
            },
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
    if (!chartRowIdSchema.safeParse(chartId).success)
        return { success: false, message: t("contribution.draft.locked") };
    try {
        const draft = await db.chartDraft.findUnique({
            where: { userId_chartId: { userId: session.id, chartId } },
            select: { id: true, status: true, content: true },
        });
        if (!draft || !isEditable(draft.status))
            return { success: false, message: t("contribution.draft.locked") };
        const document = userDraftDocumentSchema.safeParse(draft.content);
        if (!document.success)
            return { success: false, message: t("contribution.draft.invalid") };
        if (
            hasChartNoteConflicts(
                document.data.notes,
                document.data.ticksPerQuarter
            )
        )
            return {
                success: false,
                message: t("contribution.draft.overlap"),
            };
        const pattern = await db.chartPattern.findUnique({
            where: { chartId },
            select: { publishedContent: true },
        });
        const published = chartDocumentSchema.safeParse(
            pattern?.publishedContent
        );
        if (
            published.success &&
            JSON.stringify(published.data) === JSON.stringify(document.data)
        )
            return {
                success: false,
                message: t("contribution.draft.unchanged"),
            };
        const submitted = await db.chartDraft.updateMany({
            where: {
                id: draft.id,
                status: { in: [...EDITABLE_DRAFT_STATUSES] },
            },
            data: { status: "pending", submittedAt: new Date() },
        });
        if (!submitted.count)
            return { success: false, message: t("contribution.draft.locked") };
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
    if (!chartRowIdSchema.safeParse(chartId).success)
        return { success: false, message: t("contribution.draft.locked") };
    const updated = await db.chartDraft.updateMany({
        where: { userId: session.id, chartId, status: "pending" },
        data: { status: "draft", submittedAt: null },
    });
    if (!updated.count)
        return { success: false, message: t("contribution.draft.locked") };
    revalidatePath("/admin/contributions");
    return { success: true, message: t("contribution.draft.withdrawn") };
}

/** 초안 삭제 — 고칠 수 있는 내 초안만. 검토 댓글은 함께 지워진다 */
export async function deleteMyChartDraft(
    draftId: number,
    requestedLocale: string
): Promise<ActionResult> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("contribution.loginRequired") };
    if (!chartRowIdSchema.safeParse(draftId).success)
        return { success: false, message: t("contribution.draft.locked") };
    const deleted = await db.chartDraft.deleteMany({
        where: {
            id: draftId,
            userId: session.id,
            status: { in: [...EDITABLE_DRAFT_STATUSES] },
        },
    });
    if (!deleted.count)
        return { success: false, message: t("contribution.draft.locked") };
    revalidatePath("/admin/contributions");
    return { success: true, message: t("contribution.draft.deleted") };
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
                    musicIdx: true,
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
            musicIndex: row.chart.musicIdx,
            title: row.chart.music.title,
        },
    }));
}
