import { redirect } from "next/navigation";

import EventEditorPage from "@/features/events/components/eventEditorPage";
import { getEventWriter } from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return {
        ...createPageMetadata({
            title: t("events.editor.new"),
            path: localizePath("/events/new", locale),
        }),
        robots: { index: false, follow: false },
    };
}
export default async function NewEventPage() {
    const [{ locale }, writer] = await Promise.all([
        getServerI18n(),
        getEventWriter(),
    ]);
    if (!writer.userId) redirect(localizePath("/events", locale));
    return <EventEditorPage event={null} eligible={writer.eligible} />;
}
