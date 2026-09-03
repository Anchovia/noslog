import type {
    MusicTranslationLocale,
    MusicTranslationStatus,
} from "@/features/music/schemas/musicTranslationAdminSchema";

export interface AdminMusicTranslation {
    locale: MusicTranslationLocale;
    status: MusicTranslationStatus;
    title: string;
}

export interface AdminMusicListItem {
    artist: string | null;
    categoryShort: string;
    chartCount: number;
    configuredChartCount: number;
    index: string;
    title: string;
    translation: {
        status: MusicTranslationStatus;
        title: string;
    } | null;
}

export interface AdminMusicTranslationCoverage {
    approved: number;
    draft: number;
    label: string;
    locale: MusicTranslationLocale;
    missing: number;
    total: number;
}

export interface MusicTranslationCsvPreview {
    index: string;
    locale: MusicTranslationLocale;
    originalTitle: string;
    status: MusicTranslationStatus;
    title: string;
}

export interface AdminMusicListData {
    activeLocale?: MusicTranslationLocale;
    activeStatus?: MusicTranslationStatus | "missing";
    coverage: AdminMusicTranslationCoverage[];
    missingLevelConstant: boolean;
    musics: AdminMusicListItem[];
    query: string;
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
