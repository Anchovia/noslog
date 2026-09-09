"use client";
import Pagination from "@/components/ui/pagination";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";

export default function AnnouncementPagination({
    page,
    totalPages,
}: {
    page: number;
    totalPages: number;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const pageHref = (value: number) =>
        `${href("/announcements")}${value > 1 ? `?page=${value}` : ""}`;
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
