"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, type ReactNode, useId, useState } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import type { MusicDetailProps } from "@/components/music/music-detail-types";
import ActionButton from "@/components/ui/action-button";
import BarList from "@/components/ui/bar-list";
import IntentLink from "@/components/ui/intent-link";
import StatStrip from "@/components/ui/stat-strip";
import { StatusMessage } from "@/components/ui/status-message";
import { myPendingChartFieldsOptions } from "@/features/contributions/api/chart-field-proposals";
import ChartFieldFactAction from "@/features/contributions/components/chart-field-fact-action";
import {
    type ChartFieldProposalField,
    chartFieldValue,
} from "@/features/contributions/schemas/chart-field-proposal-schema";
import type { PatternStrengths } from "@/features/music/lib/pattern-tendency";
import { PATTERN_STRENGTH_AXES } from "@/lib/chart-pattern/patternMetrics";
import { rankTone, scoreTone } from "@/lib/music/score-tone";

import PatternCriteriaDialog from "./pattern-criteria-dialog";
import TierHistory from "./tier-history";

/** 공개 채보가 없을 때 흐림 뒤에 둘 막대 — 읽히지 않는 자리표시라 값에 뜻이 없다 */
const PLACEHOLDER_STRENGTHS: PatternStrengths = {
    stairs: 0.6,
    repetition: 0.35,
    polyrhythm: 0.8,
    offset: 0.45,
};
const PLACEHOLDER_METER = 1;

/**
 * 개요 탭 — ① 패턴 경향(가로 막대 4줄 + 변박 칸 막대 · 제목 줄 오른쪽 기준 전환) ② 내 기록 요약 띠 ③ 채보 정보
 * ④ 서열 변경 이력(접힘). 값이 없는 구역은 두지 않는다 (2026-09-16).
 * 채보 정보의 BPM · 노트 수 · 길이 · 수록일은 비어 있어도 줄을 두고 「추가」 로 기여를 받는다(2026-09-23)
 */
export default function OverviewPanel({ data }: { data: MusicDetailProps }) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const router = useRouter();
    const chart = data.chartDetail;
    const tendency = data.patternTendency;
    const [basisAll, setBasisAll] = useState(false);
    const strengths = tendency
        ? basisAll
            ? tendency.all
            : tendency.difficulty
        : null;
    const meter = tendency ? tendency.meter : PLACEHOLDER_METER;
    const id = useId();
    const record = data.userPlayData;
    const pendingOptions = myPendingChartFieldsOptions(
        chart.id,
        data.accountId
    );
    const pending = useQuery(pendingOptions).data;
    const loginHref = href(
        `/login?returnTo=${encodeURIComponent(
            href(`/music/${data.music.index}/${data.difficulty.toLowerCase()}`)
        )}`
    );
    const facts: ({
        label: string;
        value: ReactNode;
        numeric: boolean;
        field?: ChartFieldProposalField;
    } | null)[] = [
        {
            label: "BPM",
            numeric: true,
            field: "bpm",
            value:
                chart.bpm_min === null
                    ? null
                    : chart.bpm_max !== null && chart.bpm_max !== chart.bpm_min
                      ? `${chart.bpm_min}–${chart.bpm_max}`
                      : String(chart.bpm_min),
        },
        // 공개 채보로 세는 값이라 채보가 없으면 「—」
        {
            label: t("music.info.tempoChanges"),
            numeric: true,
            value: tendency
                ? t("music.info.tempoChangesCount", {
                      count: tendency.tempoChanges.toLocaleString(locale),
                  })
                : null,
        },
        {
            label: t("music.info.noteCount"),
            numeric: true,
            field: "note_count",
            value: chart.note_count?.toLocaleString(locale) ?? null,
        },
        {
            label: t("music.info.tenutoCount"),
            numeric: true,
            value: tendency?.tenutoCount.toLocaleString(locale) ?? null,
        },
        {
            label: t("music.info.glissandoCount"),
            numeric: true,
            value: tendency?.glissandoCount.toLocaleString(locale) ?? null,
        },
        {
            label: t("music.info.trillCount"),
            numeric: true,
            value: tendency?.trillCount.toLocaleString(locale) ?? null,
        },
        {
            label: t("detail.duration"),
            numeric: true,
            field: "duration",
            value:
                chart.duration_seconds === null
                    ? null
                    : `${Math.floor(chart.duration_seconds / 60)}:${String(chart.duration_seconds % 60).padStart(2, "0")}`,
        },
        {
            label: t("music.info.releaseDate"),
            numeric: false,
            field: "released_at",
            value: chart.released_at?.slice(0, 10) ?? null,
        },
        chart.unlockSteps.length
            ? {
                  label: t("music.info.unlock"),
                  numeric: false,
                  // 한 단계 = 한 줄: 「→」 옮겨 간 이벤트 · 이 난이도의 별가루 수 (2026-09-18)
                  value: chart.unlockSteps.map((step, index) => (
                      <Fragment key={index}>
                          {index ? <br /> : null}
                          {step.requires
                              ? t("music.info.unlockRequires", {
                                    title: step.requires.title,
                                    difficulty: step.requires.difficulty,
                                })
                              : `${step.moved ? "→ " : ""}${step.name}${
                                    step.stardust !== null
                                        ? ` · ${t("music.info.stardust", {
                                              count: step.stardust.toLocaleString(
                                                  locale
                                              ),
                                          })}`
                                        : ""
                                }`}
                      </Fragment>
                  )),
              }
            : null,
    ];
    const shownFacts = facts.filter((fact) => fact !== null);
    const sourced = new Set(chart.sourced_fields ?? []);
    return (
        <div className="nl-overview">
            <section
                className="nl-overview__section"
                aria-labelledby={`${id}-pattern`}
            >
                <div className="nl-heading-row">
                    <h2 id={`${id}-pattern`} className="nl-section-title">
                        {t("pattern.title")}
                    </h2>
                    <PatternCriteriaDialog variant="computed" />
                    {tendency ? (
                        // 지금 기준을 글자로, 누르면 다른 기준 — max-scouter 패턴 경향 기준 단추와 같다
                        <ActionButton
                            variant="ghost"
                            size="sm"
                            className="nl-heading-row__end"
                            aria-label={
                                basisAll
                                    ? t("pattern.switchToDifficulty", {
                                          difficulty: data.difficulty,
                                      })
                                    : t("pattern.switchToAll")
                            }
                            onClick={() => setBasisAll((value) => !value)}
                        >
                            {basisAll
                                ? t("pattern.basisAll")
                                : t("pattern.basisDifficulty", {
                                      difficulty: data.difficulty,
                                  })}
                            <ArrowLeftRight aria-hidden />
                        </ActionButton>
                    ) : null}
                </div>
                {tendency === undefined ? (
                    <StatusMessage
                        tone="quiet"
                        severity="danger"
                        role="alert"
                        title={t("detail.error")}
                        action={
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => router.refresh()}
                            >
                                {t("common.retry")}
                            </ActionButton>
                        }
                    />
                ) : (
                    // 공개 채보가 없으면 자리표시 막대를 흐리고 그 위에 투표 잠금과 같은 카드로 이유를 둔다
                    <div
                        className="nl-pattern-lock"
                        data-locked={!strengths || undefined}
                    >
                        <div
                            className="nl-overview__card"
                            aria-hidden={!strengths || undefined}
                            inert={!strengths || undefined}
                        >
                            <BarList
                                max={1}
                                label={t("pattern.title")}
                                rows={[
                                    ...PATTERN_STRENGTH_AXES.map((axis) => {
                                        const value = (strengths ??
                                            PLACEHOLDER_STRENGTHS)[axis];
                                        return {
                                            key: axis,
                                            label: t(`pattern.axis.${axis}`),
                                            value,
                                            display:
                                                value === null
                                                    ? undefined
                                                    : `${Math.round(value * 100)}%`,
                                            // 0–4 단계 색을 25% 마다(파랑 → 하늘 → 노랑 → 주황 → 빨강)
                                            color:
                                                value === null
                                                    ? undefined
                                                    : `var(--nl-pattern-level-${Math.round(value * 4)})`,
                                        };
                                    }),
                                    {
                                        key: "chords",
                                        label: t("pattern.axis.chords"),
                                        value: meter,
                                        steps: 3,
                                        display:
                                            meter === null
                                                ? undefined
                                                : t(`pattern.meter.${meter}`),
                                        // 막대와 같은 단계 색 — 3단계를 0–4 색에 비례로 맞춘다
                                        color:
                                            meter === null
                                                ? undefined
                                                : `var(--nl-pattern-level-${Math.round((meter / 3) * 4)})`,
                                    },
                                ]}
                            />
                        </div>
                        {!strengths ? (
                            <div className="nl-pattern-lock__overlay">
                                <div className="nl-pattern-lock__card">
                                    <p className="nl-emphasis-label">
                                        {t("pattern.computedNone")}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </section>

            <section
                className="nl-overview__section"
                aria-labelledby={`${id}-record`}
            >
                {/* 로그아웃이면 구역 행동을 제목 줄 오른쪽 끝 제목 링크로 권한다(가이드 2절 · 2026-09-18) */}
                <div className="nl-heading-row">
                    <h2 id={`${id}-record`} className="nl-section-title">
                        {t("detail.record")}
                    </h2>
                    {!data.isLoggedIn ? (
                        <IntentLink
                            className="nl-heading-link nl-control"
                            href={href(
                                `/login?returnTo=${encodeURIComponent(href(`/music/${data.music.index}/${data.difficulty.toLowerCase()}`))}`
                            )}
                            aria-label={t("record.summaryGuest")}
                        >
                            {t("detail.myBestLogin")}
                            <ChevronRight aria-hidden />
                        </IntentLink>
                    ) : null}
                </div>
                {!data.isLoggedIn ? null : !record || record.score <= 0 ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("record.empty")}
                    </p>
                ) : (
                    <StatStrip
                        label={t("detail.record")}
                        items={[
                            {
                                key: "best",
                                label: t("music.record.bestScore"),
                                value: record.score.toLocaleString(locale),
                                tone: scoreTone(record.score),
                            },
                            // 순위가 없으면 칸을 만들지 않는다(수치 띠 규칙)
                            data.ranking.userRank
                                ? {
                                      key: "rank",
                                      label: t("rankings.myRank"),
                                      value: data.ranking.userRank.toLocaleString(
                                          locale
                                      ),
                                      tone: rankTone(data.ranking.userRank),
                                      unit: data.ranking.totalCount
                                          ? `/ ${data.ranking.totalCount.toLocaleString(locale)}`
                                          : undefined,
                                  }
                                : null,
                            {
                                key: "plays",
                                label: t("record.playCount"),
                                value: record.play_count.toLocaleString(locale),
                            },
                        ]}
                    />
                )}
            </section>

            {shownFacts.length ? (
                <section
                    className="nl-overview__section"
                    aria-labelledby={`${id}-facts`}
                >
                    <h2 id={`${id}-facts`} className="nl-section-title">
                        {t("detail.chartInfo")}
                    </h2>
                    {/* 면 없는 구분선 줄 목록(2026-09-28 인상 점검 A6 — 구역 제목이 이미 묶음, 줄 글자가 제목과 같은 선) */}
                    <dl className="nl-facts nl-body-secondary">
                        {shownFacts.map((fact) => (
                            <div key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd
                                    className={
                                        fact.numeric
                                            ? "nl-metric-value"
                                            : undefined
                                    }
                                >
                                    {fact.field ? (
                                        <span
                                            className="nl-facts__value"
                                            data-verified={
                                                fact.value === null ||
                                                sourced.has(fact.field)
                                                    ? undefined
                                                    : "false"
                                            }
                                        >
                                            {fact.value ?? (
                                                <span className="nl-facts__empty">
                                                    —
                                                </span>
                                            )}
                                            {/* 출처가 없는 값은 「확인 전」(2026-10-01 E2) — 추정값과 확인된 값을 구분한다 */}
                                            {fact.value !== null &&
                                            !sourced.has(fact.field) ? (
                                                <span className="nl-tag">
                                                    {t(
                                                        "contribution.unverified"
                                                    )}
                                                </span>
                                            ) : null}
                                            <ChartFieldFactAction
                                                chartId={chart.id}
                                                field={fact.field}
                                                fieldLabel={fact.label}
                                                currentValue={chartFieldValue(
                                                    chart,
                                                    fact.field
                                                )}
                                                pendingValue={
                                                    pending?.[fact.field]
                                                }
                                                signedIn={Boolean(
                                                    data.accountId
                                                )}
                                                loginHref={loginHref}
                                                queryKey={
                                                    pendingOptions.queryKey
                                                }
                                            />
                                        </span>
                                    ) : (
                                        (fact.value ?? (
                                            <span className="nl-facts__empty">
                                                —
                                            </span>
                                        ))
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ) : null}

            <TierHistory history={chart.tierHistory} />
        </div>
    );
}
