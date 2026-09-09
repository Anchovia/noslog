"use server";

import { deleteAdminChartEvaluation } from "@/features/music/server/chartEvaluationAdminService";

export async function deleteEvaluation(formData: FormData) {
    return deleteAdminChartEvaluation(formData);
}
