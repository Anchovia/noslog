import type { MusicCatalogStatus } from "@/features/music/schemas/music-catalog-admin-schema";

export interface AdminMusicCatalogCandidate {
    artist: string | null;
    changes: string[];
    id: number;
    lastSeenAt: Date;
    musicIndex: string;
    seenCount: number;
    status: MusicCatalogStatus;
    title: string;
}
