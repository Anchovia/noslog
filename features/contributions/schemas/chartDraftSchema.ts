import { z } from "zod";

import { chartDocumentSchema } from "@/lib/chart-pattern/schema";

/** 유저 초안 상태(2026-09-24 3단계) */
export const CHART_DRAFT_STATUSES = [
    "draft",
    "submitted",
    "changes_requested",
    "published",
] as const;
export type ChartDraftStatus = (typeof CHART_DRAFT_STATUSES)[number];

/** 작성자가 고칠 수 있는 상태 — 검토 요청 중에는 잠근다(요청 취소로 풀림) */
export const EDITABLE_DRAFT_STATUSES: readonly ChartDraftStatus[] = [
    "draft",
    "changes_requested",
];

/** 유저 초안 크기 한도 — 관리자 에디터 스키마(노트 10만)보다 좁게 둔다 */
export const USER_DRAFT_MAX_NOTES = 20_000;
export const USER_DRAFT_MAX_TIMING_POINTS = 1_000;
export const USER_DRAFT_MAX_DURATION_MS = 30 * 60 * 1000;

export const CHART_COMMENT_MAX_LENGTH = 500;
/** 한 사람이 24시간에 남길 수 있는 공개 채보 댓글 수 — 장난 방지 */
export const CHART_COMMENT_DAILY_LIMIT = 50;

export const userDraftDocumentSchema = chartDocumentSchema.superRefine(
    (document, ctx) => {
        if (document.notes.length > USER_DRAFT_MAX_NOTES)
            ctx.addIssue({
                code: "custom",
                path: ["notes"],
                message: "too many notes",
            });
        if (document.timingPoints.length > USER_DRAFT_MAX_TIMING_POINTS)
            ctx.addIssue({
                code: "custom",
                path: ["timingPoints"],
                message: "too many timing points",
            });
        if (document.durationMs > USER_DRAFT_MAX_DURATION_MS)
            ctx.addIssue({
                code: "custom",
                path: ["durationMs"],
                message: "too long",
            });
    }
);

export const saveUserDraftSchema = z.object({
    chartId: z.number().int().positive(),
    baseVersion: z.number().int().nonnegative(),
    document: userDraftDocumentSchema,
});

export const chartCommentInputSchema = z.object({
    chartId: z.number().int().positive(),
    /** 있으면 초안 검토 댓글(작성자 · 운영자만), 없으면 공개 채보 댓글 */
    draftId: z.number().int().positive().optional(),
    timeMs: z.number().int().min(0).max(USER_DRAFT_MAX_DURATION_MS),
    body: z.string().trim().min(1).max(CHART_COMMENT_MAX_LENGTH),
});
export type ChartCommentInput = z.infer<typeof chartCommentInputSchema>;

export const draftReviewSchema = z.object({
    draftId: z.number().int().positive(),
    decision: z.enum(["request_changes", "publish"]),
});
