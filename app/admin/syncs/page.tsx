import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCardTools,
    AdminPager,
    AdminTable,
} from "@/components/admin/admin-card";
import FilterChipLinks from "@/components/ui/filter-chip-links";
import { getAdminSyncs } from "@/features/admin/server/admin-sync-service";
import { ADMIN_SYNC_STATUSES as statuses } from "@/features/admin/schemas/admin-sync-schema";
import AchievementRejudgePanel from "@/features/achievements/components/admin/achievement-rejudge-panel";
import AdminSyncRow from "@/features/sync/components/admin/admin-sync-row";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

export default async function AdminSyncsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const page = parseAdminPage(params.page);
    const {
        status,
        syncs,
        totalCount,
        completedCount,
        failedCount,
        processingCount,
        staleCount,
    } = await getAdminSyncs(params, page);
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
        <div className="nl-admin-stack">
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
            <AdminCard>
                <AdminCardHead title="동기화" />
                <AdminCardTools>
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
                </AdminCardTools>
                {syncs.length === 0 ? (
                    <AdminCardEmpty>동기화 내역이 없습니다.</AdminCardEmpty>
                ) : (
                    <AdminTable>
                        <thead>
                            <tr>
                                <th scope="col">유저</th>
                                <th scope="col">번호</th>
                                <th scope="col">범위</th>
                                <th scope="col">시작</th>
                                <th scope="col">상태</th>
                                <th scope="col">수신</th>
                                <th scope="col">추가</th>
                                <th scope="col">변경</th>
                                <th
                                    scope="col"
                                    className="nl-admin-table__menu"
                                >
                                    <span className="sr-only">메뉴</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {syncs.map((sync) => (
                                <AdminSyncRow key={sync.id} sync={sync} />
                            ))}
                        </tbody>
                    </AdminTable>
                )}
                <AdminPager
                    page={page}
                    pageSize={ADMIN_PAGE_SIZE}
                    total={totalCount}
                    unit="건"
                    hrefFor={(target) =>
                        adminPageHref(
                            "/admin/syncs",
                            {
                                status: status === "all" ? undefined : status,
                            },
                            target
                        )
                    }
                />
            </AdminCard>
        </div>
    );
}
