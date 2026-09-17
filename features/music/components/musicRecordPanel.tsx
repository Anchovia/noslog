"use client";

import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { rankDisplayName } from "@/components/music/musicDetailConfig";
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
                <p className="nl-body-secondary nl-muted">
                    {t("record.guest")}
                </p>
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
                <p className="nl-body-secondary nl-muted">
                    {t("record.empty")}
                </p>
            </div>
        );
    const count = (value: number) => value.toLocaleString(locale);
    const pianist = record.fc_type === 3 || record.score >= 1_000_000;
    // 등급 코드(A2 · B2)는 화면 표기(A+ · B+)로
    const grade = pianist ? "P" : rankDisplayName(record.rank);
    // 순위표 FC 표시와 같은 기준(fc_type 2 이상 · Pianist)
    const fullCombo = pianist || record.fc_type >= 2;
    // 큰 숫자(32px) 대신 수치 띠 16/600 — 새 글자 단계를 만들지 않는다(2026-09-16 사용자 결정)
    return (
        <div className="nl-record-panel">
            {/* 다섯 구역이 한 목록 — 공용 펼침 규칙(구분선 · 내용 위아래 16)을 그대로 받는다 (2026-09-18 R1) */}
            <div className="nl-record-disclosures">
                {/* 핵심 수치 두 칸도 접을 수 있게 — 기본은 펼침 (2026-09-18 사용자 결정) */}
                <Disclosure heading="section" title={t("record.best")} open>
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
                                // 콤보는 숫자만 — 「x」 를 붙이지 않는다 (2026-09-18 사용자 결정)
                                value: count(record.max_combo),
                                tone: fullCombo ? "fc" : undefined,
                            },
                        ]}
                    />
                </Disclosure>
                <Disclosure
                    heading="section"
                    title={t("record.cumulative")}
                    open
                >
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
                </Disclosure>
                <JudgementAnalysis data={data} />
                <Disclosure title={t("record.progress")} heading="section">
                    <ScoreImprovementChart points={data.scoreTrend} />
                </Disclosure>
                <Disclosure
                    title={t("music.record.recentPlays")}
                    heading="section"
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
