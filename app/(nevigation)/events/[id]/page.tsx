import { notFound } from "next/navigation";
import type { Metadata } from "next";

import EventDetail from "@/features/events/components/eventDetail";
import {
    getEventWriter,
    getOwnEvent,
    getPublicEventDetail,
} from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

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
        description: event.title,
        path: localizePath(`/events/${event.id}`, locale),
    });
}
export default async function EventPage({ params }: { params: Params }) {
    const { id } = await params;
    const eventId = parseId(id);
    const event = eventId ? await getPublicEventDetail(eventId) : null;
    if (!event) notFound();
    const writer = await getEventWriter();
    const own = writer.userId
        ? await getOwnEvent(writer.userId, event.id)
        : null;
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
