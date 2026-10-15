"use client";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import Pagination from "@/components/ui/pagination";
import type { AnnouncementCategory } from "@/features/announcements/schemas/public-announcement-schema";
import { announcementsQuery } from "@/features/announcements/schemas/public-announcement-schema";

export default function AnnouncementPagination({
    page,
    totalPages,
    category,
}: {
    page: number;
    totalPages: number;
    /** 쪽을 넘겨도 분류 필터를 유지한다 */
    category: AnnouncementCategory | null;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const pageHref = (value: number) =>
        `${href("/announcements")}${announcementsQuery(category, value)}`;
    return (
        <Pagination
            page={page}
            totalPages={totalPages}
            label={t("home.announcements")}
            pageLabel={(value) => t("announcements.pageLabel", { page: value })}
            previousLabel={t("common.previousPage")}
            nextLabel={t("common.nextPage")}
            pageHref={pageHref}
            onPageChange={(value) =>
                window.location.assign(
                    new URL(pageHref(value), window.location.origin).href
                )
            }
        />
    );
}
