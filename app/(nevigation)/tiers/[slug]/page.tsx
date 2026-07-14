import Link from "next/link";
import { notFound } from "next/navigation";

import TierChartCard from "@/components/tiers/tierChartCard";
import db from "@/lib/db";
import {
    formatTierDate,
    getTierRecordStatus,
    type TierRecordStatus,
} from "@/lib/tiers";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/user";

interface TierDetailPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ status?: string }>;
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
    const [{ slug }, { status: requestedStatus }, user] = await Promise.all([
        params,
        searchParams,
        getUser(),
    ]);
    const status = normalizeFilter(requestedStatus);
    const tierList = await db.tierList.findFirst({
        where: { slug, status: "published" },
        include: {
            bands: {
                orderBy: { position: "asc" },
                include: {
                    entries: {
                        orderBy: { position: "asc" },
                        include: {
                            chart: {
                                include: {
                                    music: {
                                        select: {
                                            index: true,
                                            title: true,
                                            background: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!tierList) notFound();

    const entries = tierList.bands.flatMap((band) => band.entries);
    const chartIds = entries.map((entry) => entry.chartId);
    const [records, participants] = await Promise.all([
        user
            ? db.playData.findMany({
                  where: { user_id: user.id, chart_id: { in: chartIds } },
                  select: {
                      chart_id: true,
                      score: true,
                      rank: true,
                      fc_type: true,
                  },
              })
            : Promise.resolve([]),
        chartIds.length > 0
            ? db.playData.findMany({
                  where: { chart_id: { in: chartIds }, score: { gt: 0 } },
                  select: { user_id: true },
                  distinct: ["user_id"],
              })
            : Promise.resolve([]),
    ]);
    const recordByChartId = new Map(
        records.flatMap((record) =>
            record.chart_id === null ? [] : [[record.chart_id, record] as const]
        )
    );
    const detailHref = (nextStatus: TierFilter) =>
        nextStatus === "all"
            ? `/tiers/${tierList.slug}`
            : `/tiers/${tierList.slug}?status=${nextStatus}`;

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <header className="flex flex-col gap-2">
                <h1 className="text-title">{tierList.title}</h1>
                <div className="text-text-secondary flex items-center gap-3 text-xs">
                    <span>업데이트 {formatTierDate(tierList.updatedAt)}</span>
                    <span>참여 {participants.length}명</span>
                </div>
            </header>

            <nav
                className="bg-surface-muted rounded-card grid grid-cols-2 p-1"
                aria-label="서열표 모드"
            >
                {["basic", "recital"].map((mode) => (
                    <Link
                        key={mode}
                        href={
                            mode === tierList.mode
                                ? `/tiers/${tierList.slug}`
                                : `/tiers?mode=${mode}`
                        }
                        aria-current={
                            mode === tierList.mode ? "page" : undefined
                        }
                        className={cn(
                            "flex h-10 items-center justify-center rounded-md text-sm font-semibold capitalize",
                            mode === tierList.mode
                                ? "bg-text-primary text-bg"
                                : "text-text-secondary"
                        )}
                    >
                        {mode}
                    </Link>
                ))}
            </nav>

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
                            className="bg-surface rounded-card overflow-hidden"
                        >
                            <header className="bg-surface-muted flex min-h-11 items-center gap-3 px-3">
                                <h2 className="text-text-primary text-base font-bold tabular-nums">
                                    {band.value.toFixed(2).replace(/0$/, "")}
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

            {tierList.bands.length === 0 ? (
                <div className="bg-surface text-text-disabled rounded-card flex h-32 items-center justify-center text-sm">
                    등록된 상수 구간이 없습니다.
                </div>
            ) : null}
        </div>
    );
}
