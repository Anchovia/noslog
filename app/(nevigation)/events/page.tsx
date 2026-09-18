import { redirect } from "next/navigation";

import EventBoard from "@/features/events/components/eventBoard";
import { eventPhaseFromQuery } from "@/features/events/schemas/eventSchema";
import {
    getEventBoard,
    getEventWriter,
} from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

type Search = Promise<{ tab?: string }>;
export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("events.title"),
        path: localizePath("/events", locale),
    });
}
export default async function EventsPage({
    searchParams,
}: {
    searchParams: Search;
}) {
    const [{ locale }, query] = await Promise.all([
        getServerI18n(),
        searchParams,
    ]);
    const phase = eventPhaseFromQuery(query.tab);
    if (!phase || query.tab === "live")
        redirect(localizePath("/events", locale));
    const [board, writer] = await Promise.all([
        getEventBoard(),
        getEventWriter(),
    ]);
    return <EventBoard phase={phase} board={board} writer={writer} />;
}
