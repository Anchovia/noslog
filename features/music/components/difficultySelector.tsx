"use client";

import { SegmentedControl } from "@/components/ui/segmentedControl";
import type {
    Difficulty,
    MusicInfo,
} from "@/components/music/musicDetailTypes";
import { useTranslations } from "@/components/i18n/localeProvider";

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
                            className={`nl-difficulty-selector__marker nl-difficulty-marker--${difficulty.toLowerCase()}`}
                            aria-hidden
                        />
                        <span lang="en">{difficulty}</span>
                        <span className="nl-difficulty-selector__level nl-metric-value">
                            {
                                music[
                                    difficulty.toLowerCase() as
                                        "normal" | "hard" | "expert" | "real"
                                ]
                            }
                            {music.constants?.[difficulty] !== null &&
                            music.constants?.[difficulty] !== undefined ? (
                                <span>
                                    ({music.constants[difficulty].toFixed(1)})
                                </span>
                            ) : null}
                        </span>
                    </>
                ),
            }))}
        />
    );
}
