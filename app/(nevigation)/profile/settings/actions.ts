"use server";

import {
    uploadUserSetting as uploadUserSettingService,
    requestProfileAvatarUpload as requestProfileAvatarUploadService,
} from "@/features/profile/server/profileSettingsService";
import type { Locale } from "@/lib/i18n/routing";

export async function uploadUserSetting(formData: FormData) {
    return uploadUserSettingService(formData);
}

export async function requestProfileAvatarUpload(
    contentType: string,
    requestedLocale?: Locale
) {
    return requestProfileAvatarUploadService(contentType, requestedLocale);
}
