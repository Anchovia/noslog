import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { eventPeriod } from "@/features/events/components/event-parts";
import type { PublicEventItem } from "@/features/events/server/event-service";
import { getLocalizedHref } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

// 홈 「진행 중인 이벤트」 (2026-09-18 H1) — 공지사항 바로 아래, 늘 보인다(이벤트로 가는 길). 큰 배너 카드 위에 제목 · 기간을 얹는다.
// 진행 중인 이벤트가 없으면 안내 한 줄 + 「이벤트 글쓰기」 글자 링크(2026-09-28 인상 점검 A3)
// 글자 아래는 어두운 층(media-scrim) + 위로 갈수록 옅어지는 흐림 — 경계가 딱딱하게 보이지 않게
export default async function HomeEvents({
    events,
}: {
    events: PublicEventItem[];
}) {
    const { locale, t } = await getServerI18n();
    return (
        <section className="nl-home-update nl-home-events">
            <div className="nl-heading-row">
                <h2 className="nl-section-title">{t("home.liveEvents")}</h2>
                <Link
                    href={getLocalizedHref("/events", locale)}
                    className="nl-heading-link nl-control"
                >
                    {t("home.allEvents")}
                    <ChevronRight aria-hidden />
                </Link>
            </div>
            {events.length ? (
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
            ) : (
                /* 빈 상태는 한 줄만 — 「이벤트 글쓰기」 는 제목 줄 「전체 이벤트 ›」 와 겹쳐 꽉 차 보였다(2026-10-01 사용자) */
                <div className="nl-home-events__empty">
                    <p className="nl-body-secondary nl-muted">
                        {t("events.empty.live")}
                    </p>
                </div>
            )}
        </section>
    );
}
