export interface BingoCellItem {
    id: number;
    challenge: string;
    missionType: string;
    musicIndex: string | null;
    /** 악곡 칸 링크 난이도(그 곡의 가장 높은 난이도) — 없으면 expert */
    musicDifficulty?: string | null;
    musicTitle?: string | null;
    localizedMusicTitle?: string | null;
    position: number;
    categoryShort: string | null;
}

export type MissionFilter = "incomplete" | "completed" | "rich";
