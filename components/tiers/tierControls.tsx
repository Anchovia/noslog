"use client";

import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    TIER_DIFFICULTIES,
    TIER_GOALS,
    TIER_REAL_LEVELS,
    TIER_REGULAR_LEVELS,
    tierGoalLabels,
    type TierDifficulty,
    type TierGoal,
    type TierMode,
} from "@/lib/tiers";
import { cn } from "@/lib/utils";

interface TierControlsProps {
    mode: TierMode;
    goal: TierGoal;
    difficulties: TierDifficulty[];
    levels: string[];
}

type FilterPanel = "difficulty" | "level" | null;

const difficultyLabels: Record<TierDifficulty, string> = {
    Normal: "Normal",
    Hard: "Hard",
    Expert: "Expert",
    Real: "Real",
};

export default function TierControls({
    mode,
    goal,
    difficulties,
    levels,
}: TierControlsProps) {
    const t = useTranslations();
    const localizedHref = useLocalizedHref();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [activePanel, setActivePanel] = useState<FilterPanel>(null);
    const [selectedMode, setSelectedMode] = useState(mode);
    const [selectedGoal, setSelectedGoal] = useState(goal);
    const [selectedDifficulties, setSelectedDifficulties] =
        useState(difficulties);
    const [selectedLevels, setSelectedLevels] = useState(levels);
    function selectionLabel(values: string[]) {
        if (values.length === 0) return t("tiers.all");
        if (values.length <= 2) return values.join(", ");
        return t("tiers.moreSelected", {
            first: values[0],
            count: values.length - 1,
        });
    }

    function navigate(
        nextMode: TierMode,
        nextGoal: TierGoal,
        nextDifficulties: TierDifficulty[],
        nextLevels: string[]
    ) {
        const params = new URLSearchParams();
        if (nextMode !== "basic") params.set("mode", nextMode);
        if (nextGoal !== "s") params.set("goal", nextGoal);
        if (nextDifficulties.length > 0) {
            params.set("difficulty", nextDifficulties.join(","));
        }
        if (nextLevels.length > 0) {
            params.set("level", nextLevels.join(","));
        }
        const query = params.toString();
        startTransition(() => {
            router.replace(
                localizedHref(query ? `/tiers?${query}` : "/tiers"),
                { scroll: false }
            );
        });
    }

    function changeMode(nextMode: TierMode) {
        setSelectedMode(nextMode);
        navigate(nextMode, selectedGoal, selectedDifficulties, selectedLevels);
    }

    function changeGoal(nextGoal: TierGoal) {
        setSelectedGoal(nextGoal);
        navigate(selectedMode, nextGoal, selectedDifficulties, selectedLevels);
    }

    function toggleDifficulty(difficulty: TierDifficulty) {
        const next = selectedDifficulties.includes(difficulty)
            ? selectedDifficulties.filter((item) => item !== difficulty)
            : TIER_DIFFICULTIES.filter(
                  (item) =>
                      selectedDifficulties.includes(item) || item === difficulty
              );
        setSelectedDifficulties(next);
        navigate(selectedMode, selectedGoal, next, selectedLevels);
    }

    function toggleLevel(level: string) {
        const allLevels = [...TIER_REGULAR_LEVELS, ...TIER_REAL_LEVELS];
        const next = selectedLevels.includes(level)
            ? selectedLevels.filter((item) => item !== level)
            : allLevels.filter(
                  (item) => selectedLevels.includes(item) || item === level
              );
        setSelectedLevels(next);
        navigate(selectedMode, selectedGoal, selectedDifficulties, next);
    }

    function clearDifficulties() {
        setSelectedDifficulties([]);
        navigate(selectedMode, selectedGoal, [], selectedLevels);
    }

    function clearLevels() {
        setSelectedLevels([]);
        navigate(selectedMode, selectedGoal, selectedDifficulties, []);
    }

    const regularLevelLabels = selectedLevels.filter((level) =>
        /^\d+$/.test(level)
    );
    const realLevelLabels = selectedLevels
        .filter((level) => level.startsWith("real-"))
        .map((level) => `Real ${level.slice(5)}`);

    return (
        <section
            className={cn(
                "flex flex-col gap-3 transition-opacity",
                isPending && "opacity-70"
            )}
            aria-label={t("tiers.conditions")}
        >
            <nav
                className="bg-surface rounded-card grid grid-cols-2 p-1"
                aria-label={t("tiers.modeNav")}
            >
                {(["basic", "recital"] as const).map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => changeMode(item)}
                        aria-pressed={selectedMode === item}
                        className={cn(
                            "focus-visible:ring-focus/40 h-9 cursor-pointer rounded-md text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                            selectedMode === item
                                ? "bg-text-primary text-bg"
                                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                        )}
                    >
                        {item === "basic" ? "Basic" : "Recital"}
                    </button>
                ))}
            </nav>

            <label className="text-caption flex flex-col gap-1">
                {t("tiers.goal")}
                <select
                    value={selectedGoal}
                    onChange={(event) =>
                        changeGoal(event.target.value as TierGoal)
                    }
                    className="border-border bg-surface text-input h-11 w-full rounded-md border px-3 font-semibold"
                >
                    {TIER_GOALS.map((item) => (
                        <option key={item} value={item}>
                            {t("tiers.goalOption", {
                                goal: tierGoalLabels[item],
                            })}
                        </option>
                    ))}
                </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() =>
                        setActivePanel((current) =>
                            current === "difficulty" ? null : "difficulty"
                        )
                    }
                    aria-expanded={activePanel === "difficulty"}
                    className="border-border bg-surface text-text-secondary flex h-10 min-w-0 items-center gap-2 rounded-md border px-3 text-left text-xs font-semibold"
                >
                    <span className="min-w-0 flex-1 truncate">
                        {t("tiers.difficulty")} ·{" "}
                        {selectionLabel(selectedDifficulties)}
                    </span>
                    <ChevronDown className="size-3.5 shrink-0" />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        setActivePanel((current) =>
                            current === "level" ? null : "level"
                        )
                    }
                    aria-expanded={activePanel === "level"}
                    className="border-border bg-surface text-text-secondary flex h-10 min-w-0 items-center gap-2 rounded-md border px-3 text-left text-xs font-semibold"
                >
                    <span className="min-w-0 flex-1 truncate">
                        {t("tiers.level")} ·{" "}
                        {selectionLabel([
                            ...regularLevelLabels,
                            ...realLevelLabels,
                        ])}
                    </span>
                    <ChevronDown className="size-3.5 shrink-0" />
                </button>
            </div>

            {activePanel === "difficulty" ? (
                <div className="border-border bg-surface rounded-card flex flex-col gap-3 border p-3">
                    <div className="flex items-center justify-between">
                        <strong className="text-sm">
                            {t("tiers.difficulty")}
                        </strong>
                        <button
                            type="button"
                            onClick={clearDifficulties}
                            className="text-caption hover:text-text-primary"
                        >
                            {t("tiers.selectAll")}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {TIER_DIFFICULTIES.map((difficulty) => {
                            const selected =
                                selectedDifficulties.includes(difficulty);
                            return (
                                <button
                                    key={difficulty}
                                    type="button"
                                    onClick={() => toggleDifficulty(difficulty)}
                                    aria-pressed={selected}
                                    className={cn(
                                        "border-border flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-semibold",
                                        selected
                                            ? "bg-text-primary text-bg"
                                            : "bg-bg text-text-secondary"
                                    )}
                                >
                                    {selected ? (
                                        <Check className="size-3" />
                                    ) : null}
                                    {difficultyLabels[difficulty]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {activePanel === "level" ? (
                <div className="border-border bg-surface rounded-card flex flex-col gap-3 border p-3">
                    <div className="flex items-center justify-between">
                        <strong className="text-sm">
                            {t("tiers.officialLevel")}
                        </strong>
                        <button
                            type="button"
                            onClick={clearLevels}
                            className="text-caption hover:text-text-primary"
                        >
                            {t("tiers.selectAll")}
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-caption">
                            Normal · Hard · Expert
                        </span>
                        <div className="grid grid-cols-6 gap-1.5">
                            {TIER_REGULAR_LEVELS.map((level) => (
                                <FilterChip
                                    key={level}
                                    label={level}
                                    selected={selectedLevels.includes(level)}
                                    onClick={() => toggleLevel(level)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="border-divider flex flex-col gap-2 border-t pt-3">
                        <span className="text-caption">Real</span>
                        <div className="grid grid-cols-3 gap-2">
                            {TIER_REAL_LEVELS.map((level) => (
                                <FilterChip
                                    key={level}
                                    label={`Real ${level.slice(5)}`}
                                    selected={selectedLevels.includes(level)}
                                    onClick={() => toggleLevel(level)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

function FilterChip({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={cn(
                "border-border h-8 rounded-md border text-xs font-semibold tabular-nums",
                selected
                    ? "bg-text-primary text-bg"
                    : "bg-bg text-text-secondary"
            )}
        >
            {label}
        </button>
    );
}
