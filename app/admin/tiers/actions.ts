"use server";

import type { TierEntryPlacement } from "@/features/tiers/schemas/tierAdminSchema";
import {
    addTierBand as addTierBandService,
    addTierEntry as addTierEntryService,
    applyTierBoardLayout as applyTierBoardLayoutService,
    createTierList as createTierListService,
    deleteTierBand as deleteTierBandService,
    deleteTierEntry as deleteTierEntryService,
    deleteTierList as deleteTierListService,
    moveTierEntryToBand as moveTierEntryToBandService,
    searchTierCharts as searchTierChartsService,
    updateTierBand as updateTierBandService,
    updateTierList as updateTierListService,
} from "@/features/tiers/server/tierAdminService";

export async function searchTierCharts(query: string, tierListId: number) {
    return searchTierChartsService(query, tierListId);
}

export async function createTierList(formData: FormData) {
    return createTierListService(formData);
}

export async function updateTierList(formData: FormData) {
    return updateTierListService(formData);
}

export async function deleteTierList(formData: FormData) {
    return deleteTierListService(formData);
}

export async function addTierBand(formData: FormData) {
    return addTierBandService(formData);
}

export async function updateTierBand(formData: FormData) {
    return updateTierBandService(formData);
}

export async function deleteTierBand(formData: FormData) {
    return deleteTierBandService(formData);
}

export async function addTierEntry(formData: FormData) {
    return addTierEntryService(formData);
}

export async function applyTierBoardLayout(
    tierListId: number,
    placements: TierEntryPlacement[]
) {
    return applyTierBoardLayoutService(tierListId, placements);
}

export async function deleteTierEntry(formData: FormData) {
    return deleteTierEntryService(formData);
}

export async function moveTierEntryToBand(formData: FormData) {
    return moveTierEntryToBandService(formData);
}
