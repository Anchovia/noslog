"use server";

import {
    saveChartMetadata as saveChartMetadataService,
    saveMusicMetadata as saveMusicMetadataService,
} from "@/features/music/server/musicAdminService";
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
