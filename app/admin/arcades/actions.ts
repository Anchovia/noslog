"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";

function optionalText(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text || null;
}

export async function createArcade(formData: FormData) {
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    if (!name || name.length > 80) return;

    await db.arcade.create({
        data: {
            name,
            region: optionalText(formData.get("region")),
            address: optionalText(formData.get("address")),
        },
    });
    updateTag(CACHE_TAGS.arcades);
    revalidatePath("/admin/arcades");
}

export async function updateArcade(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    if (!Number.isInteger(id) || !name || name.length > 80) return;

    await db.arcade.update({
        where: { id },
        data: {
            name,
            region: optionalText(formData.get("region")),
            address: optionalText(formData.get("address")),
            is_active: formData.get("isActive") === "on",
        },
    });
    updateTag(CACHE_TAGS.arcades);
    updateTag(CACHE_TAGS.userProfiles);
    revalidatePath("/admin/arcades");
}
