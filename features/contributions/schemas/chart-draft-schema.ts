import { z } from "zod";

import { chartDocumentSchema } from "@/lib/chart-pattern/schema";

/** 유저 초안 상태(2026-09-24 3단계) */
export const CHART_DRAFT_STATUSES = [
    "draft",
    "pending",
    "changes_requested",
    "approved",
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
/** 노트 끝 틱 한도 — 악보 길이가 이 틱에 비례한다 */
export const USER_DRAFT_MAX_END_TICK = 10_000_000;
/** 트릴 · 글리산도 길이 합 한도 — 뷰어 · 에디터가 그리는 구간 수가 이 합에 비례한다 */
export const USER_DRAFT_MAX_PATTERN_TICKS = 2_000_000;
/** 경로 제어점 합 한도 — 겹침 검사는 같은 틱에 몰린 제어점을 쌍으로 비교한다 */
export const USER_DRAFT_MAX_PATH_POINTS = 2_000;

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
        let patternTicks = 0;
        let pathPoints = 0;
        for (const note of document.notes) {
            if (note.type === "trill" || note.type === "glissando")
                patternTicks += note.durationTicks;
            pathPoints += note.points.length;
        }
        if (
            document.notes.some(
                (note) =>
                    note.tick + note.durationTicks > USER_DRAFT_MAX_END_TICK
            ) ||
            patternTicks > USER_DRAFT_MAX_PATTERN_TICKS ||
            pathPoints > USER_DRAFT_MAX_PATH_POINTS
        )
            ctx.addIssue({
                code: "custom",
                path: ["notes"],
                message: "notes too long",
            });
    }
);

export const saveUserDraftSchema = z.object({
    chartId: z.number().int().positive(),
    baseVersion: z.number().int().nonnegative(),
    document: userDraftDocumentSchema,
});

/** 채보 의견 종류(2026-10-01 H2) — osu! beatmap discussion 의 Problem · Suggestion · Praise */
export const CHART_COMMENT_KINDS = ["problem", "suggestion", "praise"] as const;
export type ChartCommentKind = (typeof CHART_COMMENT_KINDS)[number];

export function isChartCommentKind(value: string): value is ChartCommentKind {
    return (CHART_COMMENT_KINDS as readonly string[]).includes(value);
}

export const chartCommentInputSchema = z.object({
    chartId: z.number().int().positive(),
    /** 있으면 초안 검토 댓글(작성자 · 운영자만), 없으면 공개 채보 댓글 */
    draftId: z.number().int().positive().optional(),
    timeMs: z.number().int().min(0).max(USER_DRAFT_MAX_DURATION_MS),
    body: z.string().trim().min(1).max(CHART_COMMENT_MAX_LENGTH),
    kind: z.enum(CHART_COMMENT_KINDS).default("problem"),
});
export type ChartCommentInput = z.infer<typeof chartCommentInputSchema>;

/** 서버 액션 인자는 타입 표시와 달리 아무 값이나 올 수 있다 */
export const chartRowIdSchema = z.number().int().positive();

export const chartCommentListQuerySchema = z.object({
    chartId: z.number().int().positive(),
    draftId: z.number().int().positive().optional(),
});

export const draftReviewSchema = z.object({
    draftId: z.number().int().positive(),
    // 운영자가 본 판 — 그사이 작성자가 회수 · 수정 · 다시 요청했으면 처리하지 않는다
    version: z.number().int().nonnegative(),
    decision: z.enum(["request_changes", "publish"]),
});
