"use server";

import { saveLocalePreference } from "@/features/settings/server/locale-preference-service";
import {
    saveSettingsProfile,
    saveSettingsPrivacy,
} from "@/features/settings/server/settings-save-service";

export async function changeLocale(input: unknown) {
    return saveLocalePreference(input);
}

export async function saveProfile(formData: FormData) {
    return saveSettingsProfile(formData);
}

export async function savePrivacy(formData: FormData) {
    return saveSettingsPrivacy(formData);
}
