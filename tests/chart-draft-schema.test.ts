import { describe, expect, it } from "vitest";

import {
    CHART_COMMENT_MAX_LENGTH,
    EDITABLE_DRAFT_STATUSES,
    USER_DRAFT_MAX_NOTES,
    chartCommentInputSchema,
    draftReviewSchema,
    saveUserDraftSchema,
} from "@/features/contributions/schemas/chartDraftSchema";
import { CONTRIBUTION_POINTS } from "@/features/contributions/contributionLevel";
import { createDefaultChartDocument } from "@/lib/chart-pattern/schema";

const document = createDefaultChartDocument({ bpm: 120, durationMs: 60_000 });

describe("유저 채보 초안", () => {
    it("검토 요청 중 · 공개됨은 고칠 수 없다", () => {
        expect(EDITABLE_DRAFT_STATUSES).toEqual(["draft", "changes_requested"]);
    });

    it("정상 초안은 저장 입력으로 받는다", () => {
        expect(
            saveUserDraftSchema.safeParse({
                chartId: 3,
                baseVersion: 0,
                document,
            }).success
        ).toBe(true);
    });

    it("노트 수 · 길이 한도를 넘으면 받지 않는다", () => {
        const note = {
            id: "n",
            type: "standard",
            hand: "left",
            tick: 0,
            durationTicks: 0,
            lane: 0,
            width: 1,
            points: [],
        };
        const tooMany = {
            ...document,
            notes: Array.from(
                { length: USER_DRAFT_MAX_NOTES + 1 },
                (_, index) => ({
                    ...note,
                    id: `n${index}`,
                    tick: index * 10,
                })
            ),
        };
        expect(
            saveUserDraftSchema.safeParse({
                chartId: 3,
                baseVersion: 0,
                document: tooMany,
            }).success
        ).toBe(false);
        expect(
            saveUserDraftSchema.safeParse({
                chartId: 3,
                baseVersion: 0,
                document: { ...document, durationMs: 31 * 60 * 1000 },
            }).success
        ).toBe(false);
    });
});

describe("시각 댓글", () => {
    it("시각 · 본문 길이를 검사하고 앞뒤 공백을 지운다", () => {
        expect(
            chartCommentInputSchema.parse({
                chartId: 3,
                timeMs: 42_300,
                body: "  트릴 방향  ",
            }).body
        ).toBe("트릴 방향");
        expect(
            chartCommentInputSchema.safeParse({
                chartId: 3,
                timeMs: -1,
                body: "a",
            }).success
        ).toBe(false);
        expect(
            chartCommentInputSchema.safeParse({
                chartId: 3,
                timeMs: 0,
                body: "   ",
            }).success
        ).toBe(false);
        expect(
            chartCommentInputSchema.safeParse({
                chartId: 3,
                timeMs: 0,
                body: "가".repeat(CHART_COMMENT_MAX_LENGTH + 1),
            }).success
        ).toBe(false);
    });
});

describe("운영자 결정 · 점수", () => {
    it("결정은 수정 요청 · 공개 둘뿐", () => {
        expect(
            draftReviewSchema.safeParse({ draftId: 1, decision: "publish" })
                .success
        ).toBe(true);
        expect(
            draftReviewSchema.safeParse({ draftId: 1, decision: "reject" })
                .success
        ).toBe(false);
    });

    it("채보 공개 20점 · 해결된 채보 의견 1점", () => {
        expect(CONTRIBUTION_POINTS.chart).toBe(20);
        expect(CONTRIBUTION_POINTS.chart_comment).toBe(1);
    });
});
