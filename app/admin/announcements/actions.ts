"use server";

import {
    createAnnouncement as createAnnouncementService,
    updateAnnouncement as updateAnnouncementService,
    deleteAnnouncement as deleteAnnouncementService,
    requestAnnouncementImageUpload as requestAnnouncementImageUploadService,
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

export async function requestAnnouncementImageUpload(contentType: string) {
    return requestAnnouncementImageUploadService(contentType);
}
