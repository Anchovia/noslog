import { ChevronRight } from "lucide-react";
import Link from "next/link";

import PageContainer, { PageHeading } from "@/components/layout/page-container";
import BackLink from "@/components/ui/back-link";
import ButtonLink from "@/components/ui/button-link";
import FilterChipLinks from "@/components/ui/filter-chip-links";
import IntentLink from "@/components/ui/intent-link";
import NewsTabs from "@/features/announcements/components/news-tabs";
import {
    EVENT_PHASES,
    type EventPhase,
} from "@/features/events/schemas/event-schema";
import type { PublicEventItem } from "@/features/events/server/event-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

import { EventBanner, eventPeriod } from "./event-parts";

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
    const newPath = localizePath("/events/new", locale);
    return (
        <PageContainer width="reading" className="nl-events">
            <BackLink href={localizePath("/", locale)}>
                {t("common.home")}
            </BackLink>
            {/* 로그아웃이면 제목 줄 끝 「로그인하고 글쓰기 ›」, 쓸 자격이 없으면 「글쓰기」 를 두지 않고 설명 문장도 두지 않는다 */}
            <PageHeading
                title={t("news.title")}
                action={
                    writer.userId ? (
                        <div className="nl-events__actions">
                            <ButtonLink
                                href={localizePath("/events/mine", locale)}
                                variant="ghost"
                                size="sm"
                            >
                                {t("events.mine")}
                            </ButtonLink>
                            {writer.eligible ? (
                                <ButtonLink
                                    href={newPath}
                                    variant="secondary"
                                    size="sm"
                                >
                                    {t("events.write")}
                                </ButtonLink>
                            ) : null}
                        </div>
                    ) : (
                        <IntentLink
                            className="nl-heading-link nl-control"
                            href={`${localizePath("/login", locale)}?returnTo=${encodeURIComponent(newPath)}`}
                        >
                            {t("events.loginToWrite")}
                            <ChevronRight aria-hidden />
                        </IntentLink>
                    )
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
                <p className="nl-body-secondary nl-muted">
                    {t(`events.empty.${phase}`)}
                </p>
            )}
        </PageContainer>
    );
}
