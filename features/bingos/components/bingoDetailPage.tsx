"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/Button";
import BingoTermHelp from "@/components/bingo/bingoTermHelp";
import {
    getBingoCellLabel,
    getBingoMissionDescriptionKey,
    getBingoMissionLink,
} from "@/components/bingo/plate/bingoPlateUtils";
import BingoCoordinateBoard from "@/features/bingos/components/bingoCoordinateBoard";
import { useBingoProgress } from "@/features/bingos/hooks/useBingoProgress";
import type { BingoDetail } from "@/features/bingos/schemas/publicBingoSchema";
import type { setBingoCellCompletion } from "@/app/(nevigation)/bingo/[id]/actions";

export default function BingoDetailPage({
    bingo,
    saveAction,
}: {
    bingo: BingoDetail;
    saveAction?: typeof setBingoCellCompletion;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const state = useBingoProgress(bingo, saveAction);
    const filters = [
        {
            value: "all",
            label: t("bingo.missionsAll", { count: bingo.cells.length }),
        },
        {
            value: "incomplete",
            label: t("bingo.incomplete", {
                count: bingo.cells.length - state.completed.size,
            }),
        },
        {
            value: "completed",
            label: t("bingo.completed", { count: state.completed.size }),
        },
        {
            value: "chance",
            label: t("bingo.chance", {
                count: state.progress.richPositions.size,
            }),
        },
    ] as const;
    return (
        <div className="nl-bingo-detail">
            <Link className="nl-bingo-back nl-control" href={href("/bingo")}>
                <ChevronLeft className="nl-icon" aria-hidden />
                {t("bingo.title")}
            </Link>
            <div className="nl-bingo-detail__columns">
                <section
                    className="nl-bingo-context"
                    aria-labelledby="bingo-title"
                >
                    <header className="nl-bingo-identity">
                        <MusicJacket
                            appearance="foundation"
                            index={bingo.musicIndex}
                            background={bingo.background}
                            title={bingo.title}
                            className="nl-bingo-identity__cover"
                            fallback={<span />}
                        />
                        <div>
                            <h1 className="nl-entity-title" id="bingo-title">
                                {bingo.title}
                            </h1>
                            {bingo.sourceVersion ? (
                                <p className="nl-metadata nl-muted">
                                    {bingo.sourceVersion}
                                </p>
                            ) : null}
                        </div>
                    </header>
                    <div className="nl-bingo-rewards nl-metric-value">
                        {bingo.isAuthenticated ? (
                            <p>
                                {t("bingo.progress", {
                                    lines: state.progress.completedLines,
                                    required: bingo.requiredLines,
                                    cells: state.completed.size,
                                })}
                            </p>
                        ) : null}
                        <p>
                            {t("bingo.totalReward", {
                                value: bingo.rewardNos.toLocaleString(locale),
                            })}
                        </p>
                    </div>
                    <p className="nl-metadata nl-muted">
                        {t("bingo.rewardStructure", {
                            lines: bingo.requiredLines,
                            line: bingo.lineRewardNos.toLocaleString(locale),
                            full: bingo.completionRewardNos.toLocaleString(
                                locale
                            ),
                        })}
                    </p>
                    <BingoCoordinateBoard
                        cells={bingo.cells}
                        completed={state.completed}
                        chance={state.progress.richPositions}
                        selected={state.selected}
                        isAuthenticated={bingo.isAuthenticated}
                        onSelect={(cell) => state.select(cell, true)}
                    />
                </section>
                <section
                    className="nl-bingo-missions"
                    aria-label={t("bingo.missions")}
                >
                    {bingo.isAuthenticated ? (
                        <div
                            className="nl-bingo-missions__filters"
                            role="group"
                            aria-label={t("bingo.filter")}
                        >
                            {filters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    appearance="foundation"
                                    variant="secondary"
                                    size="sm"
                                    aria-pressed={state.filter === filter.value}
                                    onClick={() =>
                                        state.setFilter(filter.value)
                                    }
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    ) : null}
                    <p className="sr-only" role="status">
                        {state.message}
                    </p>
                    {state.failed ? (
                        <div className="nl-bingo-save-error" role="alert">
                            <p className="nl-body-secondary">
                                {state.failed.message}
                            </p>
                            <Button
                                appearance="foundation"
                                variant="secondary"
                                onClick={() =>
                                    state.failed &&
                                    void state.save(
                                        state.failed.cellId,
                                        state.failed.next
                                    )
                                }
                            >
                                {t("common.retry")}
                            </Button>
                        </div>
                    ) : null}
                    <ul className="nl-bingo-missions__list">
                        {state.filtered.map((cell) => {
                            const checked = state.completed.has(cell.id);
                            const busy = state.pending.has(cell.id);
                            const chance = state.progress.richPositions.has(
                                cell.position
                            );
                            const missionLink = getBingoMissionLink(cell);
                            const label = getBingoCellLabel(cell.position);
                            return (
                                <li
                                    key={cell.id}
                                    id={`bingo-mission-${cell.id}`}
                                    className="nl-bingo-mission"
                                    tabIndex={-1}
                                    data-selected={
                                        state.selected === cell.id && !busy
                                    }
                                    aria-busy={busy}
                                    onFocus={() => state.select(cell)}
                                    onClick={() => state.select(cell)}
                                >
                                    <span className="nl-metric-value">
                                        {label}
                                    </span>
                                    <div className="nl-bingo-mission__text">
                                        <p
                                            className="nl-body-secondary"
                                            lang={cell.language}
                                        >
                                            <BingoTermHelp
                                                text={cell.challenge}
                                            />
                                        </p>
                                        <p className="nl-metadata nl-muted">
                                            {busy
                                                ? t("bingo.saving")
                                                : t(
                                                      getBingoMissionDescriptionKey(
                                                          cell,
                                                          bingo.isAuthenticated &&
                                                              checked,
                                                          bingo.isAuthenticated &&
                                                              chance
                                                      )
                                                  )}
                                        </p>
                                        {missionLink ? (
                                            <Link
                                                className="nl-control nl-bingo-mission__link"
                                                href={href(missionLink)}
                                            >
                                                {t("bingo.move")}
                                            </Link>
                                        ) : null}
                                    </div>
                                    {bingo.isAuthenticated ? (
                                        <Checkbox
                                            className="nl-bingo-mission__checkbox"
                                            checked={checked}
                                            disabled={busy}
                                            onChange={() =>
                                                void state.save(
                                                    cell.id,
                                                    !checked
                                                )
                                            }
                                            label={
                                                <span className="sr-only">
                                                    {t(
                                                        checked
                                                            ? "bingo.uncompleteAria"
                                                            : "bingo.completeAria",
                                                        {
                                                            challenge: `${label} ${cell.challenge}`,
                                                        }
                                                    )}
                                                </span>
                                            }
                                        />
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                    {!state.filtered.length ? (
                        <p className="nl-body-secondary" role="status">
                            {t("bingo.noMissions")}
                        </p>
                    ) : null}
                    {!bingo.isAuthenticated ? (
                        <Link
                            className="nl-button nl-button--primary"
                            href={href(
                                `/login?returnTo=${encodeURIComponent(href(`/bingo/${bingo.id}`))}`
                            )}
                        >
                            {t("bingo.loginToSave")}
                        </Link>
                    ) : null}
                </section>
            </div>
        </div>
    );
}
