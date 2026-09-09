"use client";

import PageContainer from "@/components/layout/pageContainer";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import MetricSwitch from "@/components/ui/metricSwitch";
import CompactSelect from "@/components/ui/compactSelect";
import Pagination from "@/components/ui/pagination";
import ResultState from "@/components/ui/resultState";
import Button from "@/components/ui/Button";
import PlayerRankingRow from "./playerRankingRow";
import RankingPersonalPosition from "./rankingPersonalPosition";
import useGlobalRankings from "@/features/rankings/hooks/useGlobalRankings";
import { GLOBAL_RANKING_PAGE_SIZE } from "@/features/rankings/schemas/globalRankingSchema";
import type {
    GlobalRankingPayload,
    GlobalRankingQuery,
} from "@/features/rankings/schemas/globalRankingSchema";

export default function GlobalRankingPage({
    initialQuery,
    initialData,
    viewerId,
}: {
    initialQuery: GlobalRankingQuery;
    initialData: GlobalRankingPayload | null;
    viewerId: number | null;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const {
        query,
        controls,
        data,
        result,
        navigate,
        href,
        busy,
        retry: retryRequest,
    } = useGlobalRankings(initialQuery, initialData, viewerId);
    const totalPages = Math.max(
        1,
        Math.ceil((data?.totalCount ?? 0) / GLOBAL_RANKING_PAGE_SIZE)
    );
    const retry = (
        <Button
            appearance="foundation"
            variant="secondary"
            onClick={() => retryRequest()}
        >
            {t("common.retry")}
        </Button>
    );
    return (
        <PageContainer className="nl-global-rankings">
            <div className="nl-global-ranking-heading">
                <h1 id="global-ranking-title" className="nl-page-title">
                    {t("rankings.title")}
                </h1>
                <p className="nl-global-ranking-count nl-body-secondary nl-muted">
                    {data?.status === "available"
                        ? t("rankings.participants", {
                              count: data.totalCount.toLocaleString(locale),
                          })
                        : null}
                </p>
            </div>
            <SegmentedControl
                label={t("rankings.modeNav")}
                value={controls.mode}
                onValueChange={(mode) =>
                    navigate({ ...controls, mode, page: 1 })
                }
                options={[
                    { value: "basic", label: "Basic" },
                    { value: "recital", label: "Recital" },
                ]}
            />
            <div className="nl-global-ranking-controls">
                <MetricSwitch
                    label={t("rankings.metricNav")}
                    value={controls.metric}
                    onValueChange={(metric) =>
                        navigate({ ...controls, metric, page: 1 })
                    }
                    options={[
                        {
                            value: "grade",
                            label: t("rankings.metric.grade"),
                            shortLabel: "Grd",
                        },
                        {
                            value: "rating",
                            label: t("rankings.metric.rating"),
                            shortLabel: "Rating",
                        },
                    ]}
                />
                <CompactSelect
                    outlined
                    label={t("rankings.regionNav")}
                    value={controls.region}
                    onValueChange={(region) =>
                        navigate({ ...controls, region, page: 1 })
                    }
                    options={[
                        { value: "all", label: t("rankings.region.all") },
                        { value: "kr", label: t("country.korea") },
                        { value: "jp", label: t("country.japan") },
                        { value: "global", label: t("rankings.region.other") },
                    ]}
                />
            </div>
            <section
                id="global-ranking-results"
                aria-labelledby="global-ranking-title"
                aria-busy={busy}
                tabIndex={-1}
                className="nl-global-ranking-content"
                data-personal={
                    data?.currentUser &&
                    !data.rows.some((row) => row.id === data.viewerId)
                        ? "off-page"
                        : undefined
                }
            >
                {result.isError ? (
                    <ResultState
                        message={t("rankings.loadError")}
                        error
                        action={retry}
                    />
                ) : busy && data ? (
                    <p
                        className="nl-global-ranking-message nl-body-secondary nl-muted"
                        role="status"
                    >
                        {t("rankings.updating")}
                    </p>
                ) : null}
                {!data && result.isError ? null : !data ? (
                    <div className="nl-global-ranking-initial">
                        {!result.isError ? (
                            <p
                                className="nl-body-secondary nl-muted"
                                role="status"
                            >
                                {t("rankings.loadingInitial")}
                            </p>
                        ) : null}
                    </div>
                ) : data.status === "unavailable" ? (
                    <ResultState
                        message={t("rankings.ratingUnavailable")}
                        action={
                            <Button
                                appearance="foundation"
                                variant="secondary"
                                onClick={() =>
                                    navigate({
                                        ...query,
                                        metric: "grade",
                                        page: 1,
                                    })
                                }
                            >
                                {t("rankings.showOfficialGrade")}
                            </Button>
                        }
                    />
                ) : !data.totalCount ? (
                    <ResultState message={t("rankings.empty")} />
                ) : (
                    <>
                        <RankingPersonalPosition
                            data={data}
                            returnTo={href(query)}
                            pageHref={(page) => href({ ...data.query, page })}
                            busy={busy}
                            onMyPosition={(page, id) =>
                                navigate(
                                    { ...data.query, page },
                                    `ranking-player-${id}`
                                )
                            }
                        />
                        <ol
                            className="nl-global-ranking-list"
                            start={
                                (data.page - 1) * GLOBAL_RANKING_PAGE_SIZE + 1
                            }
                        >
                            {data.rows.map((row) => (
                                <PlayerRankingRow
                                    key={row.id}
                                    row={row}
                                    query={data.query}
                                    current={row.id === data.viewerId}
                                />
                            ))}
                        </ol>
                    </>
                )}
            </section>
            {data?.status === "available" ? (
                <Pagination
                    page={data.page}
                    totalPages={totalPages}
                    onPageChange={(page) =>
                        navigate(
                            { ...data.query, page },
                            "global-ranking-results"
                        )
                    }
                    pageHref={(page) => href({ ...data.query, page })}
                    label={t("rankings.pagination")}
                    pageLabel={(page) => t("rankings.pageLabel", { page })}
                    previousLabel={t("common.previousPage")}
                    nextLabel={t("common.nextPage")}
                    busy={busy}
                />
            ) : null}
            <p className="sr-only" aria-live="polite" aria-atomic="true">
                {data?.status === "available" && !busy && !result.isError
                    ? t("rankings.resultAnnouncement", {
                          start: data.totalCount
                              ? (data.page - 1) * GLOBAL_RANKING_PAGE_SIZE + 1
                              : 0,
                          end: Math.min(
                              data.page * GLOBAL_RANKING_PAGE_SIZE,
                              data.totalCount
                          ),
                          count: data.totalCount,
                      })
                    : ""}
            </p>
        </PageContainer>
    );
}
