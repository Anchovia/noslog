import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    DatabaseZap,
    LoaderCircle,
} from "lucide-react";
import FilterChipLinks from "@/components/ui/filter-chip-links";

import { getSyncHealthTagTone } from "@/lib/admin/sync-health";
import { getAdminSyncs } from "@/features/admin/server/admin-sync-service";
import { ADMIN_SYNC_STATUSES as statuses } from "@/features/admin/schemas/admin-sync-schema";
import AchievementRejudgePanel from "@/features/achievements/components/admin/achievement-rejudge-panel";
import { requireAdmin } from "@/lib/admin";

export default async function AdminSyncsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    await requireAdmin();
    const {
        status,
        syncs,
        completedCount,
        failedCount,
        processingCount,
        staleCount,
    } = await getAdminSyncs(await searchParams);
    const summaries = [
        {
            label: "24시간 완료",
            value: completedCount,
            className: "text-nl-success",
        },
        {
            label: "24시간 실패",
            value: failedCount,
            className: "text-nl-error",
        },
        {
            label: "처리 중",
            value: processingCount,
            className: "text-nl-content",
        },
        {
            label: "10분 이상 지연",
            value: staleCount,
            className: "text-nl-warning",
        },
    ];

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">
                    동기화 내역
                </h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    데이터 수집 범위와 처리 결과, 오류를 확인합니다.
                </p>
            </section>
            {/* 업적 다시 판정(2026-09-25 B1) — 배포 뒤 첫 판정 · 기준 수치를 바꾼 뒤 */}
            <AchievementRejudgePanel />
            <section className="grid grid-cols-2 gap-nl-8">
                {summaries.map((summary) => (
                    <div
                        key={summary.label}
                        className="rounded-nl-control bg-nl-surface p-nl-12"
                    >
                        <p className="nl-metadata text-nl-subdued">
                            {summary.label}
                        </p>
                        <strong
                            className={`${summary.className} nl-component-title mt-nl-4 block`}
                        >
                            {summary.value.toLocaleString("ko-KR")}
                        </strong>
                    </div>
                ))}
            </section>
            <FilterChipLinks
                label="동기화 상태"
                options={statuses.map((item) => ({
                    key: item,
                    href: `/admin/syncs?status=${item}`,
                    selected: status === item,
                    label:
                        item === "all"
                            ? "전체"
                            : item === "processing"
                              ? "처리 중"
                              : item === "completed"
                                ? "완료"
                                : "실패",
                }))}
            />
            <section className="flex flex-col gap-nl-8">
                {syncs.map((sync) => {
                    const {
                        storedRecentCount,
                        storedSnapshotCount,
                        recentJudgementCount,
                        recentFastSlowCount,
                        snapshotJudgementCount,
                        snapshotNoteRateCount,
                        health,
                    } = sync;
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
                            ? "text-nl-error"
                            : sync.status === "completed"
                              ? "text-nl-success"
                              : "text-nl-warning";
                    return (
                        <article
                            key={sync.id}
                            className="flex flex-col gap-nl-12 rounded-nl-control bg-nl-surface p-nl-12"
                        >
                            <div className="flex items-start gap-nl-12">
                                <span
                                    className={`${color} flex size-nl-32 shrink-0 items-center justify-center rounded-nl-control bg-nl-control`}
                                >
                                    <Icon className="nl-icon-small" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="nl-emphasis-label truncate text-nl-content">
                                        {sync.user.nostalgiaName ??
                                            sync.user.username ??
                                            `유저 ${sync.user.id}`}
                                    </p>
                                    <p className="nl-metadata text-nl-subdued">
                                        #{sync.id} ·{" "}
                                        {sync.syncScope === "full"
                                            ? "전체 기록"
                                            : "최근 기록"}{" "}
                                        ·{" "}
                                        {sync.startedAt.toLocaleString("ko-KR")}
                                    </p>
                                </div>
                                <span
                                    className="nl-tag nl-tag--status shrink-0"
                                    data-tone={getSyncHealthTagTone(
                                        health.tone
                                    )}
                                >
                                    {health.label}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-nl-8 text-center">
                                <div className="rounded-nl-control bg-nl-canvas p-nl-8">
                                    <p className="nl-metadata text-nl-subdued">
                                        수신
                                    </p>
                                    <strong className="nl-metric-value">
                                        {sync.receivedPlays}
                                    </strong>
                                </div>
                                <div className="rounded-nl-control bg-nl-canvas p-nl-8">
                                    <p className="nl-metadata text-nl-subdued">
                                        추가
                                    </p>
                                    <strong className="nl-metric-value">
                                        {sync.insertedPlays}
                                    </strong>
                                </div>
                                <div className="rounded-nl-control bg-nl-canvas p-nl-8">
                                    <p className="nl-metadata text-nl-subdued">
                                        변경
                                    </p>
                                    <strong className="nl-metric-value">
                                        {sync.changedRecords}
                                    </strong>
                                </div>
                            </div>
                            <details className="border-t-nl-stroke border-nl-divider pt-nl-12">
                                <summary className="nl-admin-summary nl-emphasis-label flex cursor-pointer list-none items-center justify-between text-nl-content">
                                    <span className="flex items-center gap-nl-8">
                                        <DatabaseZap className="nl-icon-small" />
                                        수신 데이터 상태
                                    </span>
                                    <Activity className="nl-icon-small text-nl-disabled" />
                                </summary>
                                <dl className="mt-nl-12 grid grid-cols-2 gap-x-nl-12 gap-y-nl-8">
                                    <div>
                                        <dt className="nl-metadata text-nl-subdued">
                                            최근 기록 저장
                                        </dt>
                                        <dd className="nl-metric-value text-nl-content">
                                            {storedRecentCount} /{" "}
                                            {sync.insertedPlays}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="nl-metadata text-nl-subdued">
                                            최근 기록 판정
                                        </dt>
                                        <dd className="nl-metric-value text-nl-content">
                                            {recentJudgementCount} /{" "}
                                            {storedRecentCount}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="nl-metadata text-nl-subdued">
                                            FAST/SLOW
                                        </dt>
                                        <dd className="nl-metric-value text-nl-content">
                                            {recentFastSlowCount} /{" "}
                                            {storedRecentCount}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="nl-metadata text-nl-subdued">
                                            변경 기록 저장
                                        </dt>
                                        <dd className="nl-metric-value text-nl-content">
                                            {storedSnapshotCount} /{" "}
                                            {sync.changedRecords}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="nl-metadata text-nl-subdued">
                                            변경 기록 판정
                                        </dt>
                                        <dd className="nl-metric-value text-nl-content">
                                            {snapshotJudgementCount} /{" "}
                                            {storedSnapshotCount}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="nl-metadata text-nl-subdued">
                                            음표 성공률
                                        </dt>
                                        <dd className="nl-metric-value text-nl-content">
                                            {snapshotNoteRateCount} /{" "}
                                            {storedSnapshotCount}
                                        </dd>
                                    </div>
                                </dl>
                            </details>
                            {sync.errorMessage ? (
                                <pre
                                    className={`${sync.status === "completed" ? "text-nl-warning" : "text-nl-error"} nl-metadata overflow-x-auto whitespace-pre-wrap`}
                                >
                                    {sync.errorMessage}
                                </pre>
                            ) : null}
                            {sync.completedAt ? (
                                <p className="nl-metadata text-right text-nl-subdued">
                                    완료{" "}
                                    {sync.completedAt.toLocaleString("ko-KR")}
                                </p>
                            ) : null}
                        </article>
                    );
                })}
                {syncs.length === 0 ? (
                    <p className="nl-body-secondary rounded-nl-control bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        동기화 내역이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
