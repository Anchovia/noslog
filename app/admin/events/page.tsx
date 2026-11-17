import Link from "next/link";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCountTabs,
    AdminPager,
    AdminStatus,
    AdminTable,
} from "@/components/admin/admin-card";
import {
    ADMIN_EVENT_TABS,
    getAdminEventList,
} from "@/features/events/server/event-admin-service";
import type { EventStatus } from "@/features/events/schemas/event-schema";
import { eventPeriod } from "@/features/events/components/event-parts";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageArgs,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

const LABELS: Record<EventStatus, string> = {
    draft: "임시저장",
    pending: "검토 대기",
    changes_requested: "수정 요청",
    approved: "공개",
    rejected: "반려",
};
// 관리자 화면의 시각은 한국 시간으로 (2026-09-16)
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
});

export default async function AdminEventsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string }>;
}) {
    await requireAdmin();
    const query = await searchParams;
    const status =
        ADMIN_EVENT_TABS.find((item) => item === query.status) ?? "pending";
    const page = parseAdminPage(query.page);
    const { items, counts } = await getAdminEventList(
        status,
        adminPageArgs(page)
    );
    // 승인 탭은 모두 공개 중이라 「공개 중」 칸을 다른 탭에서만 보인다
    const showLive = status !== "approved";
    return (
        <div className="nl-admin-stack">
            <AdminCountTabs
                label="상태"
                options={ADMIN_EVENT_TABS.map((item) => ({
                    key: item,
                    label: LABELS[item],
                    count: counts[item] ?? 0,
                    href:
                        item === "pending"
                            ? "/admin/events"
                            : `/admin/events?status=${item}`,
                    selected: item === status,
                }))}
            />
            <AdminCard>
                <AdminCardHead title="이벤트" />
                {items.length === 0 ? (
                    <AdminCardEmpty>
                        {LABELS[status]} 글이 없습니다.
                    </AdminCardEmpty>
                ) : (
                    <>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th>요청 · 수정</th>
                                    <th>기간</th>
                                    {showLive ? <th>공개</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <Link
                                                href={`/admin/events/${item.id}`}
                                            >
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td>
                                            {item.author.username ??
                                                `#${item.author.id}`}
                                        </td>
                                        <td>
                                            {item.submittedAt
                                                ? `요청 ${dateFormat.format(item.submittedAt)}`
                                                : `수정 ${dateFormat.format(item.updatedAt)}`}
                                        </td>
                                        <td>
                                            {eventPeriod(
                                                item.startsAt.toISOString(),
                                                item.endsAt.toISOString(),
                                                "ko"
                                            )}
                                        </td>
                                        {showLive ? (
                                            <td>
                                                {item.publishedAt ? (
                                                    <AdminStatus tone="success">
                                                        공개 중
                                                    </AdminStatus>
                                                ) : null}
                                            </td>
                                        ) : null}
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                        <AdminPager
                            page={page}
                            pageSize={ADMIN_PAGE_SIZE}
                            total={counts[status] ?? 0}
                            unit="건"
                            hrefFor={(next) =>
                                adminPageHref(
                                    "/admin/events",
                                    { status: query.status },
                                    next
                                )
                            }
                        />
                    </>
                )}
            </AdminCard>
        </div>
    );
}
