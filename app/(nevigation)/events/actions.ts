"use server";

import {
    discardEventBanner as discardEventBannerService,
    requestEventBannerUpload as requestEventBannerUploadService,
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
