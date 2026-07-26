import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    DatabaseZap,
    LoaderCircle,
} from "lucide-react";
import Link from "next/link";

import {
    getSyncAttemptHealth,
    getSyncHealthClassName,
    STALE_SYNC_THRESHOLD_MS,
} from "@/lib/admin/syncHealth";
import db from "@/lib/db";

const statuses = ["all", "processing", "completed", "failed"] as const;

export default async function AdminSyncsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = statuses.includes(params.status as (typeof statuses)[number])
        ? params.status!
        : "all";
    const now = new Date();
    const recentStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const staleBefore = new Date(now.getTime() - STALE_SYNC_THRESHOLD_MS);
    const [syncs, completedCount, failedCount, processingCount, staleCount] =
        await Promise.all([
            db.dataSync.findMany({
                where: status === "all" ? undefined : { status },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            nostalgia_name: true,
                        },
                    },
                    _count: {
                        select: {
                            playHistory: true,
                            recordSnapshots: true,
                        },
                    },
                },
                orderBy: { started_at: "desc" },
                take: 100,
            }),
            db.dataSync.count({
                where: {
                    status: "completed",
                    started_at: { gte: recentStart },
                },
            }),
            db.dataSync.count({
                where: { status: "failed", started_at: { gte: recentStart } },
            }),
            db.dataSync.count({ where: { status: "processing" } }),
            db.dataSync.count({
                where: {
                    status: "processing",
                    started_at: { lte: staleBefore },
                },
            }),
        ]);
    const syncIds = syncs.map((sync) => sync.id);
    const [
        recentJudgementGroups,
        recentFastSlowGroups,
        snapshotJudgementGroups,
        snapshotNoteRateGroups,
    ] = await Promise.all([
        db.chartPlayHistory.groupBy({
            by: ["first_sync_id"],
            where: {
                first_sync_id: { in: syncIds },
                judge_sjust: { not: null },
                judge_just: { not: null },
                judge_good: { not: null },
                judge_miss: { not: null },
                judge_near: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartPlayHistory.groupBy({
            by: ["first_sync_id"],
            where: {
                first_sync_id: { in: syncIds },
                fast_count: { not: null },
                slow_count: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartRecordSnapshot.groupBy({
            by: ["sync_id"],
            where: {
                sync_id: { in: syncIds },
                judge_sjust: { not: null },
                judge_just: { not: null },
                judge_good: { not: null },
                judge_miss: { not: null },
                judge_near: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartRecordSnapshot.groupBy({
            by: ["sync_id"],
            where: {
                sync_id: { in: syncIds },
                note_rate_standard: { not: null },
            },
            _count: { _all: true },
        }),
    ]);
    const recentJudgementBySync = new Map(
        recentJudgementGroups.flatMap((row) =>
            row.first_sync_id === null
                ? []
                : [[row.first_sync_id, row._count._all] as const]
        )
    );
    const recentFastSlowBySync = new Map(
        recentFastSlowGroups.flatMap((row) =>
            row.first_sync_id === null
                ? []
                : [[row.first_sync_id, row._count._all] as const]
        )
    );
    const snapshotJudgementBySync = new Map(
        snapshotJudgementGroups.map(
            (row) => [row.sync_id, row._count._all] as const
        )
    );
    const snapshotNoteRateBySync = new Map(
        snapshotNoteRateGroups.map(
            (row) => [row.sync_id, row._count._all] as const
        )
    );
    const summaries = [
        {
            label: "24시간 완료",
            value: completedCount,
            className: "text-success",
        },
        {
            label: "24시간 실패",
            value: failedCount,
            className: "text-danger",
        },
        {
            label: "처리 중",
            value: processingCount,
            className: "text-basic",
        },
        {
            label: "10분 이상 지연",
            value: staleCount,
            className: "text-score",
        },
    ];

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">동기화 내역</h1>
                <p className="text-caption mt-1">
                    데이터 수집 범위와 처리 결과, 오류를 확인합니다.
                </p>
            </section>
            <section className="grid grid-cols-2 gap-2">
                {summaries.map((summary) => (
                    <div
                        key={summary.label}
                        className="bg-surface rounded-card p-3"
                    >
                        <p className="text-caption">{summary.label}</p>
                        <strong
                            className={`${summary.className} text-section mt-1 block tabular-nums`}
                        >
                            {summary.value.toLocaleString("ko-KR")}
                        </strong>
                    </div>
                ))}
            </section>
            <nav className="flex gap-2 overflow-x-auto">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/syncs?status=${item}`}
                        className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${status === item ? "bg-text-primary text-bg" : "bg-surface text-text-secondary"}`}
                    >
                        {item === "all"
                            ? "전체"
                            : item === "processing"
                              ? "처리 중"
                              : item === "completed"
                                ? "완료"
                                : "실패"}
                    </Link>
                ))}
            </nav>
            <section className="flex flex-col gap-2">
                {syncs.map((sync) => {
                    const storedRecentCount = sync._count.playHistory;
                    const storedSnapshotCount = sync._count.recordSnapshots;
                    const recentJudgementCount =
                        recentJudgementBySync.get(sync.id) ?? 0;
                    const recentFastSlowCount =
                        recentFastSlowBySync.get(sync.id) ?? 0;
                    const snapshotJudgementCount =
                        snapshotJudgementBySync.get(sync.id) ?? 0;
                    const snapshotNoteRateCount =
                        snapshotNoteRateBySync.get(sync.id) ?? 0;
                    const health = getSyncAttemptHealth(
                        {
                            status: sync.status,
                            startedAt: sync.started_at,
                            insertedPlays: sync.inserted_plays,
                            changedRecords: sync.changed_records,
                            playHistoryCount: storedRecentCount,
                            snapshotCount: storedSnapshotCount,
                        },
                        now
                    );
                    const Icon =
                        sync.status === "failed"
                            ? AlertTriangle
                            : sync.status === "completed"
                              ? CheckCircle2
                              : sync.status === "processing"
                                ? LoaderCircle
                                : Clock3;
                    const color =
                        sync.status === "failed"
                            ? "text-danger bg-danger/10"
                            : sync.status === "completed"
                              ? "text-success bg-success/10"
                              : "text-score bg-score/10";
                    return (
                        <article
                            key={sync.id}
                            className="bg-surface rounded-card flex flex-col gap-3 p-3"
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={`${color} flex size-9 shrink-0 items-center justify-center rounded-md`}
                                >
                                    <Icon className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-body truncate font-bold">
                                        {sync.user.nostalgia_name ??
                                            sync.user.username ??
                                            `유저 ${sync.user.id}`}
                                    </p>
                                    <p className="text-caption">
                                        #{sync.id} ·{" "}
                                        {sync.sync_scope === "full"
                                            ? "전체 기록"
                                            : "최근 기록"}{" "}
                                        ·{" "}
                                        {sync.started_at.toLocaleString(
                                            "ko-KR"
                                        )}
                                    </p>
                                </div>
                                <span
                                    className={`${getSyncHealthClassName(health.tone)} shrink-0 rounded-full px-2 py-1 text-xs font-semibold`}
                                >
                                    {health.label}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-bg rounded-md p-2">
                                    <p className="text-caption">수신</p>
                                    <strong className="text-sm tabular-nums">
                                        {sync.received_plays}
                                    </strong>
                                </div>
                                <div className="bg-bg rounded-md p-2">
                                    <p className="text-caption">추가</p>
                                    <strong className="text-sm tabular-nums">
                                        {sync.inserted_plays}
                                    </strong>
                                </div>
                                <div className="bg-bg rounded-md p-2">
                                    <p className="text-caption">변경</p>
                                    <strong className="text-sm tabular-nums">
                                        {sync.changed_records}
                                    </strong>
                                </div>
                            </div>
                            <details className="border-border border-t pt-3">
                                <summary className="text-label flex cursor-pointer list-none items-center justify-between font-semibold">
                                    <span className="flex items-center gap-1.5">
                                        <DatabaseZap className="size-3.5" />
                                        수신 데이터 상태
                                    </span>
                                    <Activity className="text-text-disabled size-3.5" />
                                </summary>
                                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                                    <div>
                                        <dt className="text-micro">
                                            최근 기록 저장
                                        </dt>
                                        <dd className="text-label tabular-nums">
                                            {storedRecentCount} /{" "}
                                            {sync.inserted_plays}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-micro">
                                            최근 기록 판정
                                        </dt>
                                        <dd className="text-label tabular-nums">
                                            {recentJudgementCount} /{" "}
                                            {storedRecentCount}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-micro">
                                            FAST/SLOW
                                        </dt>
                                        <dd className="text-label tabular-nums">
                                            {recentFastSlowCount} /{" "}
                                            {storedRecentCount}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-micro">
                                            변경 기록 저장
                                        </dt>
                                        <dd className="text-label tabular-nums">
                                            {storedSnapshotCount} /{" "}
                                            {sync.changed_records}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-micro">
                                            변경 기록 판정
                                        </dt>
                                        <dd className="text-label tabular-nums">
                                            {snapshotJudgementCount} /{" "}
                                            {storedSnapshotCount}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-micro">
                                            음표 성공률
                                        </dt>
                                        <dd className="text-label tabular-nums">
                                            {snapshotNoteRateCount} /{" "}
                                            {storedSnapshotCount}
                                        </dd>
                                    </div>
                                </dl>
                            </details>
                            {sync.error_message ? (
                                <pre
                                    className={`${sync.status === "completed" ? "border-score/30 bg-score/5 text-score" : "border-danger/30 bg-danger/5 text-danger"} overflow-x-auto rounded-md border p-2 text-xs whitespace-pre-wrap`}
                                >
                                    {sync.error_message}
                                </pre>
                            ) : null}
                            {sync.completed_at ? (
                                <p className="text-caption text-right">
                                    완료{" "}
                                    {sync.completed_at.toLocaleString("ko-KR")}
                                </p>
                            ) : null}
                        </article>
                    );
                })}
                {syncs.length === 0 ? (
                    <p className="text-body-muted bg-surface rounded-card py-12 text-center">
                        동기화 내역이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
