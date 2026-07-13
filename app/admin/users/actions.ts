"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

export async function updateUserRole(formData: FormData) {
    const admin = await requireAdmin();
    const userId = Number(formData.get("userId"));
    const role = String(formData.get("role") ?? "");
    if (!Number.isInteger(userId) || !["user", "admin"].includes(role)) return;
    if (admin.id === userId && role !== "admin") return;

    await db.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/admin/users");
}

export async function resetUserSyncToken(formData: FormData) {
    await requireAdmin();
    const userId = Number(formData.get("userId"));
    if (!Number.isInteger(userId)) return;

    await db.user.update({
        where: { id: userId },
        data: { sync_token_version: { increment: 1 } },
    });
    revalidatePath("/admin/users");
}
