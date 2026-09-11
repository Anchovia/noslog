"use client";

import { Check, ChevronLeft, ChevronRight, Undo2, X } from "lucide-react";
import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import BingoTermHelp from "@/components/bingo/bingoTermHelp";
import {
    getBingoCellLabel,
    getBingoMissionLink,
} from "@/components/bingo/plate/bingoPlateUtils";
import type { BingoMission } from "@/features/bingos/schemas/publicBingoSchema";
import { getBingoLinesCompletedBy } from "@/lib/bingo";
import type { BingoLineKind } from "@/lib/bingo";

/**
 * 칸 상세 — 누른 칸에 붙는 팝오버(DestinationPanel 계약) 안에 그린다.
 * 이전·다음으로 칸을 옮기면 앵커도 따라가고, 스크롤하지 않으므로 보드가 시야에 남는다.
 */
export default function BingoMissionDetail({
    cell,
    checked,
    busy,
    completedPositions,
    lineRewardNos,
    isAuthenticated,
    onToggle,
    onPrev,
    onNext,
    onClose,
}: {
    cell: BingoMission;
    checked: boolean;
    busy: boolean;
    completedPositions: ReadonlySet<number>;
    lineRewardNos: number;
    isAuthenticated: boolean;
    onToggle: () => void;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const label = getBingoCellLabel(cell.position);
    const missionLink = getBingoMissionLink(cell);
    const linesCompletedBy = isAuthenticated
        ? getBingoLinesCompletedBy(cell.position, completedPositions)
        : [];
    const chance = !checked && linesCompletedBy.length > 0;
    const typeKey =
        cell.missionType === "music"
            ? "bingo.mission.music"
            : cell.missionType === "category"
              ? "bingo.mission.category"
              : cell.missionType === "exam"
                ? "bingo.mission.exam"
                : null;
    const lineName = (line: BingoLineKind) =>
        line.kind === "row"
            ? t("bingo.rowLabel", { row: line.label })
            : line.kind === "column"
              ? t("bingo.columnLabel", { column: line.index })
              : t("bingo.diagonalLabel");
    return (
        <section
            className="nl-bingo-cell-detail"
            aria-label={t("bingo.selectedMission")}
            aria-busy={busy || undefined}
            data-pending={busy || undefined}
        >
            <div className="nl-bingo-cell-detail__head">
                <span className="nl-component-title nl-bingo-cell-detail__pos">
                    {label}
                </span>
                {typeKey ? (
                    <span className="nl-tag nl-metadata">{t(typeKey)}</span>
                ) : null}
                {isAuthenticated && checked ? (
                    <span className="nl-tag nl-tag--strong nl-metadata">
                        {t("bingo.checked")}
                    </span>
                ) : chance ? (
                    <span className="nl-tag nl-tag--strong nl-metadata">
                        {t("bingo.filter.chance")}
                    </span>
                ) : null}
                <span className="nl-bingo-cell-detail__nav">
                    <button
                        type="button"
                        className="nl-icon-button"
                        aria-label={t("bingo.prevCell")}
                        onClick={onPrev}
                    >
                        <ChevronLeft className="nl-icon-small" aria-hidden />
                    </button>
                    <button
                        type="button"
                        className="nl-icon-button"
                        aria-label={t("bingo.nextCell")}
                        onClick={onNext}
                    >
                        <ChevronRight className="nl-icon-small" aria-hidden />
                    </button>
                    <button
                        type="button"
                        className="nl-icon-button"
                        aria-label={t("common.close")}
                        onClick={onClose}
                    >
                        <X className="nl-icon" aria-hidden />
                    </button>
                </span>
            </div>
            <p className="nl-body" lang={cell.language}>
                <BingoTermHelp text={cell.challenge} />
            </p>
            {chance ? (
                <p className="nl-body-secondary nl-muted">
                    {t("bingo.cellChanceLine", {
                        line: linesCompletedBy.map(lineName).join(" · "),
                        reward: lineRewardNos.toLocaleString(locale),
                    })}
                </p>
            ) : null}
            <div className="nl-bingo-cell-detail__actions">
                {isAuthenticated ? (
                    <ActionButton
                        variant={checked ? "secondary" : "primary"}
                        busy={busy}
                        busyLabel={t("bingo.saving")}
                        aria-label={t(
                            checked
                                ? "bingo.uncompleteAria"
                                : "bingo.completeAria",
                            { challenge: `${label} ${cell.challenge}` }
                        )}
                        onClick={onToggle}
                    >
                        {checked ? (
                            <Undo2 className="nl-icon-small" aria-hidden />
                        ) : (
                            <Check className="nl-icon-small" aria-hidden />
                        )}
                        {t(
                            checked
                                ? "bingo.markIncomplete"
                                : "bingo.markComplete"
                        )}
                    </ActionButton>
                ) : null}
                {missionLink ? (
                    <Link
                        className="nl-button nl-button--secondary"
                        href={href(missionLink)}
                    >
                        {t(
                            cell.missionType === "music"
                                ? "bingo.viewMusic"
                                : "bingo.move"
                        )}
                    </Link>
                ) : null}
            </div>
        </section>
    );
}
