"use server";

import {
    saveBingo as saveBingoService,
    deleteBingo as deleteBingoService,
} from "@/features/bingos/server/bingo-admin-service";

export async function saveBingo(formData: FormData) {
    return saveBingoService(formData);
}

export async function deleteBingo(formData: FormData) {
    return deleteBingoService(formData);
}
