"use client";

import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import JudgementAnalysis from "./judgementAnalysis";
import RecentRecordPlay from "./recentRecordPlay";
import { foundationButtonClass } from "@/components/ui/Button";
import Disclosure from "@/components/ui/disclosure";
import StatStrip from "@/components/ui/statStrip";
import { gradeTone, scoreTone } from "@/lib/music/scoreTone";
import ScoreImprovementChart from "./scoreImprovementChart";

export default function MusicRecordPanel({ data }: { data: MusicDetailProps }) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const record = data.userPlayData;
    if (!data.isLoggedIn)
        return (
            <div className="nl-record-state">
                <p className="nl-body">{t("record.guest")}</p>
                <Link
                    className={foundationButtonClass({ variant: "primary" })}
                    href={href(
                        `/login?returnTo=${encodeURIComponent(href(`/music/${data.music.index}/${data.difficulty.toLowerCase()}?tab=record`))}`
                    )}
                >
                    {t("common.login")}
                </Link>
            </div>
        );
    if (!record || record.score <= 0)
        return (
            <div className="nl-record-state">
                <p className="nl-body">{t("record.empty")}</p>
            </div>
        );
    const count = (value: number) => value.toLocaleString(locale);
    const pianist = record.fc_type === 3 || record.score >= 1_000_000;
    const grade = pianist ? "P" : record.rank;
    // 순위표 FC 표시와 같은 기준(fc_type 2 이상 · Pianist)
    const fullCombo = pianist || record.fc_type >= 2;
    // 큰 숫자(32px) 대신 수치 띠 16/600 — 새 글자 단계를 만들지 않는다(2026-09-16 사용자 결정)
    return (
        <div className="nl-record-panel">
            <div className="nl-detail-columns">
                <section className="nl-detail-panel">
                    <h2 className="nl-section-title">{t("record.best")}</h2>
                    <StatStrip
                        label={t("record.best")}
                        items={[
                            {
                                key: "score",
                                label: t("music.record.bestScore"),
                                value: count(record.score),
                                // 값 색 = 점수 목표 색(S · 990k · Pianist), FC 는 보지 않는다 (2026-09-17)
                                tone: scoreTone(record.score),
                            },
                            {
                                key: "grade",
                                label: t("ranking.grade"),
                                value: grade,
                                tone: gradeTone(grade),
                            },
                            {
                                key: "combo",
                                label: t("music.record.maxCombo"),
                                // 콤보는 게임 표기처럼 「367x」 (2026-09-17)
                                value: `${count(record.max_combo)}x`,
                                tone: fullCombo ? "fc" : undefined,
                            },
                        ]}
                    />
                </section>
                <section className="nl-detail-panel">
                    <h2 className="nl-section-title">
                        {t("record.cumulative")}
                    </h2>
                    <StatStrip
                        label={t("record.cumulative")}
                        items={[
                            {
                                key: "plays",
                                label: t("record.playCount"),
                                value: count(record.play_count),
                            },
                            {
                                key: "fc",
                                label: t("music.record.fullCombo"),
                                value: count(record.fullcombo_count),
                            },
                            {
                                key: "pianist",
                                label: "Pianist",
                                value: count(record.pianistic_count),
                            },
                        ]}
                    />
                </section>
            </div>
            {/* 판정 분석(기본 펼침) · 성장 추이 · 최근 플레이(기본 접힘) = 구역 펼침 세 줄(사이 구분선) (2026-09-16 · 09-17 판정 분석을 맨 위로) */}
            <div className="nl-record-disclosures">
                <JudgementAnalysis data={data} />
                <Disclosure
                    title={t("record.progress")}
                    heading="section"
                    className="nl-record-progress"
                >
                    <ScoreImprovementChart points={data.scoreTrend} />
                </Disclosure>
                <Disclosure
                    title={t("music.record.recentPlays")}
                    heading="section"
                    className="nl-record-recent"
                >
                    {data.recentChartPlays.length ? (
                        <ul className="nl-recent-plays">
                            {[...data.recentChartPlays]
                                .reverse()
                                .map((play) => (
                                    <RecentRecordPlay
                                        key={play.id}
                                        play={play}
                                    />
                                ))}
                        </ul>
                    ) : (
                        <p className="nl-body-secondary nl-muted">
                            {t("music.record.noRecentPlays")}
                        </p>
                    )}
                </Disclosure>
            </div>
        </div>
    );
}
