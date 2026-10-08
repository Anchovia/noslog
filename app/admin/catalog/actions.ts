"use server";

import { reviewMusicCatalogCandidate as reviewMusicCatalogCandidateService } from "@/features/music/server/music-catalog-admin-service";

export async function reviewMusicCatalogCandidate(formData: FormData) {
    return reviewMusicCatalogCandidateService(formData);
}
