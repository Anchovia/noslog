import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    LoaderCircle,
} from "lucide-react";
import Link from "next/link";

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
    const syncs = await db.dataSync.findMany({
        where: status === "all" ? undefined : { status },
        include: {
            user: {
                select: { id: true, username: true, nostalgia_name: true },
            },
        },
        orderBy: { started_at: "desc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">동기화 내역</h1>
                <p className="text-caption mt-1">
                    데이터 수집 범위와 처리 결과, 오류를 확인합니다.
                </p>
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
