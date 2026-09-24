"use server";

import {
    addChartComment as addChartCommentService,
    deleteMyChartComment as deleteMyChartCommentService,
    getMyChartDraftStatus as getMyChartDraftStatusService,
    hideChartComment as hideChartCommentService,
    listChartComments as listChartCommentsService,
    resolveChartComment as resolveChartCommentService,
    saveMyChartDraft as saveMyChartDraftService,
    submitMyChartDraft as submitMyChartDraftService,
    withdrawMyChartDraft as withdrawMyChartDraftService,
} from "@/features/contributions/server/chartDraftService";

export async function getMyChartDraftStatus(chartId: number) {
    return getMyChartDraftStatusService(chartId);
}

export async function saveMyChartDraft(input: unknown, locale: string) {
    return saveMyChartDraftService(input, locale);
}

export async function submitMyChartDraft(chartId: number, locale: string) {
    return submitMyChartDraftService(chartId, locale);
}

export async function withdrawMyChartDraft(chartId: number, locale: string) {
    return withdrawMyChartDraftService(chartId, locale);
}

export async function listChartComments(query: {
    chartId: number;
    draftId?: number;
}) {
    return listChartCommentsService(query);
}

export async function addChartComment(input: unknown, locale: string) {
    return addChartCommentService(input, locale);
}

export async function deleteMyChartComment(commentId: number, locale: string) {
    return deleteMyChartCommentService(commentId, locale);
}

/** 운영자만 — 서비스가 권한을 확인한다 */
export async function resolveChartComment(commentId: number) {
    return resolveChartCommentService(commentId);
}

export async function hideChartComment(commentId: number) {
    return hideChartCommentService(commentId);
}
