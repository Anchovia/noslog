"use server";

import {
    saveChartMetadata as saveChartMetadataService,
    saveMusicMetadata as saveMusicMetadataService,
} from "@/features/music/server/musicAdminService";
import {
    requestMusicJacketUpload as requestMusicJacketUploadService,
    resetMusicJacket as resetMusicJacketService,
    saveMusicJacket as saveMusicJacketService,
} from "@/features/music/server/musicJacketAdminService";
import {
    approveMusicTranslation as approveMusicTranslationService,
    getAdminMusicPage,
    importMusicTranslationsCsv as importMusicTranslationsCsvService,
    saveMusicTranslation as saveMusicTranslationService,
    validateMusicTranslationsCsv as validateMusicTranslationsCsvService,
} from "@/features/music/server/musicTranslationAdminService";
import type { AdminMusicListParams } from "@/features/music/server/musicTranslationAdminService";

export async function saveMusicMetadata(formData: FormData) {
    return saveMusicMetadataService(formData);
}

export async function saveChartMetadata(formData: FormData) {
    return saveChartMetadataService(formData);
}

export async function saveMusicTranslation(formData: FormData) {
    return saveMusicTranslationService(formData);
}

export async function approveMusicTranslation(formData: FormData) {
    return approveMusicTranslationService(formData);
}

export async function validateMusicTranslationsCsv(csv: string) {
    return validateMusicTranslationsCsvService(csv);
}

export async function importMusicTranslationsCsv(csv: string) {
    return importMusicTranslationsCsvService(csv);
}

export async function requestMusicJacketUpload(
    musicIndex: string,
    contentType: string
) {
    return requestMusicJacketUploadService(musicIndex, contentType);
}

export async function saveMusicJacket(formData: FormData) {
    return saveMusicJacketService(formData);
}

export async function resetMusicJacket(formData: FormData) {
    return resetMusicJacketService(formData);
}

/** 관리자 악곡 목록 다음 쪽(2026-09-25, 무한 스크롤) — 서비스가 관리자 권한을 확인한다 */
export async function listAdminMusic(
    params: AdminMusicListParams,
    offset: number
) {
    return getAdminMusicPage(
        {
            q:
                typeof params.q === "string"
                    ? params.q.slice(0, 100)
                    : undefined,
            missing: params.missing === "1" ? "1" : undefined,
            translationLocale:
                typeof params.translationLocale === "string"
                    ? params.translationLocale
                    : undefined,
            translationStatus:
                typeof params.translationStatus === "string"
                    ? params.translationStatus
                    : undefined,
        },
        offset
    );
}
