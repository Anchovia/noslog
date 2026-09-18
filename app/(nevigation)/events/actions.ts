"use server";

import {
    deleteOwnEvent as deleteOwnEventService,
    discardEventBanner as discardEventBannerService,
    requestEventBannerUpload as requestEventBannerUploadService,
    requestEventImageUpload as requestEventImageUploadService,
    saveEvent as saveEventService,
} from "@/features/events/server/eventService";

export async function saveEvent(formData: FormData) {
    return saveEventService(formData);
}

export async function requestEventBannerUpload(
    contentType: string,
    locale?: string
) {
    return requestEventBannerUploadService(contentType, locale);
}

export async function discardEventBanner(url: string) {
    return discardEventBannerService(url);
}

export async function deleteOwnEvent(id: number, locale?: string) {
    return deleteOwnEventService(id, locale);
}

export async function requestEventImageUpload(
    contentType: string,
    locale?: string
) {
    return requestEventImageUploadService(contentType, locale);
}
