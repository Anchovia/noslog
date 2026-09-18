import { notFound } from "next/navigation";

import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import BackLink from "@/components/ui/backLink";
import { StatusMessage } from "@/components/ui/statusMessage";
import AnnouncementBody from "@/features/announcements/components/announcementBody";
import EventReviewForm from "@/features/events/components/eventReviewForm";
import {
    EventBanner,
    eventPeriod,
} from "@/features/events/components/eventParts";
import { getAdminEvent } from "@/features/events/server/eventAdminService";
import { SITE_URL } from "@/lib/metadata/site";

const LABELS = {
    DRAFT: "임시저장",
    PENDING: "검토 대기",
    CHANGES_REQUESTED: "수정 요청",
    PUBLISHED: "공개",
    REJECTED: "반려",
} as const;
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
});

// 이벤트 한 건 검토 — 작성 중인 판을 공개 화면 렌더러로 그대로 보고, 아래에서 승인 · 수정 요청 · 반려
export default async function AdminEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = Number((await params).id);
    if (!Number.isSafeInteger(id) || id < 1) notFound();
    const event = await getAdminEvent(id);
    if (!event) notFound();
    const editingPublished =
        event.publishedAt !== null && event.status !== "PUBLISHED";
    return (
        <PageContainer width="reading">
            <BackLink href="/admin/events">이벤트</BackLink>
            <PageHeading
                title={event.title}
                description={[
                    LABELS[event.status],
                    event.author.username ?? `#${event.author.id}`,
                    `기간 ${eventPeriod(event.startsAt.toISOString(), event.endsAt.toISOString(), "ko")}`,
                    event.submittedAt
                        ? `요청 ${dateFormat.format(event.submittedAt)}`
                        : null,
                ]
                    .filter(Boolean)
                    .join(" · ")}
            />
            {editingPublished ? (
                <StatusMessage
                    severity="info"
                    title="공개 중인 글을 고친 판입니다"
                    description="승인하면 공개판이 이 내용으로 바뀝니다. 수정 요청하면 지금 공개판이 그대로 남고, 반려하면 글 전체가 내려갑니다."
                />
            ) : null}
            {event.reviewNote ? (
                <StatusMessage
                    severity="warning"
                    title={`지난 검토 사유${event.reviewer?.username ? ` · ${event.reviewer.username}` : ""}`}
                    description={event.reviewNote}
                />
            ) : null}
            {event.bannerUrl ? (
                <EventBanner src={event.bannerUrl} sizes="768px" />
            ) : null}
            <AnnouncementBody
                content={event.content}
                locale="ko"
                siteUrl={SITE_URL}
                externalLabel="외부 링크"
            />
            {event.status === "PENDING" ? (
                <EventReviewForm id={event.id} />
            ) : (
                <p className="nl-body-secondary nl-muted">
                    검토 대기인 글만 처리할 수 있습니다.
                </p>
            )}
        </PageContainer>
    );
}
