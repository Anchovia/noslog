import { notFound, redirect } from "next/navigation";

import AnnouncementArchive from "@/features/announcements/components/announcement-archive";
import {
    announcementCategoryFromQuery,
    announcementsQuery,
} from "@/features/announcements/schemas/public-announcement-schema";
import { getAnnouncementArchive } from "@/features/announcements/server/public-announcement-service";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

type Search = Promise<{ page?: string; category?: string }>;
export async function generateMetadata({
    searchParams,
}: {
    searchParams: Search;
}) {
    const [{ locale, t }, query] = await Promise.all([
        getServerI18n(),
        searchParams,
    ]);
    const page = Number(query.page);
    return createPageMetadata({
        title: `${t("news.title")} · ${t("home.announcements")}`,
        description: t("announcements.metaDescription"),
        path: `${localizePath("/announcements", locale)}${announcementsQuery(
            announcementCategoryFromQuery(query.category) ?? null,
            Number.isSafeInteger(page) ? page : 1
        )}`,
    });
}
export default async function AnnouncementsPage({
    searchParams,
}: {
    searchParams: Search;
}) {
    const [{ locale }, query] = await Promise.all([
        getServerI18n(),
        searchParams,
    ]);
    const home = localizePath("/announcements", locale);
    const category = announcementCategoryFromQuery(query.category);
    if (category === undefined) redirect(home);
    const page = query.page === undefined ? 1 : Number(query.page);
    if (
        !Number.isSafeInteger(page) ||
        page < 1 ||
        (query.page !== undefined && String(page) !== query.page)
    )
        redirect(`${home}${announcementsQuery(category, 1)}`);
    if (query.page === "1")
        redirect(`${home}${announcementsQuery(category, 1)}`);
    const data = await getAnnouncementArchive(locale, category, page);
    if (!data) notFound();
    return <AnnouncementArchive {...data} />;
}
