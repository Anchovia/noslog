import Link from "next/link";
import { notFound } from "next/navigation";

import TierBandBrowser from "@/components/tiers/tierBandBrowser";
import { createPageMetadata } from "@/lib/metadata/site";
import { formatTierDate, getTierRecommendation } from "@/lib/tiers";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/user";
import { getCachedTierOverview, getTierBandForUser } from "../data";
import type { Metadata } from "next";

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

export async function generateMetadata({
    params,
}: Pick<TierDetailPageProps, "params">): Promise<Metadata> {
    const { slug } = await params;
    const tierList = await getCachedTierOverview(slug);

    if (!tierList) {
        return createPageMetadata({
            title: "서열표를 찾을 수 없습니다",
            path: "/tiers",
            noIndex: true,
        });
    }

    return createPageMetadata({
        title: tierList.title,
        description: `${tierList.title}의 채보별 난이도 구간과 배치, 내 플레이 기록 기준 추천 구간을 확인합니다.`,
        path: `/tiers/${encodeURIComponent(tierList.slug)}`,
    });
}

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
        getCachedTierOverview(slug),
        getUser(),
    ]);
    const { status: requestedStatus, recommend: requestedRecommendation } =
        query;
    const status = normalizeFilter(requestedStatus);
    const recommendationEnabled = requestedRecommendation === "1";
    if (!tierList) notFound();

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
    const visibleBands = tierList.bands.filter((band) => {
        if (!recommendationEnabled || !recommendation) return true;
        return (
            band.value >= recommendation.min - 0.001 &&
            band.value <= recommendation.max + 0.001
        );
    });
    const initialBand = visibleBands[0]
        ? await getTierBandForUser(tierList.slug, visibleBands[0].id, user?.id)
        : null;
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
                                ? "bg-real text-bg hover:bg-real/85"
                                : "bg-surface-muted text-text-secondary hover:bg-divider hover:text-text-primary"
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

            <TierBandBrowser
                slug={tierList.slug}
                bands={visibleBands}
                initialBand={initialBand}
                status={status}
                showRecords={Boolean(user)}
                recommendationEnabled={recommendationEnabled}
                recommendationTarget={recommendation?.target ?? null}
            />

            {recommendationEnabled && recommendation && !hasRecommendedBand ? (
                <div className="bg-surface text-text-secondary rounded-card px-4 py-3 text-center text-sm">
                    추천 범위에 해당하는 상수 구간이 없습니다.
                </div>
            ) : null}
        </div>
    );
}
