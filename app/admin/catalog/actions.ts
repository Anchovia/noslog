"use server";

import { reviewMusicCatalogCandidate as reviewMusicCatalogCandidateService } from "@/features/music/server/musicCatalogAdminService";

export async function reviewMusicCatalogCandidate(formData: FormData) {
    return reviewMusicCatalogCandidateService(formData);
}
