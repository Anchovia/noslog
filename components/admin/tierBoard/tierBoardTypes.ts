export interface TierChartData {
    id: number;
    difficulty: string;
    level: number;
    music: {
        title: string;
        artist: string | null;
        background: string | null;
    };
}

export interface TierEntryData {
    id: number;
    position: number;
    chart: TierChartData;
}

export interface TierBandData {
    id: number;
    value: number;
    entries: TierEntryData[];
}

export interface TierChartSearchResult {
    id: number;
    title: string;
    artist: string | null;
    jacket: string | null;
    difficulty: string;
    level: number;
}

export interface TierDropData {
    type?: string;
    bandId?: unknown;
    index?: unknown;
}

export interface TierDropTarget {
    bandId: number;
    index: number;
}
