import { z } from "zod";

export const chartEvaluationAdminDeleteSchema = z.object({
    evaluationId: z.coerce
        .number({ error: "잘못된 평가입니다." })
        .int("잘못된 평가입니다.")
        .positive("잘못된 평가입니다."),
});

export function chartEvaluationAdminDeleteInputFromFormData(
    formData: FormData
) {
    return { evaluationId: formData.get("evaluationId") };
}

export function createChartEvaluationAdminDeleteFormData(evaluationId: number) {
    const formData = new FormData();
    formData.set("evaluationId", String(evaluationId));
    return formData;
}
