"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

export async function updateFeedbackStatus(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const status = String(formData.get("status") ?? "");
    if (!Number.isInteger(id) || !["open", "resolved"].includes(status)) {
        return;
    }

    await db.feedbackReport.update({
        where: { id },
        data: {
            status,
            resolvedAt: status === "resolved" ? new Date() : null,
        },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/feedback");
}
