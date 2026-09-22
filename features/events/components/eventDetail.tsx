import Link from "next/link";
import PollWidget from "@/features/polls/components/pollWidget";
import { getPublicPoll } from "@/features/polls/server/pollService";
import { getUser } from "@/lib/user";

import PageContainer from "@/components/layout/pageContainer";
import BackLink from "@/components/ui/backLink";
import { foundationButtonClass } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/statusMessage";
import AnnouncementBody from "@/features/announcements/components/announcementBody";
import type { PublicEventItem } from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/metadata/site";
import { EventBanner, EventStatusTag, eventPeriod } from "./eventParts";

// 이벤트 상세 — 공지 상세와 같은 문법(상태 · 기간 한 줄 → 제목) + 대표 이미지 + 본문(공지 렌더러)
export default async function EventDetail({
    event,
    own,
}: {
    event: PublicEventItem;
    /** 작성자가 보는 중 — 공개판과 다른 고친 판이 있으면 안내, 고치기 링크 */
    own: { editing: boolean } | null;
}) {
    const { locale, t } = await getServerI18n();
    const user = await getUser();
    const poll = await getPublicPoll(
        { eventId: event.id },
        locale,
        user?.id ?? null
    );
    return (
        <PageContainer width="reading" className="nl-events">
            <article className="nl-events__detail">
                <BackLink href={localizePath("/events", locale)}>
                    {t("events.title")}
                </BackLink>
                {own?.editing ? (
                    <StatusMessage
                        severity="info"
                        title={t("events.reviewingEdit.title")}
                        description={t("events.reviewingEdit.body")}
                    />
                ) : null}
                <header className="nl-events__heading">
                    <div className="nl-announcement-meta">
                        <EventStatusTag
                            status={event.phase}
                            label={t(`events.phase.${event.phase}`)}
                        />
                        <span className="nl-metadata nl-muted">
                            {eventPeriod(event.startsAt, event.endsAt, locale)}
                        </span>
                        {event.authorName ? (
                            <span className="nl-metadata nl-muted">
                                {t("events.author", { name: event.authorName })}
                            </span>
                        ) : null}
                    </div>
                    <h1 className="nl-page-title">{event.title}</h1>
                </header>
                {event.bannerUrl ? (
                    <EventBanner
                        src={event.bannerUrl}
                        sizes="(min-width: 800px) 768px, 100vw"
                        priority
                    />
                ) : null}
                <AnnouncementBody
                    content={event.content}
                    locale={locale}
                    siteUrl={SITE_URL}
                    externalLabel={t("shell.externalLink")}
                />
                {/* 글에 딸린 투표(2026-09-23 V2) */}
                {poll ? (
                    <PollWidget poll={poll} isAuthenticated={Boolean(user)} />
                ) : null}
                {own ? (
                    <Link
                        href={localizePath(`/events/${event.id}/edit`, locale)}
                        className={foundationButtonClass({
                            variant: "secondary",
                        })}
                    >
                        {t("events.editor.edit")}
                    </Link>
                ) : null}
            </article>
        </PageContainer>
    );
}
