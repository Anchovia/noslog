import { describe, expect, it } from "vitest";

import {
    CHART_COMMENT_MAX_LENGTH,
    EDITABLE_DRAFT_STATUSES,
    USER_DRAFT_MAX_END_TICK,
    USER_DRAFT_MAX_NOTES,
    USER_DRAFT_MAX_PATH_POINTS,
    USER_DRAFT_MAX_PATTERN_TICKS,
    chartCommentInputSchema,
    chartCommentListQuerySchema,
    chartRowIdSchema,
    draftReviewSchema,
    saveUserDraftSchema,
    userDraftDocumentSchema,
} from "@/features/contributions/schemas/chart-draft-schema";
import { CONTRIBUTION_POINTS } from "@/features/contributions/contribution-level";
import { countChartMeasures } from "@/lib/chart-pattern/timing";
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

describe("유저 초안 타이밍 순서", () => {
    const withTimes = (first: number, second: number) =>
        saveUserDraftSchema.safeParse({
            chartId: 3,
            baseVersion: 0,
            document: {
                ...document,
                timingPoints: [
                    { ...document.timingPoints[0], timeMs: first },
                    {
                        ...document.timingPoints[0],
                        id: "second",
                        tick: 1_920,
                        timeMs: second,
                    },
                ],
            },
        }).success;

    it("틱 계산값과 어긋난 시각은 받는다", () => {
        expect(withTimes(0, 2_060.629)).toBe(true);
    });

    it("틱 순서로 시각이 거꾸로 가면 받지 않는다", () => {
        expect(withTimes(5_000, 1_000)).toBe(false);
    });
});

describe("유저 초안 틱 한도", () => {
    const trill = (id: string, tick: number, durationTicks: number) => ({
        id,
        type: "trill",
        hand: "left",
        tick,
        durationTicks,
        lane: 0,
        width: 1,
        pairLane: 1,
        pairWidth: 1,
        points: [],
    });
    const accepts = (notes: unknown[]) =>
        saveUserDraftSchema.safeParse({
            chartId: 3,
            baseVersion: 0,
            document: { ...document, notes },
        }).success;

    it("노트 끝 틱 한도를 넘으면 받지 않는다", () => {
        const standard = {
            id: "s",
            type: "standard",
            hand: "left",
            durationTicks: 0,
            lane: 0,
            width: 1,
            points: [],
        };
        // 4/4 로는 이 틱이 마디 한도에 먼저 닿으므로 틱 한도만 보도록 마디를 늘린다
        const longMeasures = document.timingPoints.map((point) => ({
            ...point,
            numerator: 8,
        }));
        const acceptsTick = (tick: number) =>
            userDraftDocumentSchema.safeParse({
                ...document,
                timingPoints: longMeasures,
                notes: [{ ...standard, tick }],
            }).success;
        expect(acceptsTick(USER_DRAFT_MAX_END_TICK)).toBe(true);
        expect(acceptsTick(USER_DRAFT_MAX_END_TICK + 1)).toBe(false);
    });

    it("트릴 · 글리산도 길이 합 한도를 넘으면 받지 않는다", () => {
        const half = USER_DRAFT_MAX_PATTERN_TICKS / 2;
        expect(accepts([trill("a", 0, half), trill("b", half, half)])).toBe(
            true
        );
        expect(accepts([trill("a", 0, half), trill("b", half, half + 1)])).toBe(
            false
        );
    });

    it("경로 제어점 합 한도를 넘으면 받지 않는다", () => {
        const glissando = (points: number) => ({
            id: "g",
            type: "glissando",
            hand: "left",
            tick: 0,
            durationTicks: 480,
            lane: 0,
            width: 1,
            points: Array.from({ length: points }, () => ({
                tickOffset: 240,
                lane: 1,
                width: 1,
            })),
        });
        expect(accepts([glissando(USER_DRAFT_MAX_PATH_POINTS)])).toBe(true);
        expect(accepts([glissando(USER_DRAFT_MAX_PATH_POINTS + 1)])).toBe(
            false
        );
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

    it("액션의 행 id 인자에 Prisma 조건 객체를 받지 않는다", () => {
        expect(chartRowIdSchema.safeParse(3).success).toBe(true);
        expect(chartRowIdSchema.safeParse({ gt: 0 }).success).toBe(false);
    });

    it("목록 조회 인자에 Prisma 조건 객체를 받지 않는다", () => {
        expect(
            chartCommentListQuerySchema.safeParse({ chartId: 3 }).success
        ).toBe(true);
        expect(
            chartCommentListQuerySchema.safeParse({ chartId: { gt: 0 } })
                .success
        ).toBe(false);
        expect(
            chartCommentListQuerySchema.safeParse({
                chartId: 3,
                draftId: { not: 0 },
            }).success
        ).toBe(false);
    });
});

describe("운영자 결정 · 점수", () => {
    it("결정은 수정 요청 · 공개 둘뿐", () => {
        expect(
            draftReviewSchema.safeParse({
                draftId: 1,
                version: 3,
                decision: "publish",
            }).success
        ).toBe(true);
        expect(
            draftReviewSchema.safeParse({
                draftId: 1,
                version: 3,
                decision: "reject",
            }).success
        ).toBe(false);
    });

    it("결정은 운영자가 본 초안 판을 함께 보낸다", () => {
        expect(
            draftReviewSchema.safeParse({ draftId: 1, decision: "publish" })
                .success
        ).toBe(false);
    });

    it("채보 공개 20점 · 해결된 채보 의견 1점", () => {
        expect(CONTRIBUTION_POINTS.chart).toBe(20);
        expect(CONTRIBUTION_POINTS.chart_comment).toBe(1);
    });
});

describe("유저 초안 마디 수 한도", () => {
    const point = (id: string, tick: number, timeMs: number) => ({
        id,
        tick,
        timeMs,
        bpm: 1000,
        numerator: 1,
        denominator: 32 as const,
    });
    const note = (tick: number) => ({
        id: "note",
        type: "standard" as const,
        hand: "left" as const,
        tick,
        durationTicks: 0,
        lane: 0,
        width: 1,
        points: [],
    });

    it("타이밍 값으로 마디를 부풀린 초안을 거절한다", () => {
        const document = {
            ...createDefaultChartDocument({ bpm: 120, durationMs: 0 }),
            timingPoints: [point("a", 0, 0), point("b", 5_000_000, 86_400_000)],
            notes: [note(5_000_000)],
        };
        expect(countChartMeasures(document)).toBeGreaterThanOrEqual(11_520_000);
        expect(userDraftDocumentSchema.safeParse(document).success).toBe(false);
    });

    it("느린 구간의 노트로 곡 끝을 늘린 초안도 거절한다", () => {
        const document = {
            ...createDefaultChartDocument({ bpm: 120, durationMs: 0 }),
            timingPoints: [
                { ...point("a", 0, 0), bpm: 1 },
                point("b", 9_000_000, 1),
            ],
            notes: [note(8_999_999), note(9_000_001)],
        };
        expect(countChartMeasures(document)).toBeGreaterThan(5_000);
        expect(userDraftDocumentSchema.safeParse(document).success).toBe(false);
    });

    it("내용 끝 뒤 패널 연장 구간의 빠른 마디도 센다", () => {
        const document = {
            ...createDefaultChartDocument({ bpm: 120, durationMs: 1_000 }),
            timingPoints: [
                {
                    ...point("a", 0, 0),
                    bpm: 1,
                    numerator: 64,
                    denominator: 1 as const,
                },
                {
                    ...point("b", 16, 2_000),
                    bpm: 1_000,
                    numerator: 1,
                    denominator: 32 as const,
                },
            ],
            notes: [note(8)],
        };
        expect(countChartMeasures(document)).toBeGreaterThan(8_000_000);
        expect(userDraftDocumentSchema.safeParse(document).success).toBe(false);
    });

    it("4/4 · 120 BPM 10분은 300마디로 통과한다", () => {
        const document = {
            ...createDefaultChartDocument({ bpm: 120, durationMs: 600_000 }),
            timingPoints: [
                {
                    ...point("a", 0, 0),
                    bpm: 120,
                    numerator: 4,
                    denominator: 4 as const,
                },
            ],
        };
        expect(countChartMeasures(document)).toBe(300);
        expect(userDraftDocumentSchema.safeParse(document).success).toBe(true);
    });
});
