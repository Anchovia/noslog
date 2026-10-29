"use server";

import { requestProfileAvatarUpload as requestProfileAvatarUploadService } from "@/features/profile/server/profile-settings-service";
import type { Locale } from "@/lib/i18n/routing";

export async function requestProfileAvatarUpload(
    contentType: string,
    requestedLocale?: Locale
) {
    return requestProfileAvatarUploadService(contentType, requestedLocale);
}
