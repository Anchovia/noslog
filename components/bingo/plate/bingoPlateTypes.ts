export interface BingoCellItem {
    id: number;
    challenge: string;
    missionType: string;
    musicIndex: string | null;
    position: number;
    categoryShort: string | null;
}

export type MissionFilter = "incomplete" | "completed" | "rich";

export interface BingoPlateProps {
    cells: BingoCellItem[];
    initialCompletedCellIds: number[];
    canEdit: boolean;
}
