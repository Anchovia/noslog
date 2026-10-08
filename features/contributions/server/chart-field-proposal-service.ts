import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import {
    CHART_FIELD_PROPOSAL_DAILY_LIMIT,
    CHART_FIELD_PROPOSAL_STATUSES,
    type ChartFieldProposalField,
    chartFieldProposalReviewSchema,
    type ChartFieldProposalStatus,
    chartFieldUpdate,
    chartFieldValue,
    createChartFieldProposalSchema,
    isChartFieldProposalField,
    isChartFieldProposalStatus,
    normalizeProposalValue,
} from "@/features/contributions/schemas/chart-field-proposal-schema";
import {
    contributionAwardQuery,
    refreshContributionViews,
} from "@/features/contributions/server/contribution-point-service";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

const chartValueSelect = {
    id: true,
    difficulty: true,
    bpm_min: true,
    bpm_max: true,
    note_count: true,
    duration_seconds: true,
    released_at: true,
    music_idx: true,
} as const;

function translatorFor(requestedLocale: string) {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    return createTranslator(getMessages(locale));
}

function refreshChart(musicIndex: string, difficulty: string) {
    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath(
        `/music/${encodeURIComponent(musicIndex)}/${difficulty.toLowerCase()}`
    );
}

/**
 * 채보 정보 제안 — 로그인한 누구나. 같은 사람 · 채보 · 칸의 대기 중 제안이 있으면 새 값으로 바꾼다.
 * 지금 값과 같으면 받지 않고, 24시간에 CHART_FIELD_PROPOSAL_DAILY_LIMIT 건까지.
 */
export async function submitChartFieldProposal(
    input: unknown,
    requestedLocale: string
): Promise<ActionResult<{ field: ChartFieldProposalField }>> {
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id) {
        return { success: false, message: t("contribution.loginRequired") };
    }

    const result = createChartFieldProposalSchema(t).safeParse(input);
    if (!result.success) {
        return actionValidationFailure(result.error, {
            message: t("contribution.proposal.checkInput"),
            alwaysIncludeFieldErrors: true,
        });
    }
    const data = result.data;

    try {
        const chart = await db.musicChart.findUnique({
            where: { id: data.chartId },
            select: chartValueSelect,
        });
        if (!chart) {
            return { success: false, message: t("contribution.submitError") };
        }
        const current = chartFieldValue(chart, data.field);
        if (current === data.value) {
            return {
                success: false,
                message: t("contribution.proposal.same"),
                fieldErrors: { value: [t("contribution.proposal.same")] },
            };
        }

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recent = await db.chartFieldProposal.count({
            where: { userId: session.id, createdAt: { gte: since } },
        });
        const existing = await db.chartFieldProposal.findFirst({
            where: {
                userId: session.id,
                chartId: chart.id,
                field: data.field,
                status: "pending",
            },
            select: { id: true },
        });
        if (!existing && recent >= CHART_FIELD_PROPOSAL_DAILY_LIMIT) {
            return {
                success: false,
                message: t("contribution.proposal.dailyLimit"),
            };
        }

        const values = {
            value: data.value,
            previousValue: current,
            evidenceKind: data.evidenceKind,
            evidenceUrl: data.evidenceUrl,
            evidenceNote: data.evidenceNote,
        };
        if (existing) {
            await db.chartFieldProposal.update({
                where: { id: existing.id },
                data: values,
            });
        } else {
            await db.chartFieldProposal.create({
                data: {
                    ...values,
                    userId: session.id,
                    chartId: chart.id,
                    field: data.field,
                },
            });
        }
        revalidatePath("/admin");
        revalidatePath("/admin/contributions");
        return {
            success: true,
            message: t("contribution.proposal.submitted"),
            field: data.field,
        };
    } catch (error) {
        logServerError(error, {
            event: "contribution.proposal.submit.failed",
            routePath: "/music/[index]/[difficulty]",
            routeType: "action",
        });
        return { success: false, message: t("contribution.submitError") };
    }
}

/** 이 채보에서 내가 낸 대기 중 제안(칸 → 제안 값) — 곡 상세 줄의 「검토 중」 표시에 쓴다 */
export async function listMyPendingChartFields(
    chartId: number
): Promise<Partial<Record<ChartFieldProposalField, string>>> {
    const session = await getSession();
    if (!session.id || !Number.isSafeInteger(chartId) || chartId < 1) {
        return {};
    }
    const rows = await db.chartFieldProposal.findMany({
        where: { userId: session.id, chartId, status: "pending" },
        select: { field: true, value: true },
    });
    const pending: Partial<Record<ChartFieldProposalField, string>> = {};
    for (const row of rows) {
        if (isChartFieldProposalField(row.field))
            pending[row.field] = row.value;
    }
    return pending;
}

export interface AdminChartFieldProposal {
    id: number;
    field: ChartFieldProposalField;
    value: string;
    previousValue: string | null;
    currentValue: string | null;
    evidenceKind: string;
    evidenceUrl: string | null;
    evidenceNote: string | null;
    status: string;
    rejectReason: string | null;
    createdAt: Date;
    reviewedAt: Date | null;
    user: { id: number; username: string | null };
    chart: {
        id: number;
        difficulty: string;
        level: number;
        musicIndex: string;
        title: string;
    };
    /** 같은 사람의 지금까지 반영 · 반려 수 — 믿을 만한지 가늠용 */
    authorApplied: number;
    authorRejected: number;
}

export async function listChartFieldProposals(
    status: ChartFieldProposalStatus
): Promise<AdminChartFieldProposal[]> {
    await requireAdmin();
    const rows = await db.chartFieldProposal.findMany({
        where: { status },
        orderBy:
            status === "pending"
                ? { createdAt: "asc" }
                : { reviewedAt: "desc" },
        take: 200,
        include: {
            user: { select: { id: true, username: true } },
            chart: {
                select: {
                    ...chartValueSelect,
                    level: true,
                    music: { select: { title: true } },
                },
            },
        },
    });
    const authorIds = [...new Set(rows.map((row) => row.userId))];
    const counts = authorIds.length
        ? await db.chartFieldProposal.groupBy({
              by: ["userId", "status"],
              where: {
                  userId: { in: authorIds },
                  status: { in: ["applied", "rejected"] },
              },
              _count: { _all: true },
          })
        : [];
    const countOf = (userId: number, which: string) =>
        counts.find((row) => row.userId === userId && row.status === which)
            ?._count._all ?? 0;

    return rows.flatMap((row) =>
        isChartFieldProposalField(row.field)
            ? [
                  {
                      id: row.id,
                      field: row.field,
                      value: row.value,
                      previousValue: row.previousValue,
                      currentValue: chartFieldValue(row.chart, row.field),
                      evidenceKind: row.evidenceKind,
                      evidenceUrl: row.evidenceUrl,
                      evidenceNote: row.evidenceNote,
                      status: row.status,
                      rejectReason: row.rejectReason,
                      createdAt: row.createdAt,
                      reviewedAt: row.reviewedAt,
                      user: row.user,
                      chart: {
                          id: row.chart.id,
                          difficulty: row.chart.difficulty,
                          level: row.chart.level,
                          musicIndex: row.chart.music_idx,
                          title: row.chart.music.title,
                      },
                      authorApplied: countOf(row.userId, "applied"),
                      authorRejected: countOf(row.userId, "rejected"),
                  },
              ]
            : []
    );
}

export async function countPendingChartFieldProposals() {
    return db.chartFieldProposal.count({ where: { status: "pending" } });
}

export interface ChartFieldQueueStatus {
    /** 검토를 기다리는 제안 수(전체) */
    pending: number;
    /** 가장 오래 기다린 제안의 날수 — 대기가 없으면 null */
    oldestDays: number | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 대기 현황(2026-10-01 G1) — 제안 창 안내에 붙는 두 숫자.
 * 운영자가 한 명이라 「언제 처리되나」 를 개인 알림 대신 공개 숫자로 말한다(IMDb · Wikipedia AfC 방식)
 */
export async function getChartFieldQueueStatus(
    now = new Date()
): Promise<ChartFieldQueueStatus> {
    const [pending, oldest] = await Promise.all([
        db.chartFieldProposal.count({ where: { status: "pending" } }),
        db.chartFieldProposal.findFirst({
            where: { status: "pending" },
            orderBy: { createdAt: "asc" },
            select: { createdAt: true },
        }),
    ]);
    return {
        pending,
        oldestDays: oldest
            ? Math.max(
                  0,
                  Math.floor(
                      (now.getTime() - oldest.createdAt.getTime()) / DAY_MS
                  )
              )
            : null,
    };
}

export type MyChartFieldProposalCounts = Record<
    ChartFieldProposalStatus,
    number
>;

/** 내 제안의 상태별 수(2026-10-01 B2) — 본인만. 반려 수까지 세므로 남에게는 주지 않는다 */
export async function countMyChartFieldProposals(): Promise<MyChartFieldProposalCounts> {
    const empty = Object.fromEntries(
        CHART_FIELD_PROPOSAL_STATUSES.map((status) => [status, 0])
    ) as MyChartFieldProposalCounts;
    const session = await getSession();
    if (!session.id) return empty;
    const rows = await db.chartFieldProposal.groupBy({
        by: ["status"],
        where: { userId: session.id },
        _count: { _all: true },
    });
    for (const row of rows) {
        if (isChartFieldProposalStatus(row.status))
            empty[row.status] = row._count._all;
    }
    return empty;
}

/**
 * 운영자 검토 — 반영은 칸 값 변경 + 출처(contribution) 기록 + 제안 「반영됨」 을 한 트랜잭션으로.
 * 반려는 사유 필수. 이미 처리된 제안은 건너뛴다.
 */
export async function reviewChartFieldProposals(
    input: unknown
): Promise<ActionResult<{ processed: number }>> {
    const admin = await requireAdmin();
    const result = chartFieldProposalReviewSchema.safeParse(input);
    if (!result.success) {
        return actionValidationFailure(result.error, {
            message: "반려 사유와 고른 제안을 확인해 주세요.",
        });
    }
    const review = result.data;
    const now = new Date();

    try {
        const proposals = await db.chartFieldProposal.findMany({
            where: { id: { in: review.ids }, status: "pending" },
            include: {
                chart: { select: { difficulty: true, music_idx: true } },
            },
        });

        if (review.decision === "reject") {
            await db.chartFieldProposal.updateMany({
                where: { id: { in: proposals.map((item) => item.id) } },
                data: {
                    status: "rejected",
                    rejectReasonCode: review.reasonCode,
                    rejectReason: review.reason || null,
                    reviewedById: admin.id,
                    reviewedAt: now,
                    // 결과를 새로 알린다 — 전에 본 제안이라도 다시 점이 뜬다
                    seenAt: null,
                },
            });
        } else {
            // 고쳐서 반영(C2)은 한 건만 고를 때 — 여러 건을 한 값으로 덮어쓰지 않는다
            const edited =
                proposals.length === 1 && review.value ? review.value : null;
            for (const proposal of proposals) {
                if (!isChartFieldProposalField(proposal.field)) continue;
                const parsed = edited
                    ? normalizeProposalValue(proposal.field, edited)
                    : proposal.value;
                if (parsed === null) {
                    return {
                        success: false,
                        message: "고친 값을 확인해 주세요.",
                    };
                }
                await db.$transaction([
                    db.musicChart.update({
                        where: { id: proposal.chartId },
                        data: chartFieldUpdate(proposal.field, parsed),
                    }),
                    db.chartFieldSource.create({
                        data: {
                            chartId: proposal.chartId,
                            field: proposal.field,
                            value: parsed,
                            source: "contribution",
                            sourceUrl: proposal.evidenceUrl,
                            note: proposal.evidenceNote,
                            proposalId: proposal.id,
                        },
                    }),
                    db.chartFieldProposal.update({
                        where: { id: proposal.id },
                        data: {
                            status: "applied",
                            appliedValue:
                                parsed === proposal.value ? null : parsed,
                            reviewedById: admin.id,
                            reviewedAt: now,
                            seenAt: null,
                        },
                    }),
                    // 반영 1건 = 기여 1점(같은 제안은 한 번만)
                    contributionAwardQuery([
                        {
                            userId: proposal.userId,
                            kind: "chart_field",
                            sourceKey: String(proposal.id),
                        },
                    ]),
                ]);
            }
            if (proposals.length)
                refreshContributionViews(proposals.map((item) => item.userId));
            for (const chart of new Map(
                proposals.map((item) => [item.chartId, item.chart])
            ).values()) {
                refreshChart(chart.music_idx, chart.difficulty);
            }
        }
        revalidatePath("/admin");
        revalidatePath("/admin/contributions");
        const verb = review.decision === "apply" ? "반영" : "반려";
        return {
            success: true,
            message: `${proposals.length}건을 ${verb}했습니다.`,
            processed: proposals.length,
        };
    } catch (error) {
        logServerError(error, {
            event: "contribution.proposal.review.failed",
            routePath: "/admin/contributions",
            routeType: "action",
        });
        return { success: false, message: "제안을 처리하지 못했습니다." };
    }
}

export interface MyChartFieldProposal {
    id: number;
    field: ChartFieldProposalField;
    value: string;
    previousValue: string | null;
    /** 운영자가 고쳐서 반영한 값(2026-10-01 C2) — 제안 값과 같으면 null */
    appliedValue: string | null;
    status: string;
    /** 정해 둔 반려 사유(2026-10-01 D2) */
    rejectReasonCode: string | null;
    rejectReason: string | null;
    createdAt: string;
    chart: {
        difficulty: string;
        level: number;
        musicIndex: string;
        title: string;
    };
}

/** 내 제안 목록(최근 순) — 본인만. 반려 사유까지 보이므로 남에게는 주지 않는다 */
export async function listMyChartFieldProposals(
    limit: number
): Promise<MyChartFieldProposal[]> {
    const session = await getSession();
    if (!session.id) return [];
    const rows = await db.chartFieldProposal.findMany({
        where: { userId: session.id },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        take: Math.min(Math.max(1, Math.floor(limit)), 100),
        select: {
            id: true,
            field: true,
            value: true,
            previousValue: true,
            status: true,
            appliedValue: true,
            rejectReasonCode: true,
            rejectReason: true,
            createdAt: true,
            chart: {
                select: {
                    difficulty: true,
                    level: true,
                    music_idx: true,
                    music: { select: { title: true } },
                },
            },
        },
    });
    return rows.flatMap((row) =>
        isChartFieldProposalField(row.field)
            ? [
                  {
                      id: row.id,
                      field: row.field,
                      value: row.value,
                      previousValue: row.previousValue,
                      status: row.status,
                      appliedValue: row.appliedValue,
                      rejectReasonCode: row.rejectReasonCode,
                      rejectReason: row.rejectReason,
                      createdAt: row.createdAt.toISOString(),
                      chart: {
                          difficulty: row.chart.difficulty,
                          level: row.chart.level,
                          musicIndex: row.chart.music_idx,
                          title: row.chart.music.title,
                      },
                  },
              ]
            : []
    );
}

/**
 * 아직 보지 않은 처리 결과 수(2026-10-01 A2) — 제안 · 채보 초안 두 가지를 합쳐 「새 결과」 점에 쓴다.
 * 결과를 저장만 하고 알리지 않으면 기여자가 프로필을 다시 열 때까지 모른다(조사 16곳 중 11곳이 결과를 알린다)
 */
export async function countUnseenContributionResults(): Promise<number> {
    const session = await getSession();
    if (!session.id) return 0;
    const [proposals, drafts] = await Promise.all([
        db.chartFieldProposal.count({
            where: {
                userId: session.id,
                status: { in: ["applied", "rejected"] },
                reviewedAt: { not: null },
                seenAt: null,
            },
        }),
        db.chartDraft.count({
            where: {
                userId: session.id,
                status: { in: ["changes_requested", "published"] },
                reviewedAt: { not: null },
                seenAt: null,
            },
        }),
    ]);
    return proposals + drafts;
}

/** 결과를 보았다고 표시 — 「기여」 를 열면 부른다 */
export async function markContributionResultsSeen(now = new Date()) {
    const session = await getSession();
    if (!session.id) return;
    await Promise.all([
        db.chartFieldProposal.updateMany({
            where: {
                userId: session.id,
                status: { in: ["applied", "rejected"] },
                seenAt: null,
            },
            data: { seenAt: now },
        }),
        db.chartDraft.updateMany({
            where: {
                userId: session.id,
                status: { in: ["changes_requested", "published"] },
                seenAt: null,
            },
            data: { seenAt: now },
        }),
    ]);
}
