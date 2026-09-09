import type { MusicCatalogStatus } from "@/features/music/schemas/musicCatalogAdminSchema";

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
