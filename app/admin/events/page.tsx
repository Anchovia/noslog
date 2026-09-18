import { ChevronRight } from "lucide-react";
import Link from "next/link";

import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import {
    ADMIN_EVENT_TABS,
    getAdminEventList,
} from "@/features/events/server/eventAdminService";
import type { EventStatus } from "@/features/events/schemas/eventSchema";
import { eventPeriod } from "@/features/events/components/eventParts";

const LABELS: Record<EventStatus, string> = {
    DRAFT: "임시저장",
    PENDING: "검토 대기",
    CHANGES_REQUESTED: "수정 요청",
    PUBLISHED: "공개",
    REJECTED: "반려",
};
// 관리자 화면의 시각은 한국 시간으로 (2026-09-16)
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
});

// 이벤트 검토 목록 — 기존 관리자 목록 모양(nl-admin-list · row · chip) + 위 상태 탭 (2026-09-18)
export default async function AdminEventsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const query = await searchParams;
    const status =
        ADMIN_EVENT_TABS.find((item) => item === query.status) ?? "PENDING";
    const { items, counts } = await getAdminEventList(status);
    return (
        <PageContainer>
            <PageHeading
                title="이벤트"
                description="유저가 쓴 이벤트 글을 검토합니다. 수정 요청 · 반려 사유는 작성자 편집 화면 맨 위에 그대로 보입니다."
            />
            <nav className="nl-tabs nl-tabs--primary" aria-label="상태">
                {ADMIN_EVENT_TABS.map((item) => (
                    <Link
                        key={item}
                        href={
                            item === "PENDING"
                                ? "/admin/events"
                                : `/admin/events?status=${item}`
                        }
                        className="nl-tabs__item nl-control"
                        data-state={item === status ? "active" : "inactive"}
                        aria-current={item === status ? "page" : undefined}
                    >
                        {LABELS[item]}
                        <span className="nl-events__count nl-muted">
                            {counts[item] ?? 0}
                        </span>
                    </Link>
                ))}
            </nav>
            {items.length === 0 ? (
                <p className="nl-admin-empty nl-body nl-muted">
                    {LABELS[status]} 글이 없습니다.
                </p>
            ) : (
                <ul className="nl-admin-list">
                    {items.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={`/admin/events/${item.id}`}
                                className="nl-admin-row"
                            >
                                <div className="nl-admin-row__body">
                                    <span className="nl-admin-row__title nl-entity-title">
                                        {item.title}
                                    </span>
                                    <div className="nl-admin-row__meta nl-metadata">
                                        {item.publishedAt &&
                                        status !== "PUBLISHED" ? (
                                            <span className="nl-admin-chip nl-admin-chip--live nl-metadata">
                                                공개 중
                                            </span>
                                        ) : null}
                                        <span>
                                            {item.author.username ??
                                                `#${item.author.id}`}
                                        </span>
                                        <span>
                                            {item.submittedAt
                                                ? `요청 ${dateFormat.format(item.submittedAt)}`
                                                : `수정 ${dateFormat.format(item.updatedAt)}`}
                                        </span>
                                        <span>
                                            기간{" "}
                                            {eventPeriod(
                                                item.startsAt.toISOString(),
                                                item.endsAt.toISOString(),
                                                "ko"
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="nl-icon" aria-hidden />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </PageContainer>
    );
}
