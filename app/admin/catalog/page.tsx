import Link from "next/link";

import MusicCatalogReviewActions from "@/features/music/components/admin/music-catalog-review-actions";
import {
    MUSIC_CATALOG_STATUSES,
    normalizeMusicCatalogStatus,
    type MusicCatalogStatus,
} from "@/features/music/schemas/music-catalog-admin-schema";
import { listMusicCatalogCandidates } from "@/features/music/server/music-catalog-admin-service";

function statusLabel(status: MusicCatalogStatus) {
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
    const status = normalizeMusicCatalogStatus(params.status);
    const candidates = await listMusicCatalogCandidates(status);

    return (
        <div className="flex flex-col gap-4 py-5">
            <section>
                <h1 className="text-title">악곡 업데이트</h1>
                <p className="mt-1 text-caption">
                    BEMANI 연동에서 감지한 공식 악곡과 채보 변경을 관리합니다.
                </p>
            </section>

            <nav className="flex gap-2">
                {MUSIC_CATALOG_STATUSES.map((item) => (
                    <Link
                        key={item}
                        href={"/admin/catalog?status=" + item}
                        className={
                            "rounded-md px-3 py-2 text-sm font-semibold transition-colors " +
                            (status === item
                                ? "bg-text-primary text-bg"
                                : "bg-surface text-text-secondary hover:bg-surface-muted")
                        }
                    >
                        {statusLabel(item)}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-3">
                {candidates.map((candidate) => (
                    <article
                        key={candidate.id}
                        className="flex flex-col gap-3 rounded-card bg-surface p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="truncate text-section">
                                    {candidate.title}
                                </h2>
                                <p className="mt-1 truncate text-caption">
                                    {candidate.artist ?? "아티스트 미상"}
                                </p>
                            </div>
                            <span className="shrink-0 rounded bg-surface-muted px-2 py-1 text-caption">
                                {statusLabel(candidate.status)}
                            </span>
                        </div>

                        <ul className="flex flex-wrap gap-1.5">
                            {candidate.changes.map((change) => (
                                <li
                                    key={change}
                                    className="rounded bg-basic/10 px-2 py-1 text-xs font-semibold text-basic"
                                >
                                    {change}
                                </li>
                            ))}
                        </ul>

                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-caption">
                            <dt>악곡 ID</dt>
                            <dd className="truncate font-mono text-text-primary">
                                {candidate.musicIndex}
                            </dd>
                            <dt>감지 횟수</dt>
                            <dd className="text-text-primary tabular-nums">
                                {candidate.seenCount.toLocaleString("ko-KR")}회
                            </dd>
                            <dt>최근 감지</dt>
                            <dd className="text-text-primary">
                                {candidate.lastSeenAt.toLocaleString("ko-KR")}
                            </dd>
                        </dl>

                        {candidate.status === "pending" ? (
                            <MusicCatalogReviewActions
                                candidateId={candidate.id}
                            />
                        ) : null}
                    </article>
                ))}
                {candidates.length === 0 ? (
                    <p className="rounded-card bg-surface py-12 text-center text-body-muted">
                        해당하는 악곡 업데이트가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
