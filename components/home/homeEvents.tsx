import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { eventPeriod } from "@/features/events/components/eventParts";
import type { PublicEventItem } from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";

// 홈 「진행 중인 이벤트」 (2026-09-18 H1) — 공지사항 바로 아래, 진행 중일 때만. 큰 배너 카드 위에 제목 · 기간을 얹는다.
// 글자 아래는 어두운 층(media-scrim) + 위로 갈수록 옅어지는 흐림 — 경계가 딱딱하게 보이지 않게
export default async function HomeEvents({
    events,
}: {
    events: PublicEventItem[];
}) {
    if (!events.length) return null;
    const { locale, t } = await getServerI18n();
    return (
        <section className="nl-home-update nl-home-events">
            <div className="nl-home-update__heading">
                <h2 className="nl-section-title">{t("home.liveEvents")}</h2>
                <Link
                    href={getLocalizedHref("/events", locale)}
                    className="nl-control"
                >
                    {t("home.allEvents")}
                    <ChevronRight aria-hidden />
                </Link>
            </div>
            <ul className="nl-home-events__list">
                {events.map((event, index) => (
                    <li key={event.id}>
                        <Link
                            prefetch={false}
                            href={getLocalizedHref(
                                `/events/${event.id}`,
                                locale
                            )}
                            className="nl-home-event"
                        >
                            {event.bannerUrl ? (
                                <Image
                                    src={event.bannerUrl}
                                    alt=""
                                    fill
                                    sizes="(min-width: 672px) 640px, 100vw"
                                    priority={index === 0}
                                />
                            ) : null}
                            <span className="nl-home-event__caption">
                                <span className="nl-entity-title">
                                    {event.title}
                                </span>
                                <span className="nl-body-secondary">
                                    {eventPeriod(
                                        event.startsAt,
                                        event.endsAt,
                                        locale
                                    )}
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
