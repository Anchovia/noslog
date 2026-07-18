import Link from "next/link";
import { notFound } from "next/navigation";

import TierChartCard from "@/components/tiers/tierChartCard";
import {
    formatTierDate,
    formatTierValue,
    getTierRecordStatus,
    getTierRecommendation,
    type TierRecordStatus,
} from "@/lib/tiers";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/user";
import { getCachedTierDetail, getUserTierRecords } from "../data";

interface TierDetailPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ status?: string; recommend?: string }>;
}

type TierFilter = "all" | "pianist" | "fc" | "unplayed";

const filters: { value: TierFilter; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "pianist", label: "Pianist" },
    { value: "fc", label: "FC" },
    { value: "unplayed", label: "미플레이" },
];

function normalizeFilter(value?: string): TierFilter {
    return value === "pianist" || value === "fc" || value === "unplayed"
        ? value
        : "all";
}

export default async function TierDetailPage({
    params,
    searchParams,
}: TierDetailPageProps) {
    const [{ slug }, query] = await Promise.all([params, searchParams]);
    const [tierList, user] = await Promise.all([
        getCachedTierDetail(slug),
        getUser(),
    ]);
    const { status: requestedStatus, recommend: requestedRecommendation } =
        query;
    const status = normalizeFilter(requestedStatus);
    const recommendationEnabled = requestedRecommendation === "1";
    if (!tierList) notFound();

    const entries = tierList.bands.flatMap((band) => band.entries);
    const chartIds = entries.map((entry) => entry.chartId);
    const records = user ? await getUserTierRecords(user.id, chartIds) : [];
    const recordByChartId = new Map(
        records.flatMap((record) =>
            record.chart_id === null ? [] : [[record.chart_id, record] as const]
        )
    );
    const rawGrade = user
        ? tierList.mode === "recital"
            ? user.grade_recital
            : user.grade_basic
        : null;
    const recommendation = getTierRecommendation(rawGrade);
    const hasRecommendedBand = recommendation
        ? tierList.bands.some(
              (band) =>
                  band.value >= recommendation.min - 0.001 &&
                  band.value <= recommendation.max + 0.001
          )
        : false;
    const detailHref = (nextStatus: TierFilter) =>
        `/tiers/${tierList.slug}?${new URLSearchParams({
            ...(nextStatus === "all" ? {} : { status: nextStatus }),
            ...(recommendationEnabled ? { recommend: "1" } : {}),
        }).toString()}`.replace(/\?$/, "");
    const recommendationHref = `/tiers/${tierList.slug}?${new URLSearchParams({
        ...(status === "all" ? {} : { status }),
        ...(!recommendationEnabled ? { recommend: "1" } : {}),
    }).toString()}`.replace(/\?$/, "");

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <header className="flex flex-col gap-2">
                <h1 className="text-title">{tierList.title}</h1>
                <p className="text-text-secondary text-xs">
                    업데이트 {formatTierDate(tierList.updatedAt)}
                </p>
            </header>

            {recommendation ? (
                <section className="bg-surface rounded-card flex items-center gap-3 p-3">
                    <p className="text-text-primary min-w-0 flex-1 text-sm font-semibold">
                        추천 구간 {recommendation.min.toFixed(1)}~
                        {recommendation.max.toFixed(1)}
                    </p>
                    <Link
                        href={recommendationHref}
                        scroll={false}
                        aria-pressed={recommendationEnabled}
                        className={cn(
                            "flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors",
                            recommendationEnabled
                                ? "bg-real text-bg"
                                : "bg-surface-muted text-text-secondary"
                        )}
                    >
                        {recommendationEnabled ? "추천 끄기" : "추천 구간 보기"}
                    </Link>
                </section>
            ) : (
                <div className="bg-surface text-text-secondary rounded-card px-3 py-3 text-xs">
                    데이터 연동 후 추천 구간을 확인할 수 있습니다.
                </div>
            )}

            {user ? (
                <nav className="flex gap-2" aria-label="기록 상태">
                    {filters.map((filter) => (
                        <Link
                            key={filter.value}
                            href={detailHref(filter.value)}
                            aria-current={
                                filter.value === status ? "page" : undefined
                            }
                            className={cn(
                                "flex h-8 items-center justify-center rounded-full px-3 text-xs font-semibold",
                                filter.value === status
                                    ? "bg-text-primary text-bg"
                                    : "bg-surface text-text-secondary"
                            )}
                        >
                            {filter.label}
                        </Link>
                    ))}
                </nav>
            ) : null}

            <section className="flex flex-col gap-4" aria-label="서열표 구간">
                {tierList.bands.map((band) => {
                    const recommendationDistance = recommendation
                        ? Math.round(
                              Math.abs(band.value - recommendation.target) * 10
                          ) / 10
                        : null;
                    const recommendationStrength =
                        recommendationDistance === 0
                            ? "center"
                            : recommendationDistance !== null &&
                                recommendationDistance <= 0.1
                              ? "near"
                              : recommendationDistance !== null &&
                                  recommendationDistance <= 0.2
                                ? "edge"
                                : "outside";
                    const bandEntries = band.entries.map((entry) => ({
                        ...entry,
                        record: recordByChartId.get(entry.chartId),
                        recordStatus: getTierRecordStatus(
                            recordByChartId.get(entry.chartId)
                        ),
                    }));
                    const visibleEntries = bandEntries.filter(
                        (entry) =>
                            status === "all" || entry.recordStatus === status
                    );
                    const countStatus = (recordStatus: TierRecordStatus) =>
                        bandEntries.filter(
                            (entry) => entry.recordStatus === recordStatus
                        ).length;

                    return (
                        <section
                            key={band.id}
                            className={cn(
                                "bg-surface rounded-card overflow-hidden transition-[opacity,box-shadow]",
                                recommendationEnabled &&
                                    recommendationStrength === "center" &&
                                    "ring-real ring-2",
                                recommendationEnabled &&
                                    recommendationStrength === "near" &&
                                    "ring-real/70 ring-1",
                                recommendationEnabled &&
                                    recommendationStrength === "edge" &&
                                    "ring-real/35 ring-1",
                                recommendationEnabled &&
                                    recommendationStrength === "outside" &&
                                    "opacity-40"
                            )}
                        >
                            <header className="bg-surface-muted flex min-h-11 items-center gap-3 px-3">
                                <h2 className="text-text-primary text-base font-bold tabular-nums">
                                    {formatTierValue(band.value)}
                                </h2>
                                {user ? (
                                    <div className="text-text-secondary ml-auto flex items-center gap-2 text-[10px]">
                                        <span className="text-rank-s">
                                            S {countStatus("s")}
                                        </span>
                                        <span className="text-rank-fc">
                                            FC {countStatus("fc")}
                                        </span>
                                        <span>
                                            미플레이 {countStatus("unplayed")}
                                        </span>
                                    </div>
                                ) : null}
                            </header>

                            {visibleEntries.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 p-3">
                                    {visibleEntries.map((entry) => (
                                        <TierChartCard
                                            key={entry.id}
                                            chart={entry.chart}
                                            record={entry.record}
                                            showRecord={!!user}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-text-disabled flex h-24 items-center justify-center px-4 text-center text-sm">
                                    이 조건에 해당하는 채보가 없습니다.
                                </div>
                            )}
                        </section>
                    );
                })}
            </section>

            {recommendationEnabled && recommendation && !hasRecommendedBand ? (
                <div className="bg-surface text-text-secondary rounded-card px-4 py-3 text-center text-sm">
                    추천 범위에 해당하는 상수 구간이 없습니다.
                </div>
            ) : null}

            {tierList.bands.length === 0 ? (
                <div className="bg-surface text-text-disabled rounded-card flex h-32 items-center justify-center text-sm">
                    등록된 상수 구간이 없습니다.
                </div>
            ) : null}
        </div>
    );
}
