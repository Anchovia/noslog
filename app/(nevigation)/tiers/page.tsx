import { Plus } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
    formatTierDate,
    getTierRecordStatus,
    tierModeStyles,
} from "@/lib/tiers";
import { getUser } from "@/lib/user";
import {
    getCachedTierLists,
    getUserTierRecords,
    type PublicTierMode,
} from "./data";

interface TiersPageProps {
    searchParams: Promise<{ mode?: string }>;
}

const modes: { value: PublicTierMode; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "basic", label: "Basic" },
    { value: "recital", label: "Recital" },
];

function normalizeMode(value?: string): PublicTierMode {
    return value === "basic" || value === "recital" ? value : "all";
}

export default async function TiersPage({ searchParams }: TiersPageProps) {
    const { mode: requestedMode } = await searchParams;
    const mode = normalizeMode(requestedMode);
    const [user, tierLists] = await Promise.all([
        getUser(),
        getCachedTierLists(mode),
    ]);

    const chartIds = [
        ...new Set(
            tierLists.flatMap((tierList) =>
                tierList.entries.map((entry) => entry.chartId)
            )
        ),
    ];
    const records = user ? await getUserTierRecords(user.id, chartIds) : [];
    const recordByChartId = new Map(
        records.flatMap((record) =>
            record.chart_id === null ? [] : [[record.chart_id, record] as const]
        )
    );

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <h1 className="text-title">서열표</h1>

            <nav className="flex gap-2" aria-label="서열표 모드">
                {modes.map((item) => (
                    <Link
                        key={item.value}
                        href={
                            item.value === "all"
                                ? "/tiers"
                                : `/tiers?mode=${item.value}`
                        }
                        aria-current={item.value === mode ? "page" : undefined}
                        className={cn(
                            "flex h-9 items-center justify-center rounded-md px-4 text-sm font-semibold",
                            item.value === mode
                                ? "bg-text-primary text-bg"
                                : "bg-surface text-text-secondary"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-3" aria-label="서열표 목록">
                {tierLists.length > 0 ? (
                    tierLists.map((tierList) => {
                        const statuses = tierList.entries.map((entry) =>
                            getTierRecordStatus(
                                recordByChartId.get(entry.chartId)
                            )
                        );
                        const pianistCount = statuses.filter(
                            (status) => status === "pianist"
                        ).length;
                        const fcCount = statuses.filter(
                            (status) => status === "fc"
                        ).length;
                        const sCount = statuses.filter(
                            (status) => status === "s"
                        ).length;
                        const clearedCount = statuses.filter(
                            (status) => status !== "unplayed"
                        ).length;
                        const totalCount = tierList.entries.length;

                        return (
                            <Link
                                key={tierList.id}
                                href={`/tiers/${tierList.slug}`}
                                className="bg-surface rounded-card hover:bg-surface-muted flex flex-col gap-3 p-4 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span
                                            className={cn(
                                                "shrink-0 rounded px-2 py-1 text-xs font-bold capitalize",
                                                tierModeStyles[tierList.mode] ??
                                                    "bg-border text-text-secondary"
                                            )}
                                        >
                                            {tierList.mode}
                                        </span>
                                        <h2 className="text-text-primary truncate text-base font-semibold">
                                            {tierList.title}
                                        </h2>
                                    </div>
                                    <span
                                        className="text-text-disabled text-lg"
                                        aria-hidden
                                    >
                                        ›
                                    </span>
                                </div>

                                <div className="text-text-secondary flex items-center gap-3 text-xs">
                                    <span>{totalCount}곡</span>
                                    <span>
                                        업데이트{" "}
                                        {formatTierDate(tierList.updatedAt)}
                                    </span>
                                </div>

                                {user && totalCount > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-text-secondary flex items-center gap-3 text-xs">
                                            <span className="text-score">
                                                P {pianistCount}
                                            </span>
                                            <span className="text-rank-fc">
                                                FC {fcCount}
                                            </span>
                                            <span className="text-rank-s">
                                                S {sCount}
                                            </span>
                                            <span className="ml-auto tabular-nums">
                                                {clearedCount}/{totalCount}
                                            </span>
                                        </div>
                                        <div className="bg-divider flex h-1 overflow-hidden rounded-full">
                                            <span
                                                className="bg-score"
                                                style={{
                                                    width: `${(pianistCount / totalCount) * 100}%`,
                                                }}
                                            />
                                            <span
                                                className="bg-rank-fc"
                                                style={{
                                                    width: `${(fcCount / totalCount) * 100}%`,
                                                }}
                                            />
                                            <span
                                                className="bg-rank-s"
                                                style={{
                                                    width: `${(sCount / totalCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </Link>
                        );
                    })
                ) : (
                    <div className="bg-surface text-text-disabled rounded-card flex h-32 items-center justify-center text-sm">
                        공개된 서열표가 없습니다.
                    </div>
                )}
            </section>

            {user?.role === "admin" ? (
                <Link
                    href="/admin/tiers/new"
                    className="border-border text-text-secondary hover:text-text-primary flex h-12 items-center justify-center gap-2 rounded-md border border-dashed text-sm font-semibold transition-colors"
                >
                    <Plus size={16} aria-hidden />새 서열표 만들기
                </Link>
            ) : null}
        </div>
    );
}
