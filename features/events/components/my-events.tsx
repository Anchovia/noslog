import Link from "next/link";

import PageContainer, { PageHeading } from "@/components/layout/page-container";
import BackLink from "@/components/ui/back-link";
import { announcementDate } from "@/features/announcements/components/announcement-row";
import type { EventStatus } from "@/features/events/schemas/event-schema";
import type { getMyEvents } from "@/features/events/server/event-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

import { EventStatusTag } from "./event-parts";

// 내 글 — 공지 목록 줄(B1)과 같은 줄 부품: 상태 태그 · 날짜 한 줄 → 제목
export default async function MyEvents({
    events,
}: {
    events: Awaited<ReturnType<typeof getMyEvents>>;
}) {
    const { locale, t } = await getServerI18n();
    return (
        <PageContainer width="reading" className="nl-events nl-announcements">
            <BackLink href={localizePath("/events", locale)}>
                {t("events.title")}
            </BackLink>
            <PageHeading title={t("events.mine")} />
            {events.length ? (
                <ul>
                    {events.map((event) => {
                        const status = event.status as EventStatus;
                        return (
                            <li key={event.id} className="nl-announcement-row">
                                <div className="nl-announcement-meta">
                                    <EventStatusTag
                                        status={status}
                                        label={t(`events.status.${status}`)}
                                    />
                                    {event.publishedAt &&
                                    status !== "PUBLISHED" ? (
                                        <span className="nl-metadata nl-muted">
                                            {t("events.mine.public")}
                                        </span>
                                    ) : null}
                                </div>
                                <p className="nl-announcement-row__title nl-entity-title">
                                    <Link
                                        prefetch={false}
                                        href={localizePath(
                                            status === "PUBLISHED"
                                                ? `/events/${event.id}`
                                                : `/events/${event.id}/edit`,
                                            locale
                                        )}
                                    >
                                        {event.title ||
                                            t("events.mine.untitled")}
                                    </Link>
                                </p>
                                <time
                                    className="nl-announcement-row__date nl-metadata nl-muted"
                                    dateTime={event.updatedAt.toISOString()}
                                >
                                    {announcementDate(
                                        event.updatedAt.toISOString(),
                                        locale
                                    )}
                                </time>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="nl-body-secondary nl-muted">
                    {t("events.mine.empty")}
                </p>
            )}
        </PageContainer>
    );
}
