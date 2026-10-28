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
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">
                    악곡 업데이트
                </h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    BEMANI 연동에서 감지한 공식 악곡과 채보 변경을 관리합니다.
                </p>
            </section>

            <nav className="flex gap-nl-8">
                {MUSIC_CATALOG_STATUSES.map((item) => (
                    <Link
                        key={item}
                        href={"/admin/catalog?status=" + item}
                        className={
                            "nl-emphasis-label rounded-nl-control px-nl-12 py-nl-8 transition-colors duration-nl-state " +
                            (status === item
                                ? "bg-nl-primary text-nl-on-primary"
                                : "nl-hover-layer bg-nl-surface text-nl-subdued")
                        }
                    >
                        {statusLabel(item)}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-nl-12">
                {candidates.map((candidate) => (
                    <article
                        key={candidate.id}
                        className="flex flex-col gap-nl-12 rounded-nl-control bg-nl-surface p-nl-16"
                    >
                        <div className="flex items-start justify-between gap-nl-12">
                            <div className="min-w-0">
                                <h2 className="nl-component-title truncate text-nl-content">
                                    {candidate.title}
                                </h2>
                                <p className="nl-metadata mt-nl-4 truncate text-nl-subdued">
                                    {candidate.artist ?? "아티스트 미상"}
                                </p>
                            </div>
                            <span className="nl-tag shrink-0">
                                {statusLabel(candidate.status)}
                            </span>
                        </div>

                        <ul className="flex flex-wrap gap-nl-8">
                            {candidate.changes.map((change) => (
                                <li key={change} className="nl-tag">
                                    {change}
                                </li>
                            ))}
                        </ul>

                        <dl className="nl-admin-pairs nl-metadata gap-x-nl-12 gap-y-nl-4 text-nl-subdued">
                            <dt>악곡 ID</dt>
                            <dd className="truncate font-nl-mono text-nl-content">
                                {candidate.musicIndex}
                            </dd>
                            <dt>감지 횟수</dt>
                            <dd className="text-nl-content">
                                {candidate.seenCount.toLocaleString("ko-KR")}회
                            </dd>
                            <dt>최근 감지</dt>
                            <dd className="text-nl-content">
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
                    <p className="nl-body-secondary rounded-nl-control bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        해당하는 악곡 업데이트가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
