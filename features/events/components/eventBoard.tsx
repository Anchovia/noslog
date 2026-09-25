import Link from "next/link";

import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import BackLink from "@/components/ui/backLink";
import FilterChipLinks from "@/components/ui/filterChipLinks";
import NewsTabs from "@/features/announcements/components/newsTabs";
import { foundationButtonClass } from "@/components/ui/Button";
import {
    EVENT_PHASES,
    type EventPhase,
} from "@/features/events/schemas/eventSchema";
import type { PublicEventItem } from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { EventBanner, eventPeriod } from "./eventParts";

// 이벤트 목록 L1 (2026-09-18) — 「소식」 입구 탭 아래 상태 칩(진행 중 · 예정 · 종료, 2026-09-26 E1) + 배너 카드. 칩이 상태를 말하므로 카드엔 상태 태그 없음
export default async function EventBoard({
    phase,
    board,
    writer,
}: {
    phase: EventPhase;
    board: Record<EventPhase, PublicEventItem[]>;
    writer: { userId: number | null; eligible: boolean };
}) {
    const { locale, t } = await getServerI18n();
    const base = localizePath("/events", locale);
    const events = board[phase];
    const lock = !writer.userId
        ? t("events.lock.login")
        : !writer.eligible
          ? t("events.lock.record")
          : null;
    return (
        <PageContainer width="reading" className="nl-events">
            <BackLink href={localizePath("/", locale)}>
                {t("common.home")}
            </BackLink>
            {/* 쓸 수 없으면 비활성 버튼 + 이유 한 줄 — 서열 투표 잠금과 같은 방식 */}
            <PageHeading
                title={t("news.title")}
                description={lock}
                action={
                    <div className="nl-events__actions">
                        {writer.userId ? (
                            <Link
                                href={localizePath("/events/mine", locale)}
                                className={foundationButtonClass({
                                    variant: "ghost",
                                    size: "sm",
                                })}
                            >
                                {t("events.mine")}
                            </Link>
                        ) : null}
                        {lock ? (
                            <button
                                type="button"
                                disabled
                                className={foundationButtonClass({
                                    variant: "secondary",
                                    size: "sm",
                                })}
                            >
                                {t("events.write")}
                            </button>
                        ) : (
                            <Link
                                href={localizePath("/events/new", locale)}
                                className={foundationButtonClass({
                                    variant: "secondary",
                                    size: "sm",
                                })}
                            >
                                {t("events.write")}
                            </Link>
                        )}
                    </div>
                }
            />
            <NewsTabs current="events" />
            <FilterChipLinks
                label={t("events.tabs")}
                options={EVENT_PHASES.map((item) => ({
                    key: item,
                    label: `${t(`events.phase.${item}`)} ${board[item].length}`,
                    href: item === "live" ? base : `${base}?tab=${item}`,
                    selected: item === phase,
                }))}
            />
            {events.length ? (
                <ul className="nl-events__cards">
                    {events.map((event, index) => (
                        <li key={event.id}>
                            <Link
                                prefetch={false}
                                href={localizePath(
                                    `/events/${event.id}`,
                                    locale
                                )}
                                className="nl-event-card"
                            >
                                <EventBanner
                                    src={event.bannerUrl}
                                    sizes="(min-width: 672px) 376px, 100vw"
                                    priority={index < 2}
                                />
                                <span className="nl-entity-title">
                                    {event.title}
                                </span>
                                <span className="nl-body-secondary nl-muted">
                                    {eventPeriod(
                                        event.startsAt,
                                        event.endsAt,
                                        locale
                                    )}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="nl-body nl-muted">{t(`events.empty.${phase}`)}</p>
            )}
        </PageContainer>
    );
}
