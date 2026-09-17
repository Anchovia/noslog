"use client";

import { ChevronRight } from "lucide-react";
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
import ChartLeaderboard from "./chartLeaderboard";

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
    const { rows, page, pageSize, totalCount } = data.ranking;
    const user = data.userPlayData;
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
                players={data.ranking.players ?? []}
                meId={user?.user_id ?? null}
                onShowPlayer={showPlayer}
            />
            <section
                className="nl-ranking-section"
                aria-labelledby={`${sectionId}-title`}
            >
                {/* 제목 · 내 순위 글자는 두지 않는다 — 순위표가 스스로 말한다 (2026-09-18 사용자 결정).
                    구역 이름은 낭독용으로만 남기고, 로그아웃 때만 로그인 링크 한 줄 */}
                <h2 id={`${sectionId}-title`} className="sr-only">
                    {t("rankings.column.rank")}
                </h2>
                {!data.isLoggedIn ? (
                    <div className="nl-heading-row">
                        <Link
                            className="nl-heading-link nl-control"
                            href={href(
                                `/login?returnTo=${encodeURIComponent(returnPath)}`
                            )}
                        >
                            {t("ranking.signIn")}
                            <ChevronRight aria-hidden />
                        </Link>
                    </div>
                ) : null}
                {!data.isLoggedIn ? null : !user ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("ranking.noRank")}
                    </p>
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
