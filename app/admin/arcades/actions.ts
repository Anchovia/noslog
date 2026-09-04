"use server";

import {
    createArcade as createArcadeService,
    updateArcade as updateArcadeService,
} from "@/features/arcades/server/arcadeAdminService";

export async function createArcade(formData: FormData) {
    return createArcadeService(formData);
}

export async function updateArcade(formData: FormData) {
    return updateArcadeService(formData);
}
