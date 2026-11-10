"use server";

import type { TierEntryPlacement } from "@/features/tiers/schemas/tier-admin-schema";
import {
    addTierBand as addTierBandService,
    deleteTierBand as deleteTierBandService,
    updateTierBand as updateTierBandService,
} from "@/features/tiers/server/tier-band-admin-service";
import { applyTierBoardLayout as applyTierBoardLayoutService } from "@/features/tiers/server/tier-board-admin-service";
import {
    addTierEntry as addTierEntryService,
    deleteTierEntry as deleteTierEntryService,
    moveTierEntryToBand as moveTierEntryToBandService,
    searchTierCharts as searchTierChartsService,
} from "@/features/tiers/server/tier-entry-admin-service";
import {
    createTierList as createTierListService,
    deleteTierList as deleteTierListService,
    updateTierList as updateTierListService,
} from "@/features/tiers/server/tier-list-admin-service";

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
