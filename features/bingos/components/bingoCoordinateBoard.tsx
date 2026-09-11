"use client";

import { Check } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import { getBingoCellLabel } from "@/components/bingo/plate/bingoPlateUtils";
import type { BingoMission } from "@/features/bingos/schemas/publicBingoSchema";

export default function BingoCoordinateBoard({
    cells,
    completed,
    chance,
    lines,
    selected,
    isAuthenticated,
    onSelect,
}: {
    cells: BingoMission[];
    completed: ReadonlySet<number>;
    chance: ReadonlySet<number>;
    /** 완성된 줄에 속한 칸 */
    lines: ReadonlySet<number>;
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
                const inLine = isAuthenticated && lines.has(cell.position);
                const label = getBingoCellLabel(cell.position);
                return (
                    <button
                        key={cell.id}
                        type="button"
                        className="nl-bingo-board__cell nl-metric-value"
                        aria-pressed={selected === cell.id}
                        data-completed={checked}
                        data-cell-id={cell.id}
                        data-chance={rich}
                        data-line={inLine}
                        onClick={() => onSelect(cell)}
                        aria-label={`${label} ${cell.challenge}${checked ? ` · ${t("bingo.checked")}` : rich ? ` · ${t("bingo.filter.chance")}` : ""}${inLine ? ` · ${t("bingo.lineComplete")}` : ""}`}
                    >
                        {checked ? (
                            <Check
                                className="nl-bingo-board__stamp"
                                aria-hidden
                            />
                        ) : null}
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
