import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EventDetail from "@/features/events/components/event-detail";
import {
    getOwnEvent,
    getPublicEventDetail,
} from "@/features/events/server/event-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { markdownExcerpt } from "@/lib/metadata/excerpt";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";

type Params = Promise<{ id: string }>;
function parseId(value: string) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 && String(id) === value
        ? id
        : null;
}
export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const [{ locale }, { id }] = await Promise.all([getServerI18n(), params]);
    const eventId = parseId(id);
    const event = eventId ? await getPublicEventDetail(eventId) : null;
    if (!event) notFound();
    return createPageMetadata({
        title: event.title,
        description: markdownExcerpt(event.content) ?? event.title,
        path: localizePath(`/events/${event.id}`, locale),
    });
}
export default async function EventPage({ params }: { params: Params }) {
    const { id } = await params;
    const eventId = parseId(id);
    const event = eventId ? await getPublicEventDetail(eventId) : null;
    if (!event) notFound();
    // 내 글인지만 본다 — 작성 자격(동기화 기록)은 여기서 쓰지 않아 조회하지 않는다(2026-10-15 S13)
    const session = await getSession();
    const own = session.id ? await getOwnEvent(session.id, event.id) : null;
    return (
        <EventDetail
            event={event}
            own={
                own
                    ? {
                          // 공개판과 다른 작성 중인 판이 있다 = 공개 상태가 아닌 채로 고치는 중
                          editing: own.status !== "PUBLISHED",
                      }
                    : null
            }
        />
    );
}
