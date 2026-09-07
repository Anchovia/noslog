"use server";

import { saveLocalePreference } from "@/features/settings/server/localePreferenceService";
import {
    saveSettingsProfile,
    saveSettingsPrivacy,
} from "@/features/settings/server/settingsSaveService";

export async function changeLocale(input: unknown) {
    return saveLocalePreference(input);
}

export async function saveProfile(formData: FormData) {
    return saveSettingsProfile(formData);
}

export async function savePrivacy(formData: FormData) {
    return saveSettingsPrivacy(formData);
}
