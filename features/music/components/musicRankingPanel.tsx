"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { ChartScorePlayer } from "@/features/music/schemas/chartRankingSchema";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import Pagination from "@/components/ui/pagination";
import ScoreScatter from "./scoreScatter";
import ChartLeaderboard, {
    FullComboMark,
    ScoreGrade,
} from "./chartLeaderboard";

export default function MusicRankingPanel({
    data,
    onPageChange,
    busy = false,
    focusRequested,
    onFocused,
}: {
    data: MusicDetailProps;
    onPageChange: (page: number) => void;
    busy?: boolean;
    focusRequested?: () => boolean;
    onFocused?: () => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const list = useRef<HTMLDivElement>(null);
    const sectionId = useId();
    const previousPage = useRef(data.ranking.page);
    const { rows, page, pageSize, totalCount, userRank } = data.ranking;
    const user = data.userPlayData;
    const userOnPage = rows.some((row) => row.user_id === user?.user_id);
    useEffect(() => {
        if (!focusRequested?.() && previousPage.current === page) return;
        previousPage.current = page;
        list.current?.focus({ preventScroll: true });
        list.current?.scrollIntoView({ block: "start" });
        onFocused?.();
    }, [page, focusRequested, onFocused]);
    // 곡선 위 사진에서 고른 사람 — 이 페이지에 있으면 그 줄로, 없으면 그 페이지로 넘긴 뒤 그 줄로 (2026-09-17)
    const pendingPlayer = useRef<number | null>(null);
    const revealRow = (userId: number) => {
        const row = document.getElementById(`chart-rank-${userId}`);
        if (!row) return false;
        row.scrollIntoView({ block: "center" });
        row.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
        return true;
    };
    useEffect(() => {
        if (pendingPlayer.current === null) return;
        if (revealRow(pendingPlayer.current)) pendingPlayer.current = null;
    }, [rows]);
    const showPlayer = (player: ChartScorePlayer) => {
        const target = Math.ceil(player.row_number / pageSize);
        if (target === page && revealRow(player.user_id)) return;
        pendingPlayer.current = player.user_id;
        onPageChange(target);
    };
    if (!totalCount) return <p className="nl-body">{t("record.empty")}</p>;
    const returnPath = href(
        `/music/${data.music.index}/${data.difficulty.toLowerCase()}?tab=ranking${page > 1 ? `&page=${page}` : ""}`
    );
    return (
        <div className="nl-ranking-panel">
            <ScoreScatter
                scores={data.chartDetail.scoreSeries}
                distribution={data.chartDetail.scoreDistribution}
                participants={totalCount}
                userScore={user?.score ?? null}
                userTopPercent={data.chartDetail.userTopPercent}
                players={data.ranking.players ?? []}
                meId={user?.user_id ?? null}
                onShowPlayer={showPlayer}
            />
            <section
                className="nl-ranking-section"
                aria-labelledby={`${sectionId}-title`}
            >
                {/* 순위 구역 제목 줄 — 오른쪽 내 순위 / 참가자 (2026-09-16) */}
                <div className="nl-ranking-section__heading">
                    <h2 id={`${sectionId}-title`} className="nl-section-title">
                        {t("rankings.column.rank")}
                    </h2>
                    {user && userRank ? (
                        <span className="nl-metadata nl-muted">
                            {t("rankings.myRank")}{" "}
                            {userRank.toLocaleString(locale)} /{" "}
                            {totalCount.toLocaleString(locale)}
                        </span>
                    ) : null}
                </div>
                {!data.isLoggedIn ? (
                    <Link
                        className="nl-ranking-login nl-link nl-control"
                        href={href(
                            `/login?returnTo=${encodeURIComponent(returnPath)}`
                        )}
                    >
                        {t("ranking.signIn")}
                    </Link>
                ) : !user ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("ranking.noRank")}
                    </p>
                ) : !userOnPage ? (
                    <div className="nl-my-rank-summary">
                        <span className="nl-inline">
                            <span className="nl-body-secondary nl-muted">
                                {t("rankings.myRank")}
                            </span>
                            <span className="nl-metric-value">
                                {userRank?.toLocaleString(locale) ?? "—"} /{" "}
                                {totalCount.toLocaleString(locale)}
                            </span>
                        </span>
                        <span className="nl-my-rank-summary__result">
                            <ScoreGrade
                                rank={
                                    user.fc_type === 3 ||
                                    user.score >= 1_000_000
                                        ? "P"
                                        : user.rank
                                }
                            />
                            <span className="nl-metric-value">
                                {user.score.toLocaleString(locale)}
                            </span>
                            <FullComboMark
                                fcType={
                                    user.score >= 1_000_000 ? 3 : user.fc_type
                                }
                            />
                        </span>
                    </div>
                ) : null}
                <div
                    className="nl-ranking-list nl-stack"
                    ref={list}
                    tabIndex={-1}
                    aria-label={t("detail.ranking")}
                >
                    <span className="sr-only" role="status">
                        {t("ranking.range", {
                            first: ((page - 1) * pageSize + 1).toLocaleString(
                                locale
                            ),
                            last: Math.min(
                                page * pageSize,
                                totalCount
                            ).toLocaleString(locale),
                            total: totalCount.toLocaleString(locale),
                        })}
                    </span>
                    <ChartLeaderboard
                        rows={rows}
                        currentUserId={user?.user_id}
                    />
                    <Pagination
                        page={page}
                        totalPages={Math.ceil(totalCount / pageSize)}
                        onPageChange={onPageChange}
                        label={t("music.ranking.pagination")}
                        pageLabel={(value) =>
                            t("ranking.page", {
                                page: value.toLocaleString(locale),
                            })
                        }
                        previousLabel={t("common.previousPage")}
                        nextLabel={t("common.nextPage")}
                        busy={busy}
                    />
                </div>
            </section>
        </div>
    );
}
