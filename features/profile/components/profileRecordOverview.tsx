"use client";

import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { ScoreGrade } from "@/features/music/components/chartLeaderboard";
import JudgementMarker, {
    judgementLabels,
} from "@/components/ui/judgementMarker";
import BarList from "@/components/ui/barList";
import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import type { ProfileStats } from "@/features/profile/schemas/profileStatsSchema";

/**
 * 「통계」 탭의 기록 구역(2026-09-26) — 랭크 분포(공식 사이트 랭크 수 + FC 막대 · 플레이 횟수, 막대 = 등급 색) · 판정 요약 · 노트 종류별 성공률.
 * 개요 옆 열에 있던 「기록 개요」 를 나눠 옮겼다(개요 옆 열은 레벨별 달성 요약)
 */
export function ProfileRankDistribution({
    user,
    privatePlayCount = null,
}: {
    user: ProfileUser;
    /** 본인에게만 — 공개 설정으로 숨긴 플레이 횟수(자물쇠와 함께, 2026-09-26 P1) */
    privatePlayCount?: number | null;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const [expanded, setExpanded] = useState(false);
    const publicPlayCount =
        user.play_count !== null && !user.hide_play_count
            ? user.play_count
            : null;
    const playCountPrivate =
        publicPlayCount === null && privatePlayCount !== null;
    const playCount = publicPlayCount ?? privatePlayCount;
    const rows = [
        { rank: "P", value: user.score_p },
        { rank: "S", value: user.score_s },
        { rank: "A+", value: user.score_a2 },
        { rank: "A", value: user.score_a },
        { rank: "B+", value: user.score_b2 },
        { rank: "B", value: user.score_b },
        { rank: "C", value: user.score_c },
        { rank: "D", value: user.score_d },
    ];
    // FC 막대(2026-09-26 D7) — FC 램프 + Pianist(= P 랭크, 프로필 카드와 같은 계산)
    const fullCombo =
        user.score_f === null && user.score_p === null
            ? null
            : (user.score_f ?? 0) + (user.score_p ?? 0);
    const shown = [
        ...(expanded ? rows : rows.slice(0, 4)),
        { rank: "FC", value: fullCombo },
    ];
    const maximum = Math.max(
        1,
        fullCombo ?? 0,
        ...rows.map((row) => row.value ?? 0)
    );
    const countWidth = `${Math.max(...shown.map((row) => (row.value?.toLocaleString(locale) ?? "—").length))}ch`;
    return (
        <section
            className="nl-profile-section nl-profile-ranks"
            aria-labelledby="profile-ranks-title"
        >
            <h2 id="profile-ranks-title" className="nl-section-title">
                {t("profile.rankDistribution")}
            </h2>
            <dl
                id="profile-rank-distribution"
                className="nl-profile-distribution"
            >
                {shown.map((row) => (
                    <div key={row.rank}>
                        <dt className="nl-full-combo-slot">
                            {row.rank === "FC" ? (
                                <span className="nl-full-combo nl-metadata">
                                    {t("profile.fullComboShort")}
                                </span>
                            ) : (
                                <ScoreGrade rank={row.rank} />
                            )}
                        </dt>
                        <dd
                            className="nl-profile-distribution__track"
                            aria-hidden
                        >
                            <span
                                className="nl-chart-reveal nl-chart-bar"
                                data-rank={row.rank}
                                style={{
                                    width: `${((row.value ?? 0) / maximum) * 100}%`,
                                }}
                            />
                        </dd>
                        <dd
                            className="nl-metric-value"
                            style={{ width: countWidth }}
                        >
                            {row.value?.toLocaleString(locale) ?? "—"}
                        </dd>
                    </div>
                ))}
            </dl>
            <button
                type="button"
                className="nl-profile-disclosure nl-control"
                aria-expanded={expanded}
                aria-controls="profile-rank-distribution"
                onClick={() => setExpanded((value) => !value)}
            >
                {t(expanded ? "profile.collapse" : "profile.showAllRanks")}
                <ChevronDown aria-hidden />
            </button>
            {playCount !== null ? (
                <dl className="nl-profile-play-count">
                    <dt className="nl-control nl-muted">
                        {t("profile.playCountLabel")}
                    </dt>
                    <dd
                        className="nl-metric-value nl-profile-play-count__value"
                        data-private={playCountPrivate || undefined}
                        title={
                            playCountPrivate ? t("profile.onlyMe") : undefined
                        }
                    >
                        {playCountPrivate ? <Lock aria-hidden /> : null}
                        {playCount.toLocaleString(locale)}
                        {playCountPrivate ? (
                            <span className="sr-only">
                                {" "}
                                ({t("profile.onlyMe")})
                            </span>
                        ) : null}
                    </dd>
                </dl>
            ) : null}
        </section>
    );
}

export function ProfileJudgementSummary({
    judgement,
}: {
    judgement: ProfileStats["judgement"];
}) {
    const locale = useLocale();
    const t = useTranslations();
    const keys = Object.keys(
        judgementLabels
    ) as (keyof typeof judgementLabels)[];
    const total = Object.values(judgement.counts).reduce(
        (sum, value) => sum + value,
        0
    );
    return (
        <section
            className="nl-profile-section nl-profile-judgement"
            aria-labelledby="profile-judgement-title"
        >
            <div className="nl-profile-judgement-header">
                <h2 id="profile-judgement-title" className="nl-section-title">
                    {t("profile.judgementSummary")}
                </h2>
                {/* 기준은 도움말로 숨기지 않고 늘 보이는 한 줄 — 부품 결정 ④ */}
                <p className="nl-metadata nl-muted">
                    {t("profile.judgementBasis", {
                        count: judgement.chartCount.toLocaleString(locale),
                    })}
                </p>
            </div>
            {total > 0 ? (
                <>
                    <div
                        className="nl-profile-judgement-stack nl-chart-reveal"
                        aria-hidden
                    >
                        {keys.map((key) => (
                            <span
                                key={key}
                                data-judgement={key}
                                className="nl-chart-bar"
                                style={{
                                    width: `${(judgement.counts[key] / total) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <dl className="nl-profile-judgements">
                        {keys.map((key) => (
                            <div key={key}>
                                <dt>
                                    <JudgementMarker judgement={key} />
                                </dt>
                                <dd className="nl-metric-value">
                                    {judgement.counts[key].toLocaleString(
                                        locale
                                    )}
                                </dd>
                                <dd className="nl-body-secondary nl-muted">
                                    {(
                                        (judgement.counts[key] / total) *
                                        100
                                    ).toLocaleString(locale, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                    })}
                                    %
                                </dd>
                            </div>
                        ))}
                    </dl>
                </>
            ) : (
                <p className="nl-body-secondary nl-muted">
                    {t("profile.judgementEmpty")}
                </p>
            )}
        </section>
    );
}

/** 노트 종류별 성공률 — 그 노트가 있는 채보의 베스트 기록 평균(막대 목록, 값 소수 한 자리) */
export function ProfileNoteRates({ notes }: { notes: ProfileStats["notes"] }) {
    const locale = useLocale();
    const t = useTranslations();
    return (
        <section
            className="nl-profile-section nl-profile-notes"
            aria-labelledby="profile-notes-title"
        >
            <div className="nl-profile-judgement-header">
                <h2 id="profile-notes-title" className="nl-section-title">
                    {t("profile.notes.title")}
                </h2>
                <p className="nl-metadata nl-muted">
                    {t("profile.notes.basis")}
                </p>
            </div>
            <BarList
                label={t("profile.notes.title")}
                max={100}
                rows={notes.map((note) => ({
                    key: note.key,
                    label: t(`music.filter.${note.key}`),
                    value: note.rate,
                    display:
                        note.rate === null
                            ? "—"
                            : `${note.rate.toLocaleString(locale, {
                                  minimumFractionDigits: 1,
                                  maximumFractionDigits: 1,
                              })}%`,
                }))}
            />
        </section>
    );
}
