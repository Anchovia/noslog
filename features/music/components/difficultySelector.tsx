"use client";

import { SegmentedControl } from "@/components/ui/segmentedControl";
import type {
    Difficulty,
    MusicInfo,
} from "@/components/music/musicDetailTypes";
import { useTranslations } from "@/components/i18n/localeProvider";

const short: Record<Difficulty, string> = {
    Normal: "N",
    Hard: "H",
    Expert: "EX",
    Real: "R",
};

/**
 * 난이도 선택 — 공용 세그먼트 한 줄(L 44/40). 항목 = 이름 + 난이도 색 레벨 숫자(목록 난이도 판과 같은 언어).
 * 내부 레벨은 여기 두지 않고 머리 수치 띠에(선택한 난이도 것만). 320 폭에서는 약칭 N · H · EX · R (2026-09-16)
 */
export default function DifficultySelector({
    music,
    value,
    onValueChange,
}: {
    music: MusicInfo;
    value: Difficulty;
    onValueChange: (difficulty: Difficulty) => void;
}) {
    const t = useTranslations();
    const difficulties: Difficulty[] = [
        "Normal",
        "Hard",
        "Expert",
        ...(music.real ? ["Real" as const] : []),
    ];
    return (
        <SegmentedControl
            className="nl-difficulty-selector"
            label={t("music.difficulty")}
            value={value}
            onValueChange={onValueChange}
            options={difficulties.map((difficulty) => ({
                value: difficulty,
                label: (
                    <>
                        <span
                            lang="en"
                            className="nl-difficulty-selector__name"
                            data-short={short[difficulty]}
                        >
                            {difficulty}
                        </span>
                        <span
                            className={`nl-metric-value nl-level--${difficulty.toLowerCase()}`}
                        >
                            {
                                music[
                                    difficulty.toLowerCase() as
                                        "normal" | "hard" | "expert" | "real"
                                ]
                            }
                        </span>
                    </>
                ),
            }))}
        />
    );
}
