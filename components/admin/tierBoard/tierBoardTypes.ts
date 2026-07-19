export interface TierChartData {
    id: number;
    difficulty: string;
    level: number;
    music: {
        index: string;
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
    musicIndex: string;
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

// 일괄 적용 시 채보의 최종 구간과 순서를 서버에 전달함
export interface TierEntryPlacement {
    id: number;
    tierBandId: number;
    position: number;
}
