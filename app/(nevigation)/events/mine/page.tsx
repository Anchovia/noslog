import { redirect } from "next/navigation";

import MyEvents from "@/features/events/components/myEvents";
import {
    getEventWriter,
    getMyEvents,
} from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";

export const metadata = { robots: { index: false, follow: false } };

export default async function MyEventsPage() {
    const [{ locale }, writer] = await Promise.all([
        getServerI18n(),
        getEventWriter(),
    ]);
    if (!writer.userId) redirect(localizePath("/events", locale));
    return <MyEvents events={await getMyEvents(writer.userId)} />;
}
