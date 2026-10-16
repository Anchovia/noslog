"use server";

// 채보 에디터(운영자) 저장 · 버전 · 공개 · 복원 — 본문은 features/music/server/chart-pattern-admin-service.ts(2026-10-16 D8)
import {
    createChartPatternRevision as createRevision,
    createChartPatternVid2bmapRevision as createVid2bmapRevision,
    publishChartPattern as publish,
    restoreChartPatternRevision as restoreRevision,
    saveChartPatternDraft as saveDraft,
} from "@/features/music/server/chart-pattern-admin-service";

export async function saveChartPatternDraft(input: unknown) {
    return saveDraft(input);
}

export async function createChartPatternRevision(input: unknown) {
    return createRevision(input);
}

export async function createChartPatternVid2bmapRevision(input: unknown) {
    return createVid2bmapRevision(input);
}

export async function publishChartPattern(input: unknown) {
    return publish(input);
}

export async function restoreChartPatternRevision(input: unknown) {
    return restoreRevision(input);
}
