"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

export async function deleteEvaluation(formData: FormData) {
    await requireAdmin();
    const evaluationId = Number(formData.get("evaluationId"));
    if (!Number.isInteger(evaluationId)) return;

    await db.chartEvaluation.delete({ where: { id: evaluationId } });
    revalidatePath("/admin/community");
}
