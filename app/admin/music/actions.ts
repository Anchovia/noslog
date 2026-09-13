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
    importMusicTranslationsCsv as importMusicTranslationsCsvService,
    saveMusicTranslation as saveMusicTranslationService,
    validateMusicTranslationsCsv as validateMusicTranslationsCsvService,
} from "@/features/music/server/musicTranslationAdminService";

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
