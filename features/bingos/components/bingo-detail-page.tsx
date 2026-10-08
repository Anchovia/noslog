"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type {
    resetBingoProgress,
    setBingoCellCompletion,
} from "@/app/(site)/bingo/[id]/actions";
import BingoTermHelp from "@/components/bingo/bingo-term-help";
import { getBingoMissionLink } from "@/components/bingo/plate/bingo-plate-utils";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import MusicJacket from "@/components/music/music-jacket";
import ActionButton from "@/components/ui/action-button";
import BackLink from "@/components/ui/back-link";
import Button from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Disclosure from "@/components/ui/disclosure";
import FilterChips from "@/components/ui/filter-chips";
import ModalDialog from "@/components/ui/modal-dialog";
import { StatusMessage } from "@/components/ui/status-message";
import BingoCoordinateBoard, {
    useBingoPosition,
} from "@/features/bingos/components/bingo-coordinate-board";
import BingoMissionDetail from "@/features/bingos/components/bingo-mission-detail";
import BingoPosition from "@/features/bingos/components/bingo-position";
import { useBingoProgress } from "@/features/bingos/hooks/use-bingo-progress";
import type { BingoDetail } from "@/features/bingos/schemas/public-bingo-schema";
import useMediaQuery from "@/lib/hooks/use-media-query";

export default function BingoDetailPage({
    bingo,
    saveAction,
    resetAction,
}: {
    bingo: BingoDetail;
    saveAction?: typeof setBingoCellCompletion;
    resetAction?: typeof resetBingoProgress;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const state = useBingoProgress(bingo, saveAction, resetAction);
    const [resetOpen, setResetOpen] = useState(false);
    const cancelReset = useRef<HTMLButtonElement>(null);
    const completedPositions = new Set(
        bingo.cells
            .filter((cell) => state.completed.has(cell.id))
            .map((cell) => cell.position)
    );
    const positionText = useBingoPosition();
    // 넓은 화면(1056+, 2026-09-22 E · W1) = 판 | 오른쪽(머리 · 선택 칸 상세 · 미션) 1:1, 칸 상세는 팝오버 대신 오른쪽에 그대로
    const wide = useMediaQuery("(min-width: 1056px)");
    const filters = [
        {
            value: "all" as const,
            label: t("bingo.missionsAll", { count: bingo.cells.length }),
        },
        {
            value: "incomplete" as const,
            label: t("bingo.incomplete", {
                count: bingo.cells.length - state.completed.size,
            }),
        },
        {
            value: "completed" as const,
            label: t("bingo.completed", { count: state.completed.size }),
        },
        {
            value: "chance" as const,
            label: t("bingo.chance", {
                count: state.progress.richPositions.size,
            }),
        },
    ];
    const selectedCell = state.selectedCell;
    // 팝오버 앵커 = 선택된 칸 버튼. 이전·다음으로 선택이 바뀌면 앵커도 따라간다
    const [detailOpen, setDetailOpen] = useState(false);
    // Radix Measurable 타입은 null 을 허용하지 않는다 — 선택이 없으면 팝오버가 닫혀 있어 앵커를 읽지 않는다
    const anchor = useRef<HTMLElement>(null!);
    useEffect(() => {
        const cell = state.selected
            ? document.querySelector<HTMLElement>(
                  `.nl-bingo-board [data-cell-id="${state.selected}"]`
              )
            : null;
        if (cell) anchor.current = cell;
    }, [state.selected]);
    return (
        <div className="nl-bingo-detail">
            <BackLink href={href("/bingo")}>{t("bingo.title")}</BackLink>
            <div className="nl-bingo-detail__layout">
                <header
                    className="nl-bingo-identity"
                    aria-labelledby="bingo-title"
                >
                    <MusicJacket
                        appearance="foundation"
                        index={bingo.musicIndex}
                        background={bingo.background}
                        title={bingo.title}
                        className="nl-bingo-identity__cover"
                        fallback={<span />}
                    />
                    <div>
                        <h1
                            className="nl-page-title"
                            id="bingo-title"
                            tabIndex={-1}
                        >
                            {bingo.title}
                        </h1>
                        {bingo.sourceVersion ? (
                            <p className="nl-body-secondary nl-muted">
                                {bingo.sourceVersion}
                            </p>
                        ) : null}
                    </div>
                    {bingo.isAuthenticated ? (
                        <p className="nl-bingo-progress nl-metric-value">
                            <span>
                                {t("bingo.linesProgress", {
                                    lines: state.progress.completedLines,
                                    required: bingo.requiredLines,
                                })}
                            </span>
                            <span className="nl-muted">
                                {t("bingo.cells", {
                                    count: state.completed.size,
                                })}
                            </span>
                            <span className="nl-bingo-summary__bar" aria-hidden>
                                <i
                                    className="nl-chart-reveal nl-chart-bar"
                                    style={{
                                        width: `${state.progress.progressPercent}%`,
                                    }}
                                />
                            </span>
                        </p>
                    ) : null}
                </header>

                {/* 보상 구조는 펼침 없이 한 줄(2026-09-22) — 필요 줄 · 줄당 · 풀보드 · 총 보상 */}
                <p className="nl-bingo-summary nl-metadata nl-muted">
                    {[
                        t("bingo.requiredLinesLabel", {
                            count: bingo.requiredLines,
                        }),
                        t("bingo.perLineReward", {
                            value: bingo.lineRewardNos.toLocaleString(locale),
                        }),
                        `${t("bingo.summaryFull")} +${bingo.completionRewardNos.toLocaleString(locale)} nos`,
                        t("bingo.totalReward", {
                            value: bingo.rewardNos.toLocaleString(locale),
                        }),
                    ].join(" · ")}
                </p>

                <div className="nl-bingo-board-area">
                    <BingoCoordinateBoard
                        cells={bingo.cells}
                        completed={state.completed}
                        completedPositions={completedPositions}
                        lineLabels={wide}
                        chance={state.progress.richPositions}
                        lines={state.linePositions}
                        selected={state.selected}
                        isAuthenticated={bingo.isAuthenticated}
                        onSelect={(cell) => {
                            // 열려 있는 칸을 다시 누르면 닫는다 (셀렉트 토글 관례)
                            if (detailOpen && state.selected === cell.id) {
                                setDetailOpen(false);
                                return;
                            }
                            state.select(cell);
                            if (wide) return;
                            const el = document.querySelector<HTMLElement>(
                                `.nl-bingo-board [data-cell-id="${cell.id}"]`
                            );
                            if (el) anchor.current = el;
                            setDetailOpen(true);
                        }}
                    />
                    <Popover.Root
                        open={!wide && detailOpen && Boolean(selectedCell)}
                        onOpenChange={setDetailOpen}
                    >
                        <Popover.Anchor virtualRef={anchor} />
                        {selectedCell ? (
                            <Popover.Portal>
                                <div className="noslog-ui">
                                    <Popover.Content
                                        className="nl-bingo-cell-popover"
                                        side="bottom"
                                        align="center"
                                        sideOffset={8}
                                        collisionPadding={16}
                                        aria-label={t("bingo.selectedMission")}
                                        onInteractOutside={(event) => {
                                            // 다른 칸을 누르는 건 닫기가 아니라 앵커 이동 — 팝오버를 유지하고 선택만 바뀐다
                                            const target =
                                                event.target as Element | null;
                                            if (
                                                target?.closest(
                                                    ".nl-bingo-board__cell"
                                                )
                                            )
                                                event.preventDefault();
                                        }}
                                        onCloseAutoFocus={(event) => {
                                            // 앵커가 가상이라 Radix 가 포커스를 되돌릴 곳을 모른다 — 선택한 칸으로
                                            event.preventDefault();
                                            anchor.current?.focus();
                                        }}
                                    >
                                        <BingoMissionDetail
                                            cell={selectedCell}
                                            checked={state.completed.has(
                                                selectedCell.id
                                            )}
                                            busy={state.pending.has(
                                                selectedCell.id
                                            )}
                                            completedPositions={
                                                completedPositions
                                            }
                                            lineRewardNos={bingo.lineRewardNos}
                                            isAuthenticated={
                                                bingo.isAuthenticated
                                            }
                                            onToggle={() =>
                                                void state.save(
                                                    selectedCell.id,
                                                    !state.completed.has(
                                                        selectedCell.id
                                                    )
                                                )
                                            }
                                            onPrev={() =>
                                                state.selectRelative(-1)
                                            }
                                            onNext={() =>
                                                state.selectRelative(1)
                                            }
                                            onClose={() => setDetailOpen(false)}
                                        />
                                    </Popover.Content>
                                </div>
                            </Popover.Portal>
                        ) : null}
                    </Popover.Root>
                    {bingo.isAuthenticated ? (
                        <ul className="nl-bingo-legend nl-metadata nl-muted">
                            <li>
                                <i data-kind="done" aria-hidden />
                                {t("bingo.legendDone", {
                                    count: state.completed.size,
                                })}
                            </li>
                            <li>
                                <i data-kind="chance" aria-hidden />
                                {t("bingo.chance", {
                                    count: state.progress.richPositions.size,
                                })}
                            </li>
                            <li>
                                <i data-kind="line" aria-hidden />
                                {t("bingo.legendLines", {
                                    count: state.progress.completedLines,
                                })}
                            </li>
                        </ul>
                    ) : null}
                </div>

                {wide ? (
                    // 넓은 화면 선택 칸 상세 — 팝오버와 같은 내용을 판 오른쪽에 그대로
                    <div className="nl-bingo-detail-panel">
                        {selectedCell ? (
                            <BingoMissionDetail
                                cell={selectedCell}
                                checked={state.completed.has(selectedCell.id)}
                                busy={state.pending.has(selectedCell.id)}
                                completedPositions={completedPositions}
                                lineRewardNos={bingo.lineRewardNos}
                                isAuthenticated={bingo.isAuthenticated}
                                onToggle={() =>
                                    void state.save(
                                        selectedCell.id,
                                        !state.completed.has(selectedCell.id)
                                    )
                                }
                                onPrev={() => state.selectRelative(-1)}
                                onNext={() => state.selectRelative(1)}
                                onClose={() => state.clearSelection()}
                            />
                        ) : (
                            <p className="nl-body-secondary nl-muted nl-bingo-detail-panel__hint">
                                {t("bingo.selectHint")}
                            </p>
                        )}
                    </div>
                ) : null}

                <section
                    className="nl-bingo-missions"
                    aria-label={t("bingo.missions")}
                >
                    {/* 기본 펼침(2026-09-22) — 판 아래에서 25칸 전체 문장을 한눈에 */}
                    <Disclosure
                        open
                        heading="section"
                        className="nl-bingo-missions__all"
                        title={t("bingo.missions")}
                        meta={bingo.cells.length}
                    >
                        {bingo.isAuthenticated ? (
                            <FilterChips
                                label={t("bingo.filter")}
                                multiple={false}
                                value={[state.filter]}
                                onValueChange={([filter]) =>
                                    state.setFilter(filter)
                                }
                                options={filters}
                            />
                        ) : null}
                        <p className="sr-only" role="status">
                            {state.message}
                        </p>
                        {state.failed ? (
                            // 저장 실패 = 동작 결과 오류 inline + 고스트 M 「다시 시도」(2026-10-01 — 가이드 「상태 메시지」)
                            <StatusMessage
                                severity="danger"
                                role="alert"
                                title={state.failed.message}
                                action={
                                    <div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
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
                                }
                            />
                        ) : null}
                        {/* 미션 전체(2026-09-22) — 판 순서 그대로 한 목록, 칸 위치는 좌표 대신 작은 판(그 칸만 켬) */}
                        <ul className="nl-bingo-missions__list">
                            {state.filtered.map((cell) => {
                                const checked = state.completed.has(cell.id);
                                const busy = state.pending.has(cell.id);
                                const chance = state.progress.richPositions.has(
                                    cell.position
                                );
                                const missionLink = getBingoMissionLink(cell);
                                const label = positionText(cell.position);
                                const typeKey =
                                    cell.missionType === "music"
                                        ? "bingo.mission.music"
                                        : cell.missionType === "category"
                                          ? "bingo.mission.category"
                                          : cell.missionType === "exam"
                                            ? "bingo.mission.exam"
                                            : null;
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
                                        <BingoPosition
                                            position={cell.position}
                                            label={label}
                                        />
                                        <div className="nl-bingo-mission__text">
                                            <p
                                                className="nl-body-secondary"
                                                lang={cell.language}
                                            >
                                                <BingoTermHelp
                                                    text={cell.challenge}
                                                />
                                            </p>
                                            {busy ||
                                            (bingo.isAuthenticated &&
                                                !checked &&
                                                chance) ||
                                            typeKey ? (
                                                <p className="nl-metadata nl-muted">
                                                    {busy
                                                        ? t("bingo.saving")
                                                        : bingo.isAuthenticated &&
                                                            !checked &&
                                                            chance
                                                          ? t(
                                                                "bingo.mission.chance"
                                                            )
                                                          : typeKey
                                                            ? t(typeKey)
                                                            : null}
                                                    {!busy && missionLink ? (
                                                        <>
                                                            {" · "}
                                                            <Link
                                                                className="nl-bingo-mission__link"
                                                                href={href(
                                                                    missionLink
                                                                )}
                                                            >
                                                                {t(
                                                                    cell.missionType ===
                                                                        "music"
                                                                        ? "bingo.viewMusic"
                                                                        : "bingo.move"
                                                                )}
                                                            </Link>
                                                        </>
                                                    ) : null}
                                                </p>
                                            ) : null}
                                        </div>
                                        {bingo.isAuthenticated ? (
                                            <Checkbox
                                                className="nl-bingo-mission__checkbox"
                                                checked={checked}
                                                disabled={
                                                    busy || state.resetting
                                                }
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
                    </Disclosure>
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
                    {bingo.isAuthenticated ? (
                        <ModalDialog
                            open={resetOpen}
                            onOpenChange={(next) => {
                                if (!state.resetting) setResetOpen(next);
                            }}
                            title={t("bingo.resetTitle")}
                            variant="confirm"
                            className="nl-bingo-reset-dialog"
                            onOpenAutoFocus={(event) => {
                                event.preventDefault();
                                cancelReset.current?.focus();
                            }}
                            trigger={
                                state.hasSavedProgress ? (
                                    <Button
                                        variant="danger"
                                        disabled={
                                            state.pending.size > 0 ||
                                            state.resetting
                                        }
                                    >
                                        {t("bingo.resetTitle")}
                                    </Button>
                                ) : undefined
                            }
                            onCloseAutoFocus={(event) => {
                                if (!state.hasSavedProgress) {
                                    event.preventDefault();
                                    document
                                        .getElementById("bingo-title")
                                        ?.focus();
                                }
                            }}
                            footer={
                                <>
                                    <Button
                                        ref={cancelReset}
                                        variant="secondary"
                                        disabled={state.resetting}
                                        onClick={() => setResetOpen(false)}
                                    >
                                        {t("settings.cancel")}
                                    </Button>
                                    <ActionButton
                                        variant="danger"
                                        destructiveFilled
                                        busy={state.resetting}
                                        onClick={async () => {
                                            if (await state.reset())
                                                setResetOpen(false);
                                        }}
                                    >
                                        {t("bingo.resetAction")}
                                    </ActionButton>
                                </>
                            }
                        >
                            <p className="nl-body-secondary nl-muted">
                                {t("bingo.resetDescription", {
                                    title: bingo.title,
                                    count: state.completed.size,
                                })}
                            </p>
                            {state.resetError ? (
                                <p
                                    role="alert"
                                    className="nl-body-secondary nl-field__error"
                                >
                                    {state.resetError}
                                </p>
                            ) : null}
                        </ModalDialog>
                    ) : null}
                </section>
            </div>
        </div>
    );
}
