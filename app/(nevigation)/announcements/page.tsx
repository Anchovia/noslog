import { notFound, redirect } from "next/navigation";
import AnnouncementArchive from "@/features/announcements/components/announcementArchive";
import { getAnnouncementArchive } from "@/features/announcements/server/publicAnnouncementService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

type Search = Promise<{ page?: string }>;
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
        title: t("home.announcements"),
        path: `${localizePath("/announcements", locale)}${Number.isSafeInteger(page) && page > 1 ? `?page=${page}` : ""}`,
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
    const page = query.page === undefined ? 1 : Number(query.page);
    if (
        !Number.isSafeInteger(page) ||
        page < 1 ||
        (query.page !== undefined && String(page) !== query.page)
    )
        redirect(localizePath("/announcements", locale));
    if (query.page === "1") redirect(localizePath("/announcements", locale));
    const data = await getAnnouncementArchive(locale, page);
    if (!data) notFound();
    return <AnnouncementArchive {...data} />;
}
