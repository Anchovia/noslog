"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";

function announcementInput(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const isPublished = formData.get("isPublished") === "on";

    if (!title || title.length > 80 || !content || content.length > 2000) {
        return null;
    }

    return { title, content, isPublished };
}

function refreshAnnouncements() {
    updateTag(CACHE_TAGS.announcements);
    revalidatePath("/");
    revalidatePath("/admin/announcements");
}

export async function createAnnouncement(formData: FormData) {
    await requireAdmin();
    const input = announcementInput(formData);
    if (!input) return;

    await db.announcement.create({
        data: {
            ...input,
            publishedAt: input.isPublished ? new Date() : null,
        },
    });
    refreshAnnouncements();
}

export async function updateAnnouncement(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const input = announcementInput(formData);
    if (!Number.isInteger(id) || !input) return;

    const current = await db.announcement.findUnique({
        where: { id },
        select: { publishedAt: true },
    });
    if (!current) return;

    await db.announcement.update({
        where: { id },
        data: {
            ...input,
            publishedAt: input.isPublished
                ? (current.publishedAt ?? new Date())
                : null,
        },
    });
    refreshAnnouncements();
}

export async function deleteAnnouncement(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;

    await db.announcement.delete({ where: { id } });
    refreshAnnouncements();
}
