"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";

export async function deleteEvaluation(formData: FormData) {
    await requireAdmin();
    const evaluationId = Number(formData.get("evaluationId"));
    if (!Number.isInteger(evaluationId)) return;

    await db.chartEvaluation.delete({ where: { id: evaluationId } });
    updateTag(CACHE_TAGS.chartEvaluations);
    revalidatePath("/admin/community");
}
