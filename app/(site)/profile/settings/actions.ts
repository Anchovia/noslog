"use server";

import {
    requestProfileAvatarUpload as requestProfileAvatarUploadService,
    uploadUserSetting as uploadUserSettingService,
} from "@/features/profile/server/profile-settings-service";
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
