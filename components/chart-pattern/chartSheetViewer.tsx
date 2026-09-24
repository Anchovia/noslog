"use client";

import { ChevronRight } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import BackLink from "@/components/ui/backLink";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import ModalDialog from "@/components/ui/modalDialog";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { StatusMessage } from "@/components/ui/statusMessage";
import ChartComments, {
    chartCommentsOptions,
} from "@/features/contributions/components/chartComments";
import ChartDraftEntry from "@/features/contributions/components/chartDraftEntry";
import ContributionLabel from "@/features/contributions/components/contributionLabel";
import type { NameLabel } from "@/features/contributions/contributionLevel";
import type { ChartCommentItem } from "@/features/contributions/server/chartDraftService";
import {
    getBrowserSupportSnapshot,
    getServerBrowserSupportSnapshot,
    subscribeBrowserSupport,
} from "@/lib/browserSupport";
import {
    getChartNoteRenderPoints,
    getGlissandoSnapRenderPoints,
} from "@/lib/chart-pattern/editor";
import { getChartPlaybackDurationMs } from "@/lib/chart-pattern/playback";
import {
    CHART_LANE_COUNT,
    isChartLaneGroupBoundary,
    type ChartDocument,
    type ChartHand,
    type ChartNote,
} from "@/lib/chart-pattern/schema";
import {
    formatBpm,
    formatEditorTime,
    getBeatMarkers,
    getMeasureMarkers,
    getMeasurePanels,
    tickToMilliseconds,
    type MeasureMarker,
} from "@/lib/chart-pattern/timing";

import ChartSheetStrip from "./chartSheetStrip";
import FallingChartViewer from "./fallingChartViewer";
import { createPlaybackClock, timeParam } from "./playbackClock";

interface ChartSheetViewerProps {
    title: string;
    localizedTitle?: string | null;
    artist: string | null;
    difficulty: string;
    level: number;
    revision: number | null;
    document: ChartDocument;
    backHref: string;
    jacketUrl: string | null;
    preview?: boolean;
    /** 출처 표기(2026-09-24 C2) — 공개 채보만. extracted = 영상 추출 버전에서 나온 채보 */
    source?: ChartSource;
    /** 유저 기여(2026-09-24 3단계) — 공개 채보만. 「고치기 ›」 · 「채보 의견」 구역 */
    contribution?: ChartViewerContribution;
}

export interface ChartSource {
    /** 작성자 — 유저 기여 채보면 실제 작성자 + 기여 라벨(E1), 아니면 공개한 운영자 */
    author: { id: number | null; name: string; label: NameLabel | null } | null;
    /** 작성자와 공개한 사람이 다를 때(유저 기여 채보)만 — 출처 창에 따로 적는다 */
    publisher: { name: string } | null;
    publishedAt: string | null;
    extracted: boolean;
}

export interface ChartViewerContribution {
    chartId: number;
    signedIn: boolean;
    canModerate: boolean;
    draftHref: string;
    loginHref: string;
    returnTo: string;
    initialComments: ChartCommentItem[];
    /** 주소 `?t=` — 처음 열 때 그 시각으로 */
    initialTimeMs: number | null;
}

const VID2BMAP_PAPER_URL =
    "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11705207";
const VID2BMAP_GITHUB_URL = "https://github.com/Neutrinoant/vid2bmap";

const CHART_WIDTH = 220;
const MEASURE_GUTTER_WIDTH = 56;
export const PANEL_WIDTH = CHART_WIDTH + MEASURE_GUTTER_WIDTH;
export const PANEL_HEIGHT = 720;
export type SheetPanel = { index: number; startMs: number; endMs: number };
export const PADDING_TOP = 30;
export const PADDING_BOTTOM = 34;
const PANEL_NOTE_EDGE_INSET = 4;
export const PANEL_MEASURE_EDGE_INSET = 5;
const PANEL_BOUNDARY_EPSILON_MS = 0.001;

const handColors: Record<ChartHand, string> = {
    left: "#62d4e8",
    right: "#f06b68",
};

function chartContentEnd(document: ChartDocument) {
    return document.notes.reduce((maximum, note) => {
        const time = tickToMilliseconds(
            note.tick + note.durationTicks,
            document.timingPoints,
            document.ticksPerQuarter
        );
        return Math.max(maximum, time);
    }, 0);
}

export default function ChartSheetViewer({
    title,
    localizedTitle,
    artist,
    difficulty,
    level,
    revision,
    document,
    backHref,
    jacketUrl,
    preview = false,
    source,
    contribution,
}: ChartSheetViewerProps) {
    const locale = useLocale();
    const t = useTranslations();
    const numberLocale =
        locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR";
    const [viewMode, setViewMode] = useState<"falling" | "sheet">("falling");
    const [sourceOpen, setSourceOpen] = useState(false);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const [clock] = useState(() =>
        createPlaybackClock(contribution?.initialTimeMs ?? 0)
    );
    const [seekRequest, setSeekRequest] = useState(() =>
        contribution?.initialTimeMs == null
            ? null
            : { timeMs: contribution.initialTimeMs, key: 0 }
    );
    const comments = useQuery({
        ...chartCommentsOptions(
            contribution?.chartId ?? 0,
            contribution?.initialComments ?? []
        ),
        enabled: Boolean(contribution),
    }).data;
    const markers = useMemo(
        () =>
            comments
                .filter((comment) => !comment.resolved)
                .map((comment) => comment.timeMs),
        [comments]
    );
    const browserSupport = useSyncExternalStore(
        subscribeBrowserSupport,
        getBrowserSupportSnapshot,
        getServerBrowserSupportSnapshot
    );
    const effectiveViewMode =
        browserSupport === "supported" ? viewMode : "sheet";
    const playbackDurationMs = useMemo(
        () => getChartPlaybackDurationMs(document),
        [document]
    );
    const contentEndMs = useMemo(() => chartContentEnd(document), [document]);
    const panels = useMemo(
        () =>
            getMeasurePanels(
                document.timingPoints,
                document.ticksPerQuarter,
                contentEndMs,
                4,
                { completeLastPanel: true }
            ),
        [contentEndMs, document.ticksPerQuarter, document.timingPoints]
    );
    const measureMarkers = useMemo(
        () =>
            getMeasureMarkers(
                document.timingPoints,
                document.ticksPerQuarter,
                panels.at(-1)?.endMs ?? contentEndMs
            ),
        [contentEndMs, document.ticksPerQuarter, document.timingPoints, panels]
    );

    const helpText =
        browserSupport === "safari"
            ? t("chart.safariHelp")
            : effectiveViewMode === "falling"
              ? t("chart.fallingHelp")
              : t("chart.sheetHelp");
    const difficultyClass = `nl-level--${difficulty.toLowerCase()}`;
    // 의견 시각 누름 · 주소 `?t=` — 낙하형으로 그 시각에 서고, 캔버스가 보이게 올린다. 주소는 공유용으로 바꿔 둔다
    const seekTo = (timeMs: number) => {
        if (browserSupport === "supported") setViewMode("falling");
        setSeekRequest({ timeMs, key: Date.now() });
        clock.set(timeMs);
        const url = new URL(window.location.href);
        url.searchParams.set("t", timeParam(timeMs));
        window.history.replaceState(
            window.history.state,
            "",
            `${url.pathname}${url.search}`
        );
        stageRef.current?.scrollIntoView({ block: "start" });
    };
    const links = contribution ? (
        <div className="nl-chart-viewer__links">
            <ChartDraftEntry
                chartId={contribution.chartId}
                draftHref={contribution.draftHref}
                loginHref={contribution.loginHref}
                signedIn={contribution.signedIn}
                label={t("contribution.entry.edit")}
                className="nl-heading-link nl-control"
                chevron={<ChevronRight aria-hidden />}
            />
            {source?.extracted ? sourceDialog() : null}
        </div>
    ) : source?.extracted ? (
        sourceDialog()
    ) : null;
    const metadata = (
        <p className="nl-metadata nl-muted">
            {t("chart.noteCount", {
                count: document.notes.length.toLocaleString(numberLocale),
            })}
            {revision === null
                ? ""
                : ` · ${t(
                      preview
                          ? "chart.savedRevision"
                          : "chart.publishedRevision",
                      { revision }
                  )}`}
            {" · "}
            {formatEditorTime(playbackDurationMs)}
        </p>
    );

    function sourceDialog() {
        if (!source) return null;
        return (
            <ModalDialog
                open={sourceOpen}
                onOpenChange={setSourceOpen}
                title={t("chart.source.title")}
                trigger={
                    <button
                        type="button"
                        className="nl-heading-link nl-control"
                    >
                        {t("chart.source.open")}
                        <ChevronRight aria-hidden />
                    </button>
                }
            >
                <dl className="nl-chart-viewer__sources">
                    <div>
                        <dt className="nl-metadata nl-muted">
                            {t("chart.source.chart")}
                        </dt>
                        <dd>
                            {source.author ? (
                                <p className="nl-chart-viewer__byline nl-body-secondary">
                                    {source.author.name}
                                    <ContributionLabel
                                        label={source.author.label}
                                    />
                                </p>
                            ) : null}
                            {revision !== null && source.publishedAt ? (
                                <p className="nl-metadata nl-muted">
                                    {t(
                                        source.publisher
                                            ? "chart.source.publishedBy"
                                            : "chart.source.published",
                                        {
                                            revision,
                                            name: source.publisher?.name ?? "",
                                            date: new Intl.DateTimeFormat(
                                                numberLocale,
                                                { dateStyle: "medium" }
                                            ).format(
                                                new Date(source.publishedAt)
                                            ),
                                        }
                                    )}
                                </p>
                            ) : null}
                        </dd>
                    </div>
                    <div>
                        <dt className="nl-metadata nl-muted">
                            {t("chart.source.notes")}
                        </dt>
                        <dd>
                            <p className="nl-body-secondary">
                                {t("chart.source.notesBody")}
                            </p>
                            <p className="nl-body-secondary">
                                {t("chart.source.tool")}
                            </p>
                            <p className="nl-metadata">
                                <a
                                    href={VID2BMAP_PAPER_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="nl-link nl-text-link--underlined"
                                >
                                    {t("chart.source.paper")}
                                </a>
                                {" · "}
                                <a
                                    href={VID2BMAP_GITHUB_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="nl-link nl-text-link--underlined"
                                >
                                    GitHub
                                </a>
                            </p>
                        </dd>
                    </div>
                </dl>
            </ModalDialog>
        );
    }

    return (
        <PageContainer className="noslog-ui nl-chart-viewer">
            <BackLink href={backHref}>{t("chart.back")}</BackLink>
            <header className="nl-chart-viewer__head">
                <div className="nl-chart-viewer__title-row">
                    <h1 className="nl-page-title">{title}</h1>
                    <span className={`nl-control ${difficultyClass}`}>
                        {difficulty} · Lv {level}
                    </span>
                    {preview ? (
                        <span className="nl-metadata nl-muted">
                            {t("chart.preview")}
                        </span>
                    ) : null}
                </div>
                {localizedTitle ? (
                    <p className="nl-body-secondary nl-muted">
                        {localizedTitle}
                    </p>
                ) : null}
                <p className="nl-body-secondary">
                    {artist ?? t("chart.unknownArtist")}
                </p>
                {source?.author ? (
                    <p className="nl-chart-viewer__byline nl-body-secondary">
                        {t("chart.source.author", { name: source.author.name })}
                        <ContributionLabel label={source.author.label} />
                    </p>
                ) : null}
                {/* 영상 추출이 아니면 링크(「고치기 ›」)는 메타 줄 오른쪽 끝, 영상 추출이면 출처 줄 오른쪽 끝(2026-09-24 A1) */}
                {links && !source?.extracted ? (
                    <div className="nl-chart-viewer__source">
                        {metadata}
                        {links}
                    </div>
                ) : (
                    metadata
                )}
                {source?.extracted ? (
                    <div className="nl-chart-viewer__source">
                        <span className="nl-metadata nl-muted">
                            {t("chart.source.extracted")}
                        </span>
                        {links}
                    </div>
                ) : null}
            </header>

            <div className="nl-chart-viewer__controls">
                <SegmentedControl
                    label={t("chart.viewMode")}
                    value={effectiveViewMode}
                    onValueChange={setViewMode}
                    options={[
                        {
                            value: "falling",
                            label: t("chart.falling"),
                            disabled: browserSupport !== "supported",
                        },
                        { value: "sheet", label: t("chart.sheet") },
                    ]}
                />
                <StatusMessage
                    severity={browserSupport === "safari" ? "warning" : "info"}
                    title={helpText}
                />
                <div className="nl-chart-viewer__legend">
                    <Legend
                        color={handColors.left}
                        label={t("chart.leftHand")}
                    />
                    <Legend
                        color={handColors.right}
                        label={t("chart.rightHand")}
                    />
                    <span className="nl-metadata nl-muted nl-chart-viewer__layout">
                        {t("chart.layout")}
                    </span>
                </div>
            </div>

            <div ref={stageRef} className="nl-chart-viewer__stage">
                {browserSupport === "checking" ? (
                    <div className="nl-chart-viewer__placeholder" aria-busy />
                ) : effectiveViewMode === "falling" ? (
                    document.notes.length === 0 ? (
                        <p className="nl-chart-viewer__placeholder nl-body-secondary nl-muted">
                            {t("chart.empty")}
                        </p>
                    ) : (
                        <FallingChartViewer
                            document={document}
                            jacketUrl={jacketUrl}
                            seekRequest={seekRequest}
                            markers={contribution ? markers : undefined}
                            onTimeChange={clock.set}
                        />
                    )
                ) : (
                    <ChartSheetStrip
                        panels={panels}
                        document={document}
                        measureMarkers={measureMarkers}
                        durationMs={playbackDurationMs}
                    />
                )}
            </div>
            {contribution ? (
                <ChartComments
                    chartId={contribution.chartId}
                    initialComments={contribution.initialComments}
                    signedIn={contribution.signedIn}
                    canModerate={contribution.canModerate}
                    returnTo={contribution.returnTo}
                    clock={clock}
                    onSeek={seekTo}
                />
            ) : null}
        </PageContainer>
    );
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <span className="nl-chart-viewer__legend-item nl-body-secondary">
            <span
                className="nl-chart-viewer__legend-dot"
                aria-hidden
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    );
}

export function drawPanel(
    context: CanvasRenderingContext2D,
    {
        startMs,
        endMs,
        document,
        measureMarkers,
    }: {
        startMs: number;
        endMs: number;
        document: ChartDocument;
        measureMarkers: MeasureMarker[];
    }
) {
    const chartHeight = PANEL_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    const laneWidth = CHART_WIDTH / CHART_LANE_COUNT;
    const panelDuration = Math.max(1, endMs - startMs);
    const chartBottom = PANEL_HEIGHT - PADDING_BOTTOM;
    const yForTime = (timeMs: number) =>
        chartBottom - ((timeMs - startMs) / panelDuration) * chartHeight;
    const yForMeasureTime = (timeMs: number) =>
        Math.min(chartBottom - PANEL_MEASURE_EDGE_INSET, yForTime(timeMs));

    context.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    context.fillStyle = "#0b0b10";
    context.fillRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);

    context.save();
    context.beginPath();
    context.rect(0, PADDING_TOP, PANEL_WIDTH, chartHeight);
    context.clip();

    for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
        const x = MEASURE_GUTTER_WIDTH + lane * laneWidth + 0.5;
        const isGroupBoundary = isChartLaneGroupBoundary(lane);
        context.strokeStyle = isGroupBoundary ? "#343441" : "#20202a";
        context.lineWidth = isGroupBoundary ? 1 : 0.5;
        context.beginPath();
        context.moveTo(x, PADDING_TOP);
        context.lineTo(x, PANEL_HEIGHT - PADDING_BOTTOM);
        context.stroke();
    }

    const beats = getBeatMarkers(
        document.timingPoints,
        document.ticksPerQuarter,
        startMs,
        endMs
    );
    for (const beat of beats) {
        if (beat.timeMs >= endMs - PANEL_BOUNDARY_EPSILON_MS) continue;
        const y =
            (beat.accent
                ? yForMeasureTime(beat.timeMs)
                : yForTime(beat.timeMs)) + 0.5;
        context.strokeStyle = beat.accent ? "#656574" : "#2a2a34";
        context.lineWidth = beat.accent ? 1.2 : 0.7;
        context.beginPath();
        context.moveTo(beat.accent ? 3 : MEASURE_GUTTER_WIDTH, y);
        context.lineTo(PANEL_WIDTH, y);
        context.stroke();
    }

    for (const note of document.notes) {
        const noteStart = tickToMilliseconds(
            note.tick,
            document.timingPoints,
            document.ticksPerQuarter
        );
        const noteEnd = tickToMilliseconds(
            note.tick + note.durationTicks,
            document.timingPoints,
            document.ticksPerQuarter
        );
        const hasDuration = noteEnd > noteStart + PANEL_BOUNDARY_EPSILON_MS;
        const overlapsPanel = hasDuration
            ? noteEnd > startMs + PANEL_BOUNDARY_EPSILON_MS &&
              noteStart < endMs - PANEL_BOUNDARY_EPSILON_MS
            : noteStart >= startMs - PANEL_BOUNDARY_EPSILON_MS &&
              noteStart < endMs - PANEL_BOUNDARY_EPSILON_MS;
        if (!overlapsPanel) continue;
        drawSheetNote(context, {
            note,
            laneWidth,
            chartLeft: MEASURE_GUTTER_WIDTH,
            yForTime,
            chartTop: PADDING_TOP,
            chartBottom,
            document,
        });
    }
    context.restore();

    context.fillStyle = "#111117";
    context.fillRect(0, 0, PANEL_WIDTH, PADDING_TOP);
    context.fillRect(
        0,
        PANEL_HEIGHT - PADDING_BOTTOM,
        PANEL_WIDTH,
        PADDING_BOTTOM
    );
    context.fillStyle = "#8e8e9a";
    context.font = "10px ui-monospace, monospace";
    context.textBaseline = "middle";
    context.fillText(
        formatEditorTime(endMs),
        MEASURE_GUTTER_WIDTH + 6,
        PADDING_TOP / 2
    );
    drawMeasureAnnotations(context, {
        markers: measureMarkers,
        startMs,
        endMs,
        yForMeasureTime,
    });
}

function drawMeasureAnnotations(
    context: CanvasRenderingContext2D,
    {
        markers,
        startMs,
        endMs,
        yForMeasureTime,
    }: {
        markers: MeasureMarker[];
        startMs: number;
        endMs: number;
        yForMeasureTime: (timeMs: number) => number;
    }
) {
    const visibleMarkers = markers.filter(
        (marker) =>
            marker.timeMs >= startMs - PANEL_BOUNDARY_EPSILON_MS &&
            marker.timeMs < endMs - PANEL_BOUNDARY_EPSILON_MS
    );

    context.save();
    context.textAlign = "left";
    for (const marker of visibleMarkers) {
        const y = yForMeasureTime(marker.timeMs) + 0.5;
        context.fillStyle = "#c2c2cc";
        context.font = "600 8px ui-monospace, monospace";
        context.textBaseline = "bottom";
        context.fillText(String(marker.measureNumber), 4, y - 2);

        let detailY = y + 2;
        context.fillStyle = "#90909d";
        context.font = "9px ui-monospace, monospace";
        context.textBaseline = "top";
        if (marker.showBpm) {
            context.fillText(`BPM ${formatBpm(marker.bpm)}`, 4, detailY);
            detailY += 10;
        }
        if (marker.showTimeSignature) {
            context.fillText(
                `${marker.numerator}/${marker.denominator}`,
                4,
                detailY
            );
        }
    }
    context.restore();
}

function drawSheetNote(
    context: CanvasRenderingContext2D,
    {
        note,
        laneWidth,
        chartLeft,
        yForTime,
        chartTop,
        chartBottom,
        document,
    }: {
        note: ChartNote;
        laneWidth: number;
        chartLeft: number;
        yForTime: (timeMs: number) => number;
        chartTop: number;
        chartBottom: number;
        document: ChartDocument;
    }
) {
    const yForTick = (tick: number) =>
        yForTime(
            tickToMilliseconds(
                tick,
                document.timingPoints,
                document.ticksPerQuarter
            )
        );
    const yForRenderedTick = (tick: number) => {
        const rawY = yForTick(tick);
        return rawY >= chartTop - PANEL_BOUNDARY_EPSILON_MS &&
            rawY <= chartBottom + PANEL_BOUNDARY_EPSILON_MS
            ? Math.min(
                  chartBottom - PANEL_NOTE_EDGE_INSET,
                  Math.max(chartTop + PANEL_NOTE_EDGE_INSET, rawY)
              )
            : rawY;
    };
    const drawHead = (
        lane: number,
        width: number,
        tick: number,
        hand: ChartHand = note.hand,
        small = false
    ) =>
        drawSheetCap(
            context,
            chartLeft + lane * laneWidth,
            yForRenderedTick(tick),
            width * laneWidth,
            handColors[hand],
            small
        );

    if (note.type === "standard") {
        drawHead(note.lane, note.width, note.tick);
        return;
    }

    if (note.type === "trill") {
        const pairLane = note.pairLane ?? note.lane;
        const pairWidth = note.pairWidth ?? note.width;
        const stepTicks = Math.max(
            1,
            Math.round(
                (document.ticksPerQuarter * 4) / (note.trillSnapDivisor ?? 8)
            )
        );
        const steps = Math.max(1, Math.ceil(note.durationTicks / stepTicks));
        for (let index = 0; index < steps; index += 1) {
            const startTick = note.tick + index * stepTicks;
            const endTick = Math.min(
                note.tick + note.durationTicks,
                startTick + stepTicks
            );
            const fromLane = index % 2 === 0 ? note.lane : pairLane;
            const fromWidth = index % 2 === 0 ? note.width : pairWidth;
            const toLane = index % 2 === 0 ? pairLane : note.lane;
            const toWidth = index % 2 === 0 ? pairWidth : note.width;
            context.save();
            context.globalAlpha = 0.78;
            context.fillStyle = handColors[note.hand];
            context.strokeStyle = "rgba(255,255,255,.42)";
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(
                chartLeft + fromLane * laneWidth + 1,
                yForRenderedTick(startTick) - 1
            );
            context.lineTo(
                chartLeft + (fromLane + fromWidth) * laneWidth - 1,
                yForRenderedTick(startTick) - 1
            );
            context.lineTo(
                chartLeft + (toLane + toWidth) * laneWidth - 1,
                yForRenderedTick(endTick) + 1
            );
            context.lineTo(
                chartLeft + toLane * laneWidth + 1,
                yForRenderedTick(endTick) + 1
            );
            context.closePath();
            context.fill();
            context.stroke();
            context.restore();
        }
        drawHead(note.lane, note.width, note.tick);
        const centerX = chartLeft + (note.lane + note.width / 2) * laneWidth;
        drawSheetDiamond(
            context,
            centerX,
            yForRenderedTick(note.tick) - 1,
            3.3,
            "#f2c75c"
        );
        drawSheetDiamond(
            context,
            centerX + 5,
            yForRenderedTick(note.tick) - 5,
            2.4,
            "#f2c75c"
        );
        return;
    }

    const points = getChartNoteRenderPoints(note);
    for (let index = 0; index < points.length - 1; index += 1) {
        const first = points[index];
        const second = points[index + 1];
        context.save();
        context.globalAlpha = 0.58;
        context.fillStyle = handColors[first.hand];
        context.strokeStyle = handColors[second.hand];
        context.lineWidth = 0.8;
        context.beginPath();
        context.moveTo(
            chartLeft + first.lane * laneWidth + 1,
            yForRenderedTick(first.tick)
        );
        context.lineTo(
            chartLeft + (first.lane + first.width) * laneWidth - 1,
            yForRenderedTick(first.tick)
        );
        context.lineTo(
            chartLeft + (second.lane + second.width) * laneWidth - 1,
            yForRenderedTick(second.tick)
        );
        context.lineTo(
            chartLeft + second.lane * laneWidth + 1,
            yForRenderedTick(second.tick)
        );
        context.closePath();
        context.fill();
        context.stroke();
        context.globalAlpha = 0.72;
        context.strokeStyle = "#f7f7f2";
        context.lineWidth = 0.9;
        context.beginPath();
        context.moveTo(
            chartLeft + (first.lane + first.width / 2) * laneWidth,
            yForRenderedTick(first.tick)
        );
        context.lineTo(
            chartLeft + (second.lane + second.width / 2) * laneWidth,
            yForRenderedTick(second.tick)
        );
        context.stroke();
        context.restore();
    }
    const capPoints =
        note.type === "glissando"
            ? getGlissandoSnapRenderPoints(note, document.ticksPerQuarter)
            : points;
    for (const point of capPoints) {
        drawHead(
            point.lane,
            point.width,
            point.tick,
            point.hand,
            point.tick !== note.tick &&
                point.tick !== note.tick + note.durationTicks
        );
    }
}

function drawSheetCap(
    context: CanvasRenderingContext2D,
    x: number,
    centerY: number,
    width: number,
    handColor: string,
    small = false
) {
    const height = small ? 3 : 4;
    const bevel = Math.min(3.5, Math.max(1, width * 0.08));
    const left = x + 1.5;
    const right = x + width - 1.5;
    const top = centerY - height / 2;
    const bottom = centerY + height / 2;

    context.save();
    context.shadowColor = handColor;
    context.shadowBlur = 2;
    context.fillStyle = "rgba(247,247,242,.96)";
    context.strokeStyle = handColor;
    context.lineWidth = 0.7;
    context.beginPath();
    context.moveTo(left + bevel, top);
    context.lineTo(right - bevel, top);
    context.lineTo(right, centerY);
    context.lineTo(right - bevel, bottom);
    context.lineTo(left + bevel, bottom);
    context.lineTo(left, centerY);
    context.closePath();
    context.fill();
    context.stroke();
    context.shadowBlur = 0;
    context.globalAlpha = 0.32;
    context.strokeStyle = handColor;
    context.lineWidth = 0.6;
    context.beginPath();
    context.moveTo(left + bevel + 1, centerY + 1);
    context.lineTo(right - bevel - 1, centerY + 1);
    context.stroke();
    context.restore();
}

function drawSheetDiamond(
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    color: string
) {
    context.save();
    context.fillStyle = color;
    context.strokeStyle = "#fff8df";
    context.lineWidth = 0.8;
    context.beginPath();
    context.moveTo(centerX, centerY - size);
    context.lineTo(centerX + size, centerY);
    context.lineTo(centerX, centerY + size);
    context.lineTo(centerX - size, centerY);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
}
