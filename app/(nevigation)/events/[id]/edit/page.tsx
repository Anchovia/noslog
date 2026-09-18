import { notFound, redirect } from "next/navigation";

import EventEditorPage from "@/features/events/components/eventEditorPage";
import {
    getEventWriter,
    getOwnEvent,
} from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";

export const metadata = { robots: { index: false, follow: false } };

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [{ locale }, { id }, writer] = await Promise.all([
        getServerI18n(),
        params,
        getEventWriter(),
    ]);
    if (!writer.userId) redirect(localizePath("/events", locale));
    const eventId = Number(id);
    if (!Number.isSafeInteger(eventId) || eventId < 1) notFound();
    const event = await getOwnEvent(writer.userId, eventId);
    if (!event) notFound();
    return <EventEditorPage event={event} eligible={writer.eligible} />;
}
