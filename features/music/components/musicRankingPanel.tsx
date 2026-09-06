"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import Pagination from "@/components/ui/pagination";
import ScoreDistribution from "./scoreDistribution";
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
    if (!totalCount) return <p className="nl-body">{t("record.empty")}</p>;
    const returnPath = href(
        `/music/${data.music.index}/${data.difficulty.toLowerCase()}?tab=ranking${page > 1 ? `&page=${page}` : ""}`
    );
    return (
        <div className="nl-ranking-panel">
            <ScoreDistribution
                distribution={data.chartDetail.scoreDistribution}
                participants={totalCount}
            />
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
                                user.fc_type === 3 || user.score >= 1_000_000
                                    ? "P"
                                    : user.rank
                            }
                        />
                        <span className="nl-metric-value">
                            {user.score.toLocaleString(locale)}
                        </span>
                        <FullComboMark
                            fcType={user.score >= 1_000_000 ? 3 : user.fc_type}
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
                <ChartLeaderboard rows={rows} currentUserId={user?.user_id} />
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
        </div>
    );
}
