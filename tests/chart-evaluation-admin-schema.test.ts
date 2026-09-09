import { describe, expect, it } from "vitest";

import {
    chartEvaluationAdminDeleteInputFromFormData,
    chartEvaluationAdminDeleteSchema,
    createChartEvaluationAdminDeleteFormData,
} from "@/features/music/schemas/chartEvaluationAdminSchema";

describe("관리자 커뮤니티 평가 스키마", () => {
    it("삭제 FormData를 양의 정수 ID로 정규화한다", () => {
        const formData = createChartEvaluationAdminDeleteFormData(20);

        expect(
            chartEvaluationAdminDeleteSchema.parse(
                chartEvaluationAdminDeleteInputFromFormData(formData)
            )
        ).toEqual({ evaluationId: 20 });
    });

    it.each(["", "0", "-1", "1.5", "unknown"])(
        "잘못된 평가 ID %s를 거부한다",
        (evaluationId) => {
            const formData = new FormData();
            formData.set("evaluationId", evaluationId);

            expect(
                chartEvaluationAdminDeleteSchema.safeParse(
                    chartEvaluationAdminDeleteInputFromFormData(formData)
                ).success
            ).toBe(false);
        }
    );
});
