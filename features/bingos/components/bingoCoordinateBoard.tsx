"use client";

import { Fragment } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import type { BingoMission } from "@/features/bingos/schemas/publicBingoSchema";
import { getBingoLineProgress } from "@/lib/bingo";

/** 칸 위치 글 — 보이는 좌표 없이 화면 읽기에만 「5행 1열」 */
export function useBingoPosition() {
    const t = useTranslations();
    return (position: number) =>
        t("bingo.position", {
            row: Math.floor((position - 1) / 5) + 1,
            column: ((position - 1) % 5) + 1,
        });
}

/**
 * 5×5 판(2026-09-22 재설계) — 칸 안에 미션 글(metadata, 칸 높이만큼 말줄임). 원본 빙고처럼 좌표(A1)는 두지 않는다.
 * `lineLabels` 면 판 가장자리에 12줄 진행(가로 · 세로 · 대각, 완성 ✓ · 채운 칸 수) — 넓은 화면 · 로그인에서만
 */
export default function BingoCoordinateBoard({
    cells,
    completed,
    completedPositions,
    chance,
    lines,
    selected,
    isAuthenticated,
    lineLabels = false,
    onSelect,
}: {
    cells: BingoMission[];
    completed: ReadonlySet<number>;
    completedPositions: ReadonlySet<number>;
    chance: ReadonlySet<number>;
    /** 완성된 줄에 속한 칸 */
    lines: ReadonlySet<number>;
    selected: number | null;
    isAuthenticated: boolean;
    lineLabels?: boolean;
    onSelect: (cell: BingoMission) => void;
}) {
    const t = useTranslations();
    const positionText = useBingoPosition();
    const progress = getBingoLineProgress(completedPositions);
    const showLines = lineLabels && isAuthenticated;
    const lineLabel = (index: number, symbol?: string) => {
        const { done } = progress[index];
        return (
            <span
                className="nl-bingo-board__line nl-metadata"
                data-state={
                    done === 5 ? "complete" : done === 4 ? "chance" : undefined
                }
                aria-hidden
            >
                {symbol ? `${symbol} ` : ""}
                {done === 5 ? "✓" : `${done}/5`}
            </span>
        );
    };
    // Native buttons deliberately retain ordinary Tab order; selection never changes a manual check.
    return (
        <div
            className="nl-bingo-board"
            data-lines={showLines || undefined}
            role="group"
            aria-label={t("bingo.board")}
        >
            {showLines ? (
                <>
                    {lineLabel(10, "╲")}
                    {[5, 6, 7, 8, 9].map((index) => (
                        <Fragment key={index}>{lineLabel(index)}</Fragment>
                    ))}
                </>
            ) : null}
            {cells.map((cell, index) => {
                const checked = isAuthenticated && completed.has(cell.id);
                const rich = isAuthenticated && chance.has(cell.position);
                const inLine = isAuthenticated && lines.has(cell.position);
                return (
                    <Fragment key={cell.id}>
                        {showLines && index % 5 === 0
                            ? lineLabel(index / 5)
                            : null}
                        <button
                            type="button"
                            className="nl-bingo-board__cell"
                            aria-pressed={selected === cell.id}
                            data-completed={checked}
                            data-cell-id={cell.id}
                            data-chance={rich}
                            data-line={inLine}
                            onClick={() => onSelect(cell)}
                            aria-label={`${positionText(cell.position)} ${cell.challenge}${checked ? ` · ${t("bingo.checked")}` : rich ? ` · ${t("bingo.filter.chance")}` : ""}${inLine ? ` · ${t("bingo.lineComplete")}` : ""}`}
                        >
                            <span
                                className="nl-bingo-board__text nl-metadata"
                                lang={cell.language}
                            >
                                {cell.challenge}
                            </span>
                        </button>
                    </Fragment>
                );
            })}
            {showLines ? lineLabel(11, "╱") : null}
        </div>
    );
}
