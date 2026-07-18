import type { DetailTab, Difficulty } from "./musicDetailTypes";

export const difficultyStyles: Record<Difficulty, string> = {
    Normal: "text-normal",
    Hard: "text-hard",
    Expert: "text-expert",
    Real: "text-real",
};

export const detailTabs: { value: DetailTab; label: string }[] = [
    { value: "record", label: "내 기록" },
    { value: "detail", label: "상세" },
    { value: "ranking", label: "랭킹" },
    { value: "tier", label: "서열 및 투표" },
];

export const rankAssetNames: Record<string, string> = {
    P: "p",
    S: "s",
    A2: "a2",
    "A+": "a2",
    A: "a",
    B2: "b2",
    "B+": "b2",
    B: "b",
    C: "c",
    D: "d",
};
