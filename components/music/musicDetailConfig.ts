import type { DetailTab, Difficulty } from "./musicDetailTypes";
import type { MessageKey } from "@/lib/i18n/messages";

export const difficultyStyles: Record<Difficulty, string> = {
    Normal: "text-normal",
    Hard: "text-hard",
    Expert: "text-expert",
    Real: "text-real",
};

export const detailTabs: { value: DetailTab; labelKey: MessageKey }[] = [
    { value: "record", labelKey: "music.tab.record" },
    { value: "detail", labelKey: "music.tab.info" },
    { value: "ranking", labelKey: "music.tab.ranking" },
    { value: "tier", labelKey: "music.tab.tier" },
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
