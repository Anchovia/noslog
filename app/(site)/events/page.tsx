import { redirect } from "next/navigation";

import EventBoard from "@/features/events/components/event-board";
import { eventPhaseFromQuery } from "@/features/events/schemas/event-schema";
import {
    getEventBoard,
    getEventWriter,
} from "@/features/events/server/event-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

type Search = Promise<{ tab?: string }>;
export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: `${t("news.title")} · ${t("events.title")}`,
        description: t("events.metaDescription"),
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
