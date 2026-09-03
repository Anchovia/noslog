export interface AdminMusicTranslation {
    locale: string;
    status: string;
    title: string;
}

export interface AdminMusicChart {
    chartPreviewUrl: string;
    difficulty: string;
    history: number[];
    id: number;
    level: number;
    levelConstant: number | null;
    noteCount: number | null;
    playVideoUrl: string;
    releasedAt: string;
    unlockCondition: string;
}

export interface AdminMusicDetail {
    artist: string | null;
    bpmMax: string;
    bpmMin: string;
    categoryShort: string;
    charts: AdminMusicChart[];
    description: string;
    durationSeconds: string;
    index: string;
    title: string;
    translations: AdminMusicTranslation[];
}
