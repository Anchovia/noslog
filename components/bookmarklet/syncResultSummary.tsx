import type { LatestSyncSummary } from "@/app/(nevigation)/bookmarklet/data";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";

function formatDuration(startedAt: Date, completedAt: Date | null) {
    if (!completedAt) return null;

    const milliseconds = Math.max(
        0,
        completedAt.getTime() - startedAt.getTime()
    );
    if (milliseconds < 1_000) return "1초 미만";

    const seconds = Math.round(milliseconds / 1_000);
    if (seconds < 60) return `${seconds}초`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
        ? `${minutes}분 ${remainingSeconds}초`
        : `${minutes}분`;
}

function statusPresentation(status: string) {
    if (status === "completed") {
        return {
            label: "완료",
            className: "bg-success/10 text-success",
        };
    }
    if (status === "failed") {
        return {
            label: "실패",
            className: "bg-danger/10 text-danger",
        };
    }
    return {
        label: "처리 중",
        className: "bg-score/10 text-score",
    };
}

export default function SyncResultSummary({
    summary,
}: {
    summary: LatestSyncSummary;
}) {
    const status = statusPresentation(summary.status);
    const duration = formatDuration(summary.startedAt, summary.completedAt);
    const syncDate = summary.completedAt ?? summary.startedAt;

    return (
        <details className="bg-surface rounded-card group overflow-hidden">
            <summary className="hover:bg-surface-muted flex cursor-pointer list-none items-start justify-between gap-3 p-4 transition-colors [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                    <h2 className="text-section">최근 동기화 결과</h2>
                    <span className="text-caption mt-1 block">
                        {format(syncDate, "yyyy.MM.dd HH:mm")} ·{" "}
                        {summary.syncScope === "full"
                            ? "전체 기록"
                            : "최근 기록"}
                        {duration ? ` · ${duration}` : ""}
                    </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                    <span
                        className={`${status.className} rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap`}
                    >
                        {status.label}
                    </span>
                    <ChevronDown className="text-text-disabled size-4 transition-transform group-open:rotate-180" />
                </span>
            </summary>

            <div className="border-divider flex flex-col gap-4 border-t px-4 pt-4 pb-4">
                <dl className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-bg rounded-md px-2 py-3">
                        <dt className="text-micro text-text-secondary">
                            수신 기록
                        </dt>
                        <dd className="text-label mt-1 tabular-nums">
                            {summary.receivedPlays.toLocaleString("ko-KR")}
                        </dd>
                    </div>
                    <div className="bg-bg rounded-md px-2 py-3">
                        <dt className="text-micro text-text-secondary">
                            새 플레이
                        </dt>
                        <dd className="text-label mt-1 tabular-nums">
                            {summary.insertedPlays.toLocaleString("ko-KR")}
                        </dd>
                    </div>
                    <div className="bg-bg rounded-md px-2 py-3">
                        <dt className="text-micro text-text-secondary">
                            갱신 채보
                        </dt>
                        <dd className="text-label mt-1 tabular-nums">
                            {summary.changedRecords.toLocaleString("ko-KR")}
                        </dd>
                    </div>
                </dl>

                <div className="border-divider border-t pt-4">
                    <h3 className="text-label mb-3">분석 데이터</h3>
                    <dl className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <dt className="text-body">판정 상세</dt>
                                <dd className="text-caption mt-0.5">
                                    플레이한 채보 기준
                                </dd>
                            </div>
                            <strong className="text-label shrink-0 tabular-nums">
                                {summary.judgementChartCount.toLocaleString(
                                    "ko-KR"
                                )}
                                {" / "}
                                {summary.playedChartCount.toLocaleString(
                                    "ko-KR"
                                )}{" "}
                                채보
                            </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <dt className="text-body">FAST/SLOW</dt>
                                <dd className="text-caption mt-0.5">
                                    최근 플레이 분석 가능
                                </dd>
                            </div>
                            <strong className="text-label shrink-0 tabular-nums">
                                {summary.timingChartCount.toLocaleString(
                                    "ko-KR"
                                )}
                                {" 채보"}
                            </strong>
                        </div>
                    </dl>
                </div>

                {summary.status === "completed" && summary.hasNotice ? (
                    <p className="border-score/30 bg-score/5 text-score rounded-md border px-3 py-2 text-xs">
                        일부 미등록 채보는 개인 기록에서 제외되었습니다.
                    </p>
                ) : null}
            </div>
        </details>
    );
}
