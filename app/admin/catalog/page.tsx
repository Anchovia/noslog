import { Check, X } from "lucide-react";
import Link from "next/link";

import db from "@/lib/db";
import {
    describeMusicCatalogChanges,
    musicCatalogSnapshotSchema,
} from "@/lib/services/music/catalogSync";

import { reviewMusicCatalogCandidate } from "./actions";

const statuses = ["pending", "applied", "rejected"] as const;

function statusLabel(status: (typeof statuses)[number]) {
    if (status === "pending") return "검토 대기";
    if (status === "applied") return "반영 완료";
    return "반려";
}

export default async function AdminCatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = statuses.includes(params.status as (typeof statuses)[number])
        ? (params.status as (typeof statuses)[number])
        : "pending";
    const candidates = await db.musicCatalogCandidate.findMany({
        where: { status },
        orderBy: { lastSeenAt: "desc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">악곡 업데이트</h1>
                <p className="text-caption mt-1">
                    BEMANI 연동에서 감지한 공식 악곡과 채보 변경을 관리합니다.
                </p>
            </section>

            <nav className="flex gap-2">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/catalog?status=${item}`}
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${status === item ? "bg-text-primary text-bg" : "bg-surface text-text-secondary hover:bg-surface-muted"}`}
                    >
                        {statusLabel(item)}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-3">
                {candidates.map((candidate) => {
                    const payloadResult = musicCatalogSnapshotSchema.safeParse(
                        candidate.payload
                    );
                    const beforeResult = candidate.beforeSnapshot
                        ? musicCatalogSnapshotSchema.safeParse(
                              candidate.beforeSnapshot
                          )
                        : null;
                    if (!payloadResult.success) return null;

                    const payload = payloadResult.data;
                    const before =
                        beforeResult?.success === true
                            ? beforeResult.data
                            : null;
                    const changes = describeMusicCatalogChanges(
                        before,
                        payload
                    );

                    return (
                        <article
                            key={candidate.id}
                            className="bg-surface rounded-card flex flex-col gap-3 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="text-section truncate">
                                        {payload.title}
                                    </h2>
                                    <p className="text-caption mt-1 truncate">
                                        {payload.artist ?? "아티스트 미상"}
                                    </p>
                                </div>
                                <span className="bg-surface-muted text-caption shrink-0 rounded px-2 py-1">
                                    {statusLabel(status)}
                                </span>
                            </div>

                            <ul className="flex flex-wrap gap-1.5">
                                {changes.map((change) => (
                                    <li
                                        key={change}
                                        className="bg-basic/10 text-basic rounded px-2 py-1 text-xs font-semibold"
                                    >
                                        {change}
                                    </li>
                                ))}
                            </ul>

                            <dl className="text-caption grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                                <dt>악곡 ID</dt>
                                <dd className="text-text-primary truncate font-mono">
                                    {payload.musicIndex}
                                </dd>
                                <dt>감지 횟수</dt>
                                <dd className="text-text-primary tabular-nums">
                                    {candidate.seenCount.toLocaleString(
                                        "ko-KR"
                                    )}
                                    회
                                </dd>
                                <dt>최근 감지</dt>
                                <dd className="text-text-primary">
                                    {candidate.lastSeenAt.toLocaleString(
                                        "ko-KR"
                                    )}
                                </dd>
                            </dl>

                            {status === "pending" ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <form action={reviewMusicCatalogCandidate}>
                                        <input
                                            type="hidden"
                                            name="candidateId"
                                            value={candidate.id}
                                        />
                                        <input
                                            type="hidden"
                                            name="decision"
                                            value="reject"
                                        />
                                        <button className="border-border text-text-secondary hover:bg-surface-muted flex h-10 w-full items-center justify-center gap-2 rounded-md border text-sm font-bold">
                                            <X className="size-4" />
                                            반려
                                        </button>
                                    </form>
                                    <form action={reviewMusicCatalogCandidate}>
                                        <input
                                            type="hidden"
                                            name="candidateId"
                                            value={candidate.id}
                                        />
                                        <input
                                            type="hidden"
                                            name="decision"
                                            value="approve"
                                        />
                                        <button className="bg-text-primary text-bg flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-bold">
                                            <Check className="size-4" />
                                            반영
                                        </button>
                                    </form>
                                </div>
                            ) : null}
                        </article>
                    );
                })}
                {candidates.length === 0 ? (
                    <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                        해당하는 악곡 업데이트가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
