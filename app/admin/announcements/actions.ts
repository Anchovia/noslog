"use server";

import {
    createAnnouncement as createAnnouncementService,
    updateAnnouncement as updateAnnouncementService,
    deleteAnnouncement as deleteAnnouncementService,
} from "@/features/announcements/server/announcementAdminService";

export async function createAnnouncement(formData: FormData) {
    return createAnnouncementService(formData);
}

export async function updateAnnouncement(formData: FormData) {
    return updateAnnouncementService(formData);
}

export async function deleteAnnouncement(formData: FormData) {
    return deleteAnnouncementService(formData);
}
