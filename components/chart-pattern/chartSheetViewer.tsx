"use client";

import { Info, Pencil, Share2 } from "lucide-react";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";
import BackLink from "@/components/ui/back-link";
import { useMemo, useRef, useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import PageContainer from "@/components/layout/page-container";
import Avatar from "@/components/ui/avatar";
import { foundationButtonClass } from "@/components/ui/button";
import ModalDialog from "@/components/ui/modal-dialog";
import { SegmentedControl } from "@/components/ui/segmented-control";
import ChartComments, {
    ChartCommentStageEntry,
    chartCommentsOptions,
    useChartCommentDraft,
} from "@/features/contributions/components/chart-comments";
import ChartDraftEntry from "@/features/contributions/components/chart-draft-entry";
import ContributionLabel from "@/features/contributions/components/contribution-label";
import type { NameLabel } from "@/features/contributions/contribution-level";
import type { ChartCommentItem } from "@/features/contributions/server/chart-comment-service";
import { getChartPlaybackDurationMs } from "@/lib/chart-pattern/playback";
import { type ChartDocument, type ChartHand } from "@/lib/chart-pattern/schema";
import {
    formatEditorTime,
    getMeasureMarkers,
    getMeasurePanels,
    tickToMilliseconds,
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
    preview?: boolean;
    /** 출처 표기(2026-09-24 C2) — 공개 채보만. extracted = 영상 추출 버전에서 나온 채보 */
    source?: ChartSource;
    /** 유저 기여(2026-09-24 3단계) — 공개 채보만. 「고치기 ›」 · 「채보 의견」 구역 */
    contribution?: ChartViewerContribution;
}

interface ChartSource {
    /** 작성자 — 유저 기여 채보면 실제 작성자 + 기여 라벨(E1), 아니면 공개한 운영자 */
    author: {
        id: number | null;
        name: string;
        /** 프로필 이미지(2026-09-26 — 이름 옆 동그랗게) */
        avatar: string | null;
        label: NameLabel | null;
    } | null;
    /** 작성자와 공개한 사람이 다를 때(유저 기여 채보)만 — 출처 창에 따로 적는다 */
    publisher: { name: string } | null;
    publishedAt: string | null;
    extracted: boolean;
}

interface ChartViewerContribution {
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
    // 폰 「더보기」 창(2026-09-26 Y1, 유튜브 폰 설명 창)
    const [infoOpen, setInfoOpen] = useState(false);
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
    // 쓰기 칸 상태 — 무대 아래(1056 이상) · 의견 구역(1055 이하) 두 자리가 나눠 쓴다(2026-10-15 L2)
    const commentDraft = useChartCommentDraft(contribution?.chartId ?? 0);
    const markers = useMemo(
        () =>
            comments
                .filter((comment) => !comment.resolved)
                .map((comment) => comment.timeMs),
        [comments]
    );
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

    const difficultyClass = `nl-level--${difficulty.toLowerCase()}`;
    // 의견 시각 누름 · 주소 `?t=` — 낙하형으로 그 시각에 서고, 캔버스가 보이게 올린다. 주소는 공유용으로 바꿔 둔다
    const seekTo = (timeMs: number) => {
        setViewMode("falling");
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
    // 무대 아래 동작 버튼(2026-09-26 A, 유튜브 채널 줄의 버튼 자리) — 고치기 · 출처(영상 추출만) · 공유
    const actionClass = foundationButtonClass({ variant: "secondary" });
    async function copyLink() {
        const url = new URL(window.location.href);
        url.searchParams.delete("t");
        try {
            await navigator.clipboard.writeText(url.href);
            toast.success(t("tiers.linkCopied"));
        } catch {
            toast.error(t("tiers.linkCopyFailed"));
        }
    }
    // 넓은 화면 = 기본 크기 보조 버튼 아이콘+글자, 폰 = 글자 없는 아이콘 버튼(유튜브 폰 동작 줄 — 이름은 스크린리더 · 툴팁)
    function renderActions(compact: boolean) {
        const iconClass = foundationButtonClass({
            variant: "ghost",
            size: "icon",
        });
        return (
            <div className="nl-chart-viewer__actions">
                {contribution ? (
                    <ChartDraftEntry
                        chartId={contribution.chartId}
                        draftHref={contribution.draftHref}
                        loginHref={contribution.loginHref}
                        signedIn={contribution.signedIn}
                        label={t("contribution.entry.edit")}
                        className={compact ? iconClass : actionClass}
                        icon={<Pencil className="nl-icon" aria-hidden />}
                        iconOnly={compact}
                    />
                ) : null}
                {/* 폰은 출처를 「더보기」 창 끝에 합친다(2026-09-26 M1) — ⓘ 는 넓은 화면만 */}
                {source?.extracted && !compact ? (
                    <button
                        type="button"
                        className={compact ? iconClass : actionClass}
                        onClick={() => setSourceOpen(true)}
                        aria-label={
                            compact ? t("chart.source.open") : undefined
                        }
                        title={compact ? t("chart.source.open") : undefined}
                    >
                        <Info className="nl-icon" aria-hidden />
                        {compact ? null : t("chart.source.open")}
                    </button>
                ) : null}
                {preview ? null : (
                    <button
                        type="button"
                        className={compact ? iconClass : actionClass}
                        onClick={() => void copyLink()}
                        aria-label={compact ? t("chart.share") : undefined}
                        title={compact ? t("chart.share") : undefined}
                    >
                        <Share2 className="nl-icon" aria-hidden />
                        {compact ? null : t("chart.share")}
                    </button>
                )}
            </div>
        );
    }
    // 작성자 — 동그란 프로필 이미지 + 이름 + 기여 라벨(2026-09-26, 사용자)
    function renderAuthor(prefixed: boolean) {
        if (!source?.author) return null;
        return (
            <p className="nl-chart-viewer__byline nl-body-secondary">
                <Avatar
                    src={source.author.avatar}
                    size="compact"
                    fallbackName={source.author.name}
                />
                {prefixed
                    ? t("chart.source.author", { name: source.author.name })
                    : source.author.name}
                <ContributionLabel label={source.author.label} />
            </p>
        );
    }
    const metadata = (
        <p className="nl-body-secondary">
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

    // 출처 — 채보(작성자 · 공개 버전 · 날짜) · 노트 배치(영상 추출만). 넓은 화면 「출처 보기」 창과 폰 「더보기」 창 끝이 같이 쓴다
    function sourceDetails() {
        if (!source) return null;
        return (
            <dl className="nl-chart-viewer__sources">
                <div>
                    <dt className="nl-metadata nl-muted">
                        {t("chart.source.chart")}
                    </dt>
                    <dd>
                        {renderAuthor(false)}
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
                                        ).format(new Date(source.publishedAt)),
                                    }
                                )}
                            </p>
                        ) : null}
                    </dd>
                </div>
                {source.extracted ? (
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
                ) : null}
            </dl>
        );
    }

    function sourceDialog() {
        if (!source) return null;
        return (
            <ModalDialog
                open={sourceOpen}
                onOpenChange={setSourceOpen}
                title={t("chart.source.title")}
            >
                {sourceDetails()}
            </ModalDialog>
        );
    }

    return (
        <PageContainer
            className="noslog-ui nl-chart-viewer nl-stack nl-stack--24"
            data-comment-entry={contribution ? "" : undefined}
        >
            <BackLink href={backHref}>{t("chart.back")}</BackLink>
            {/* 무대 먼저(2026-09-26 A, 유튜브 시청 페이지) — 조작은 무대 위에 겹치고, 곡 정보 · 동작은 무대 아래.
                보기 방식 세그먼트는 무대 바로 위에 늘 보이게(2026-09-26 V1 — 조작 줄 아이콘은 안 보여 되돌림) */}
            <div className="nl-stack nl-stack--12">
                <SegmentedControl
                    label={t("chart.viewMode")}
                    value={viewMode}
                    onValueChange={setViewMode}
                    options={[
                        { value: "falling", label: t("chart.falling") },
                        { value: "sheet", label: t("chart.sheet") },
                    ]}
                />
                <div
                    ref={stageRef}
                    className="nl-chart-viewer__stage"
                    data-view={viewMode}
                >
                    {viewMode === "falling" ? (
                        document.notes.length === 0 ? (
                            <p className="nl-chart-viewer__placeholder nl-body-secondary nl-muted">
                                {t("chart.empty")}
                            </p>
                        ) : (
                            <FallingChartViewer
                                document={document}
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
                {/* 쓰기 줄은 무대 바로 아래(2026-10-15 L2, SoundCloud · 니코니코) — 재생을 보면서 쓴다. 1055 이하는 의견 구역 안 */}
                {contribution ? (
                    <ChartCommentStageEntry
                        signedIn={contribution.signedIn}
                        returnTo={contribution.returnTo}
                        draft={commentDraft}
                        clock={clock}
                    />
                ) : null}
            </div>
            {/* 넓은 화면(1056+) 머리 — 제목 묶음 → 채보 줄(작성자 · 동작) → 정보 상자 */}
            <header className="nl-chart-viewer__head nl-stack nl-stack--12 nl-chart-viewer__head--wide">
                <div className="nl-chart-viewer__titles">
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
                </div>
                <div className="nl-chart-viewer__byline-row">
                    {renderAuthor(true)}
                    {renderActions(false)}
                </div>
                {/* 정보 상자 — 노트 수 · 버전 · 길이 → 영상 추출 → 손 범례 */}
                <div className="nl-chart-viewer__info">
                    {metadata}
                    {source?.extracted ? (
                        <p className="nl-metadata nl-muted">
                            {t("chart.source.extracted")}
                        </p>
                    ) : null}
                    <div className="nl-chart-viewer__legend">
                        <Legend hand="left" label={t("chart.leftHand")} />
                        <Legend hand="right" label={t("chart.rightHand")} />
                    </div>
                </div>
            </header>
            {/* 폰 · 태블릿 머리(2026-09-26 Y1, 유튜브 폰 시청 화면) — 제목 한 줄 → 메타 한 줄 + 「더보기」 → 작성자 · 아이콘 동작 */}
            <header className="nl-chart-viewer__head nl-stack nl-stack--12 nl-chart-viewer__head--compact">
                <div className="nl-chart-viewer__titles">
                    <h1 className="nl-page-title nl-chart-viewer__compact-title">
                        {title}
                    </h1>
                    <div className="nl-chart-viewer__compact-meta">
                        <p className="nl-metadata nl-muted">
                            <span className={difficultyClass}>
                                {difficulty} · Lv {level}
                            </span>
                            {" · "}
                            {artist ?? t("chart.unknownArtist")}
                            {" · "}
                            {t("chart.noteCount", {
                                count: document.notes.length.toLocaleString(
                                    numberLocale
                                ),
                            })}
                            {" · "}
                            {formatEditorTime(playbackDurationMs)}
                        </p>
                        <button
                            type="button"
                            className="nl-chart-viewer__more nl-metadata"
                            onClick={() => setInfoOpen(true)}
                        >
                            {t("chart.more")}
                        </button>
                    </div>
                </div>
                <div className="nl-chart-viewer__byline-row nl-chart-viewer__byline-row--compact">
                    {renderAuthor(false)}
                    {renderActions(true)}
                </div>
            </header>
            <ModalDialog
                open={infoOpen}
                onOpenChange={setInfoOpen}
                title={t("chart.info")}
            >
                <div className="nl-chart-viewer__info-sheet nl-stack">
                    <div className="nl-chart-viewer__titles">
                        <p className="nl-entity-title">{title}</p>
                        {localizedTitle ? (
                            <p className="nl-body-secondary nl-muted">
                                {localizedTitle}
                            </p>
                        ) : null}
                        <p className="nl-body-secondary">
                            <span className={`nl-control ${difficultyClass}`}>
                                {difficulty} · Lv {level}
                            </span>
                            {" · "}
                            {artist ?? t("chart.unknownArtist")}
                        </p>
                    </div>
                    <div className="nl-chart-viewer__info">
                        {metadata}
                        <div className="nl-chart-viewer__legend">
                            <Legend hand="left" label={t("chart.leftHand")} />
                            <Legend hand="right" label={t("chart.rightHand")} />
                        </div>
                    </div>
                    {/* 출처(2026-09-26 M1) — 폰은 ⓘ 창 대신 여기 */}
                    {sourceDetails()}
                </div>
            </ModalDialog>
            {sourceDialog()}
            {contribution ? (
                <ChartComments
                    chartId={contribution.chartId}
                    initialComments={contribution.initialComments}
                    signedIn={contribution.signedIn}
                    canModerate={contribution.canModerate}
                    returnTo={contribution.returnTo}
                    clock={clock}
                    draft={commentDraft}
                    onSeek={seekTo}
                />
            ) : null}
        </PageContainer>
    );
}

// 범례 점 색 = 손 토큰(--nl-hand-left · --nl-hand-right, chartViewer.css) — DOM 이라 토큰을 바로 쓴다
function Legend({ hand, label }: { hand: ChartHand; label: string }) {
    return (
        <span className="nl-chart-viewer__legend-item nl-body-secondary">
            <span
                className="nl-chart-viewer__legend-dot"
                data-hand={hand}
                aria-hidden
            />
            {label}
        </span>
    );
}
