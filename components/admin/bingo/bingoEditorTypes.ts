export interface BingoEditorCellData {
    position: number;
    title: string;
    missionType: string;
    ruleType: string;
    ruleConfig: string;
    categoryShort: string;
    targetDifficulty: string;
    targetLevel: string;
    musicIndex: string;
}

export interface BingoEditorData {
    id?: number;
    title: string;
    description: string;
    rewardNos: number;
    requiredLines: number;
    status: string;
    startsAt: string;
    endsAt: string;
    coverMusicIndex: string;
    cells: BingoEditorCellData[];
}

export interface BingoMusicOption {
    index: string;
    title: string;
}
