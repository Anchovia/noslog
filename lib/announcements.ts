import "server-only";

import { getHomeAnnouncements } from "@/features/announcements/server/publicAnnouncementService";
import type { Locale } from "@/lib/i18n/routing";

export async function getPublishedAnnouncements(locale: Locale = "ko") {
    return (await getHomeAnnouncements(locale)).routine;
}
