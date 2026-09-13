"use server";

import {
    createArcade as createArcadeService,
    updateArcade as updateArcadeService,
} from "@/features/arcades/server/arcadeAdminService";
import {
    deleteArcadePhoto as deleteArcadePhotoService,
    requestArcadePhotoUpload as requestArcadePhotoUploadService,
    saveArcadePhoto as saveArcadePhotoService,
    setArcadeMainPhoto as setArcadeMainPhotoService,
} from "@/features/arcades/server/arcadePhotoAdminService";

export async function createArcade(formData: FormData) {
    return createArcadeService(formData);
}

export async function updateArcade(formData: FormData) {
    return updateArcadeService(formData);
}

export async function requestArcadePhotoUpload(
    arcadeId: number,
    contentType: string
) {
    return requestArcadePhotoUploadService(arcadeId, contentType);
}

export async function saveArcadePhoto(formData: FormData) {
    return saveArcadePhotoService(formData);
}

export async function deleteArcadePhoto(formData: FormData) {
    return deleteArcadePhotoService(formData);
}

export async function setArcadeMainPhoto(formData: FormData) {
    return setArcadeMainPhotoService(formData);
}
