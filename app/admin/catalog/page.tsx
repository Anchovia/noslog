import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCountTabs,
    AdminPager,
    AdminTable,
} from "@/components/admin/admin-card";
import MusicCatalogReviewActions from "@/features/music/components/admin/music-catalog-review-actions";
import {
    MUSIC_CATALOG_STATUSES,
    normalizeMusicCatalogStatus,
    type MusicCatalogStatus,
} from "@/features/music/schemas/music-catalog-admin-schema";
import {
    countMusicCatalogCandidatesByStatus,
    listMusicCatalogCandidates,
} from "@/features/music/server/music-catalog-admin-service";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageArgs,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

function statusLabel(status: MusicCatalogStatus) {
    if (status === "pending") return "검토 대기";
    if (status === "applied") return "반영 완료";
    return "반려";
}

export default async function AdminCatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const status = normalizeMusicCatalogStatus(params.status);
    const page = parseAdminPage(params.page);
    const [candidates, counts] = await Promise.all([
        listMusicCatalogCandidates(status, adminPageArgs(page)),
        countMusicCatalogCandidatesByStatus(),
    ]);

    return (
        <div className="nl-admin-stack">
            <AdminCountTabs
                label="처리 상태"
                options={MUSIC_CATALOG_STATUSES.map((item) => ({
                    key: item,
                    label: statusLabel(item),
                    count: counts[item],
                    href: `/admin/catalog?status=${item}`,
                    selected: status === item,
                }))}
            />
            <AdminCard>
                <AdminCardHead title="악곡 업데이트" />
                {candidates.length ? (
                    <>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <th>곡</th>
                                    <th>아티스트</th>
                                    <th>변경</th>
                                    <th>악곡 ID</th>
                                    <th>감지 횟수</th>
                                    <th>최근 감지</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate) => (
                                    <tr key={candidate.id}>
                                        <td>{candidate.title}</td>
                                        <td>
                                            {candidate.artist ??
                                                "아티스트 미상"}
                                        </td>
                                        <td className="nl-admin-table__wrap">
                                            {candidate.changes.join(" · ")}
                                        </td>
                                        <td className="font-nl-mono">
                                            {candidate.musicIndex}
                                        </td>
                                        <td>
                                            {candidate.seenCount.toLocaleString(
                                                "ko-KR"
                                            )}
                                            회
                                        </td>
                                        <td>
                                            {candidate.lastSeenAt.toLocaleString(
                                                "ko-KR"
                                            )}
                                        </td>
                                        <td className="nl-admin-table__menu">
                                            {candidate.status === "pending" ? (
                                                <MusicCatalogReviewActions
                                                    candidateId={candidate.id}
                                                />
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                        <AdminPager
                            page={page}
                            pageSize={ADMIN_PAGE_SIZE}
                            total={counts[status]}
                            unit="건"
                            hrefFor={(next) =>
                                adminPageHref(
                                    "/admin/catalog",
                                    { status: params.status },
                                    next
                                )
                            }
                        />
                    </>
                ) : (
                    <AdminCardEmpty>
                        해당하는 악곡 업데이트가 없습니다.
                    </AdminCardEmpty>
                )}
            </AdminCard>
        </div>
    );
}
