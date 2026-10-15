"use server";

import { deleteAdminChartEvaluation } from "@/features/music/server/chart-evaluation-admin-service";

export async function deleteEvaluation(formData: FormData) {
    return deleteAdminChartEvaluation(formData);
}
