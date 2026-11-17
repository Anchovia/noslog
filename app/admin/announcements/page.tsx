import { listAdminAnnouncements } from "@/features/announcements/server/announcement-admin-data";
import Link from "next/link";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminPager,
    AdminStatus,
    AdminTable,
} from "@/components/admin/admin-card";
import { foundationButtonClass } from "@/components/ui/button";
import {
    ANNOUNCEMENT_LOCALES,
    ANNOUNCEMENT_CATEGORY_LABELS,
    ANNOUNCEMENT_PLACEMENT_LABELS,
} from "@/features/announcements/schemas/announcement-schema";
import {
    eligibleAnnouncements,
    selectHomeAnnouncements,
} from "@/features/announcements/schemas/public-announcement-schema";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

// 관리자 화면의 시각은 서버 시간대와 무관하게 한국 시간으로 (2026-09-16)
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
});

export default async function AdminAnnouncementsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    await requireAdmin();
    const now = new Date();
    const page = parseAdminPage((await searchParams).page);
    const { announcements, totalCount, published } =
        await listAdminAnnouncements(page);
    // 공개 화면과 같은 판정으로 "실제로 보이는가" 를 계산함
    const visible = eligibleAnnouncements(published, now);
    const home = selectHomeAnnouncements(visible, now);
    const visibleIds = new Set(visible.map((item) => item.id));
    // 중대 공지는 목록 맨 위 고정으로 들어 있다(홈 배너는 2026-09-28 뺌)
    const homeIds = new Set(home.list.map((item) => item.record.id));

    return (
        <AdminCard>
            <AdminCardHead
                title="공지"
                actions={
                    <Link
                        href="/admin/announcements/new"
                        className={foundationButtonClass({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        새 공지
                    </Link>
                }
            />
            {announcements.length === 0 ? (
                <AdminCardEmpty>등록된 공지사항이 없습니다.</AdminCardEmpty>
            ) : (
                <AdminTable>
                    <thead>
                        <tr>
                            <th scope="col">제목</th>
                            <th scope="col">상태</th>
                            <th scope="col">홈</th>
                            <th scope="col">분류</th>
                            <th scope="col">문제</th>
                            <th scope="col">날짜</th>
                            <th scope="col">주소</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((announcement) => {
                            const ko = announcement.translations.find(
                                (item) => item.locale === "ko"
                            );
                            const missing = ANNOUNCEMENT_LOCALES.filter(
                                (locale) =>
                                    !announcement.translations.some(
                                        (item) =>
                                            item.locale === locale &&
                                            item.title.trim() &&
                                            item.content.trim()
                                    )
                            );
                            const isVisible = visibleIds.has(announcement.id);
                            const blocked =
                                announcement.isPublished && !isVisible;
                            const problem =
                                missing.length > 0
                                    ? `번역 없음 · ${missing.join(" / ")}`
                                    : blocked
                                      ? announcement.publicSlug
                                          ? "노출 조건 미충족"
                                          : "공개 주소 없음"
                                      : null;
                            return (
                                <tr key={announcement.id}>
                                    <td className="nl-admin-table__wrap">
                                        <Link
                                            href={`/admin/announcements/${announcement.id}`}
                                        >
                                            {ko?.title}
                                        </Link>
                                    </td>
                                    <td>
                                        {announcement.isPublished ? (
                                            <AdminStatus tone="success">
                                                공개
                                            </AdminStatus>
                                        ) : (
                                            <AdminStatus tone="empty">
                                                비공개
                                            </AdminStatus>
                                        )}
                                    </td>
                                    <td>
                                        {homeIds.has(announcement.id)
                                            ? "홈 노출"
                                            : "-"}
                                    </td>
                                    <td>
                                        {
                                            ANNOUNCEMENT_CATEGORY_LABELS[
                                                announcement.category
                                            ]
                                        }
                                        {announcement.placement ===
                                        "SERVICE_CRITICAL"
                                            ? ` · ${ANNOUNCEMENT_PLACEMENT_LABELS.SERVICE_CRITICAL}`
                                            : null}
                                    </td>
                                    <td>
                                        {problem ? (
                                            <AdminStatus tone="danger">
                                                {problem}
                                            </AdminStatus>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        {announcement.publishedAt
                                            ? `공개 ${dateFormat.format(announcement.publishedAt)}`
                                            : `작성 ${dateFormat.format(announcement.createdAt)}`}
                                    </td>
                                    <td lang="en">
                                        {announcement.publicSlug
                                            ? `/${announcement.publicSlug}`
                                            : "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </AdminTable>
            )}
            <AdminPager
                page={page}
                pageSize={ADMIN_PAGE_SIZE}
                total={totalCount}
                unit="건"
                hrefFor={(target) =>
                    adminPageHref("/admin/announcements", {}, target)
                }
            />
        </AdminCard>
    );
}
