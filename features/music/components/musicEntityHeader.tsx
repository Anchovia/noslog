"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ChartDraftEntry from "@/features/contributions/components/chartDraftEntry";
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { rankAssetNames } from "@/components/music/musicDetailConfig";
import MusicJacket from "@/components/music/musicJacket";
import type {
    ChartDetail,
    Difficulty,
    MusicInfo,
    UserPlayData,
} from "@/components/music/musicDetailTypes";
import StatStrip from "@/components/ui/statStrip";
import {
    GRADE_PROGRESS_STOPS,
    gradeProgressColor,
} from "@/lib/music/gradeProgressColor";
import { getGradeProgress, getMaxBasicGrade } from "@/lib/music/maxGrade";
import { tierValueColor } from "@/lib/music/tierValueColor";
import { tierGoalLabels } from "@/lib/tiers";
import { cn } from "@/lib/utils";

interface TitleFit {
    titleCut: boolean;
    translationCut: boolean;
    artistCut: boolean;
}
const initialFit: TitleFit = {
    titleCut: false,
    translationCut: false,
    artistCut: false,
};
const sameFit = (a: TitleFit, b: TitleFit) =>
    a.titleCut === b.titleCut &&
    a.translationCut === b.translationCut &&
    a.artistCut === b.artistCut;

/** 접힌 머리의 한 줄 글자(제목 · 번역 · 아티스트)가 넘치는지 — 넘치면 끝 페이드 + 펼치기 */
function measureCopy(copy: HTMLElement): TitleFit {
    const overflows = (selector: string) => {
        const element = copy.querySelector<HTMLElement>(selector);
        if (!element) return false;
        const previous = element.style.whiteSpace;
        element.style.whiteSpace = "nowrap";
        const result = element.scrollWidth > element.clientWidth + 1;
        element.style.whiteSpace = previous;
        return result;
    };
    return {
        titleCut: overflows(".nl-music-entity__title"),
        translationCut: overflows(".nl-music-entity__translation"),
        artistCut: overflows(".nl-music-entity__artist"),
    };
}

/**
 * 악곡 상세 머리 — 자켓 80 · 제목 · 아티스트(1056 미만은 가로, 1056+ 는 왼쪽 열에 세로).
 * 수치 상자 = 위 그레이드 줄 · 공식 레벨 + 공개 서열 값 · 아래 채보 보기 / 플레이 영상 칸(없으면 흐리게) (2026-09-16 · 09-18)
 */
export default function MusicEntityHeader({
    music,
    difficulty,
    chart,
    pending = false,
    record = null,
    signedIn = false,
    loginHref,
    children,
}: {
    music: MusicInfo;
    difficulty: Difficulty;
    chart: ChartDetail | null;
    pending?: boolean;
    /** 선택한 채보의 내 최고 기록 — 제목 옆 등급 아이콘 · 수치 상자 맨 위 「그레이드」 줄 */
    record?: Pick<
        UserPlayData,
        "score" | "rank" | "fc_type" | "grade_basic"
    > | null;
    signedIn?: boolean;
    loginHref: string;
    /** 난이도 세그먼트 — 자켓 · 제목 아래, 수치 띠 위 */
    children?: ReactNode;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const [expanded, setExpanded] = useState(false);
    const [fit, setFit] = useState<TitleFit>(initialFit);
    const identity = useRef<HTMLDivElement>(null);
    // 곡이 바뀌면 접힌 상태로
    const [shown, setShown] = useState(music.index);
    if (shown !== music.index) {
        setShown(music.index);
        setExpanded(false);
    }
    useLayoutEffect(() => {
        const element = identity.current;
        if (!element) return;
        const measure = () => {
            const next = measureCopy(element);
            setFit((current) => (sameFit(current, next) ? current : next));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        void document.fonts.ready.then(measure);
        return () => observer.disconnect();
    }, [music.title, music.artist, music.localizedTitle, record, pending]);
    const video =
        chart?.play_video_url && /^https?:\/\//i.test(chart.play_video_url)
            ? chart.play_video_url
            : null;
    const chevron = (
        <ChevronRight className="nl-action-group__chevron" aria-hidden />
    );
    // 없는 동작도 자리는 두고 흐리게(누를 수 없음) — 난이도를 바꿔도 줄이 흔들리지 않게 (2026-09-17)
    const unavailable = (key: string, label: string) => (
        <span key={key} className="nl-action-group__item" aria-disabled="true">
            {label}
            {chevron}
        </span>
    );
    const actions = [
        !pending && chart?.has_published_pattern ? (
            <Link
                key="chart"
                href={href(
                    `/music/${music.index}/${difficulty.toLowerCase()}/pattern`
                )}
                className="nl-action-group__item"
            >
                {t("detail.viewChart")}
                {chevron}
            </Link>
        ) : !pending && chart ? (
            // 공개 채보가 없으면 「채보 만들기 ›」 — 내 초안이 있으면 그 상태(2026-09-24 A1)
            <ChartDraftEntry
                key="chart"
                chartId={chart.id}
                signedIn={signedIn}
                draftHref={href(
                    `/music/${music.index}/${difficulty.toLowerCase()}/pattern/draft`
                )}
                loginHref={href(
                    `/login?returnTo=${encodeURIComponent(
                        href(
                            `/music/${music.index}/${difficulty.toLowerCase()}/pattern/draft`
                        )
                    )}`
                )}
                label={t("contribution.entry.create")}
                className="nl-action-group__item"
                chevron={chevron}
            />
        ) : (
            unavailable("chart", t("detail.viewChart"))
        ),
        !pending && video ? (
            <a key="video" href={video} className="nl-action-group__item">
                {t("detail.playVideo")}
                {chevron}
            </a>
        ) : (
            unavailable("video", t("detail.playVideo"))
        ),
    ];
    const constant = music.constants?.[difficulty];
    // 내 스코어 등급 = 제목 글자 끝 8 뒤 공식 아이콘(기록 있을 때만, 펼치면 숨김) (2026-09-18)
    // 바꾸는 동안에도 이전 기록을 둔다 — 값은 수치 상자 data-pending 으로 흐린 색 (2026-09-18)
    const shownRecord = record;
    const medal = shownRecord
        ? shownRecord.fc_type === 3 || shownRecord.score >= 1_000_000
            ? "p"
            : rankAssetNames[shownRecord.rank.toUpperCase()]
        : undefined;
    // 그레이드 줄 — 위 「그레이드」(control) · 내 Grd(정수 24 · 소수 16, 막대 위치 색) / 최대 Grd(Pianist 색, 모르면 흐린 —),
    // 아래 진행 막대(0 → 최대, 등급 색 그라데이션 · 최대값을 모르면 빈 트랙) (2026-09-18 Q3)
    const formatGrade = (grade: number) => (grade / 100).toFixed(2).split(".");
    const [grdWhole, grdFraction] = shownRecord
        ? formatGrade(shownRecord.grade_basic)
        : [];
    const maxGrade = getMaxBasicGrade(constant, chart?.note_count, difficulty);
    const progress = getGradeProgress(shownRecord?.grade_basic, maxGrade);
    const myBest = (
        <div className="nl-my-best" role="group" aria-label={t("detail.grade")}>
            <div className="nl-my-best__row">
                <span className="nl-control">{t("detail.grade")}</span>
                {shownRecord ? (
                    <span className="nl-my-best__grd">
                        <span
                            className="nl-my-best__grd-value"
                            style={
                                maxGrade === null
                                    ? undefined
                                    : { color: gradeProgressColor(progress) }
                            }
                        >
                            {grdWhole}
                            <span className="nl-my-best__grd-fraction">
                                .{grdFraction}
                            </span>
                        </span>
                        <span className="nl-body-secondary nl-muted nl-my-best__grd-max">
                            /{" "}
                            {maxGrade === null ? (
                                "—"
                            ) : (
                                <span className="nl-my-best__grd-max-value">
                                    {formatGrade(maxGrade).join(".")}
                                </span>
                            )}
                        </span>
                    </span>
                ) : !signedIn ? (
                    <Link
                        className="nl-heading-link nl-control"
                        href={loginHref}
                    >
                        {t("detail.myBestLogin")}
                        <ChevronRight aria-hidden />
                    </Link>
                ) : (
                    <span className="nl-body nl-muted">—</span>
                )}
            </div>
            <div
                className="nl-bar-list__track nl-grade-progress"
                aria-hidden="true"
            >
                {progress > 0 ? (
                    <span
                        className="nl-grade-progress__fill nl-chart-reveal nl-chart-bar"
                        style={
                            {
                                "--nl-grade-progress": progress,
                                "--nl-grade-progress-stops":
                                    GRADE_PROGRESS_STOPS,
                            } as CSSProperties
                        }
                    />
                ) : null}
            </div>
        </div>
    );
    const collapsed = !expanded;
    const truncated = fit.titleCut || fit.translationCut || fit.artistCut;
    return (
        <div className="nl-music-entity">
            <div className="nl-music-entity__identity">
                <MusicJacket
                    index={music.index}
                    title={music.title}
                    background={music.background}
                    appearance="foundation"
                />
                {/* 제목 · 번역 · 아티스트 모두 한 줄, 넘치면 끝 페이드 — 누르면 모두 펼침. 등급은 제목 한 줄 높이(32 · 40)로 제목 글자 끝 8 뒤, 펼치면 숨김 (2026-09-18) */}
                <div
                    ref={identity}
                    className="nl-music-entity__copy"
                    data-expanded={expanded || undefined}
                >
                    {/* 카테고리 = 제목 바로 위 왼쪽 (자켓 위 겹침에서 이동 · 2026-09-17) */}
                    <span
                        className="nl-jacket__category nl-metadata nl-music-entity__category"
                        lang="en"
                        data-category={music.category_short}
                    >
                        {music.category_short}
                    </span>
                    <div
                        className="nl-music-entity__heading"
                        data-grade={collapsed && medal ? "" : undefined}
                    >
                        <div className="nl-music-entity__title-row">
                            <h1
                                className={cn(
                                    "nl-page-title nl-music-entity__title",
                                    collapsed && fit.titleCut && "nl-fade-end"
                                )}
                                tabIndex={-1}
                            >
                                {music.title}
                            </h1>
                            {collapsed && medal ? (
                                <Image
                                    src={`/grade/grade_${medal}.png`}
                                    alt={t("music.record.rankLabel", {
                                        rank:
                                            medal === "p"
                                                ? "P"
                                                : shownRecord!.rank,
                                    })}
                                    width={40}
                                    height={40}
                                    className="nl-music-entity__grade"
                                />
                            ) : null}
                        </div>
                        {music.localizedTitle ? (
                            <p
                                className={cn(
                                    "nl-body-secondary nl-music-entity__translation",
                                    collapsed &&
                                        fit.translationCut &&
                                        "nl-fade-end"
                                )}
                                lang={locale}
                            >
                                {music.localizedTitle}
                            </p>
                        ) : null}
                    </div>
                    <p
                        className={cn(
                            "nl-body-secondary nl-muted nl-music-entity__artist",
                            collapsed && fit.artistCut && "nl-fade-end"
                        )}
                    >
                        {music.artist || t("music.unknownArtist")}
                    </p>
                    {truncated ? (
                        <button
                            type="button"
                            className="nl-music-entity__expand"
                            aria-expanded={expanded}
                            aria-label={t(
                                expanded
                                    ? "detail.collapseTitle"
                                    : "detail.expandTitle"
                            )}
                            onClick={() => setExpanded((value) => !value)}
                        />
                    ) : null}
                </div>
            </div>
            {children}
            <StatStrip
                className="nl-music-entity__stats nl-stat-strip--wide-list"
                label={t("music.difficulty")}
                pending={pending}
                items={[
                    // 공식 레벨이 없으면(새 Real 채보 등) 칸은 두고 흐린 「—」 (2026-09-18)
                    constant !== null && constant !== undefined
                        ? {
                              key: "constant",
                              label: t("music.info.levelConstant"),
                              value: constant.toFixed(1),
                              color: tierValueColor(constant),
                          }
                        : {
                              key: "constant",
                              label: t("music.info.levelConstant"),
                              value: <span className="nl-muted">—</span>,
                          },
                    ...(chart?.tierValues ?? []).map((entry) =>
                        entry.value === null
                            ? null
                            : {
                                  key: `${entry.mode}:${entry.goal}`,
                                  label:
                                      entry.mode === "recital"
                                          ? "Recital"
                                          : tierGoalLabels[entry.goal],
                                  value: entry.value.toFixed(1),
                                  // 서열 값 = 구간 색 그라데이션 (2026-09-17 G1)
                                  color: tierValueColor(entry.value),
                              }
                    ),
                ]}
                header={myBest}
                // 채보 보기 · 플레이 영상 = 같은 상자 아래 칸, 반반 · 글자 + › · 없는 쪽은 흐리게 (2026-09-17 I1C)
                footer={
                    <div className="nl-action-group nl-music-entity__actions">
                        {actions}
                    </div>
                }
            />
        </div>
    );
}
