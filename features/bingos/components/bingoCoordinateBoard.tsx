"use client";

import { useTranslations } from "@/components/i18n/localeProvider";
import { getBingoCellLabel } from "@/components/bingo/plate/bingoPlateUtils";
import type { BingoMission } from "@/features/bingos/schemas/publicBingoSchema";

export default function BingoCoordinateBoard({
    cells,
    completed,
    chance,
    selected,
    isAuthenticated,
    onSelect,
}: {
    cells: BingoMission[];
    completed: ReadonlySet<number>;
    chance: ReadonlySet<number>;
    selected: number | null;
    isAuthenticated: boolean;
    onSelect: (cell: BingoMission) => void;
}) {
    const t = useTranslations();
    // Native buttons deliberately retain ordinary Tab order; selection never changes a manual check.
    return (
        <div
            className="nl-bingo-board"
            role="group"
            aria-label={t("bingo.board")}
        >
            {cells.map((cell) => {
                const checked = isAuthenticated && completed.has(cell.id);
                const rich = isAuthenticated && chance.has(cell.position);
                const label = getBingoCellLabel(cell.position);
                return (
                    <button
                        key={cell.id}
                        type="button"
                        className="nl-bingo-board__cell nl-metric-value"
                        aria-pressed={selected === cell.id}
                        data-completed={checked}
                        data-chance={rich}
                        onClick={() => onSelect(cell)}
                        aria-label={`${label} ${cell.challenge}${checked ? ` · ${t("bingo.checked")}` : rich ? ` · ${t("bingo.filter.chance")}` : ""}`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
