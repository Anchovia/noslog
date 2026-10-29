"use server";

import { after } from "next/server";

import { dispatchPartnerOutbox } from "@/features/partner/server/partner-outbox";
import { saveLocalePreference } from "@/features/settings/server/locale-preference-service";
import {
    saveSettingsPrivacy,
    saveSettingsProfile,
} from "@/features/settings/server/settings-save-service";

export async function changeLocale(input: unknown) {
    return saveLocalePreference(input);
}

export async function saveProfile(formData: FormData) {
    return saveSettingsProfile(formData);
}

/** 점수 · 활동을 비공개로 바꿨으면 파트너 캐시 무효화가 outbox 에 들어 있다 — 연결 설정처럼 응답 뒤 바로 보낸다 */
export async function savePrivacy(formData: FormData) {
    const result = await saveSettingsPrivacy(formData);
    if (result.success) after(() => dispatchPartnerOutbox().catch(() => null));
    return result;
}
