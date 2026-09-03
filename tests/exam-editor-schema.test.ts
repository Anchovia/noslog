import { describe, expect, it } from "vitest";

import { examEditorSchema } from "@/features/exams/schemas/examEditorSchema";

function createExamValues(overrides: Record<string, unknown> = {}) {
    return {
        slug: "basic-10",
        mode: "basic",
        scoringType: "score",
        grade: 10,
        shortLabel: "10급",
        title: "Basic 10급",
        description: "",
        feeNos: 1000,
        requiredGrade: 800,
        status: "draft",
        stages: [],
        rewards: [{ type: "grade", label: "Basic 10급", musicIndex: null }],
        ...overrides,
    };
}

describe("검정 편집 스키마", () => {
    it("초안 Basic 검정 입력을 정규화한다", () => {
        const result = examEditorSchema.parse(
            createExamValues({ slug: "  basic-10  ", title: " Basic 10급 " })
        );

        expect(result.slug).toBe("basic-10");
        expect(result.title).toBe("Basic 10급");
    });

    it("식별자 형식 오류를 해당 필드에 연결한다", () => {
        const result = examEditorSchema.safeParse(
            createExamValues({ slug: "Basic 10" })
        );

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues[0]?.path).toEqual(["slug"]);
    });

    it("Basic과 Recital의 채점 방식 규칙을 구분한다", () => {
        const basic = examEditorSchema.safeParse(
            createExamValues({ scoringType: "recital_point" })
        );
        const recital = examEditorSchema.safeParse(
            createExamValues({
                mode: "recital",
                slug: "recital-10",
                scoringType: "score",
            })
        );

        expect(basic.success).toBe(false);
        expect(recital.success).toBe(false);
        if (!basic.success) {
            expect(basic.error.issues[0]?.path).toEqual(["scoringType"]);
        }
        if (!recital.success) {
            expect(recital.error.issues[0]?.path).toEqual(["scoringType"]);
        }
    });

    it("공개 검정에는 과제곡 세 곡을 요구한다", () => {
        const result = examEditorSchema.safeParse(
            createExamValues({ status: "published" })
        );

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: ["stages"] }),
            ])
        );
    });

    it("공개 Event 검정에는 보상 악곡을 요구한다", () => {
        const result = examEditorSchema.safeParse(
            createExamValues({
                mode: "event",
                slug: "event-test",
                grade: null,
                status: "published",
                stages: Array.from({ length: 3 }, (_, index) => ({
                    musicIndex: `music-${index}`,
                    title: `Music ${index}`,
                    artist: null,
                    charts: [
                        {
                            chartId: index + 1,
                            difficulty: "expert",
                            level: 12,
                        },
                    ],
                    allowedChartIds: [index + 1],
                    label: "",
                    requirementType: index === 0 ? "single" : "cumulative",
                    requiredValue: 900000,
                })),
                rewards: [],
            })
        );

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: ["rewards"] }),
            ])
        );
    });
});
