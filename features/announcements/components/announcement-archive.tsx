import PageContainer, { PageHeading } from "@/components/layout/page-container";
import BackLink from "@/components/ui/back-link";
import FilterChipLinks from "@/components/ui/filter-chip-links";
import type {
    AnnouncementCategory,
    PublicAnnouncementSummary,
} from "@/features/announcements/schemas/public-announcement-schema";
import {
    ANNOUNCEMENT_CATEGORIES,
    announcementsQuery,
} from "@/features/announcements/schemas/public-announcement-schema";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

import AnnouncementPagination from "./announcement-pagination";
import AnnouncementRow from "./announcement-row";
import NewsTabs from "./news-tabs";

export default async function AnnouncementArchive({
    category,
    pinned,
    announcements,
    page,
    totalPages,
}: {
    category: AnnouncementCategory | null;
    pinned: PublicAnnouncementSummary[];
    announcements: PublicAnnouncementSummary[];
    page: number;
    totalPages: number;
}) {
    const { locale, t } = await getServerI18n();
    const base = localizePath("/announcements", locale);
    const categoryLabel = (item: PublicAnnouncementSummary) =>
        t(`announcements.category.${item.category}`);
    return (
        <PageContainer width="reading" className="nl-announcements">
            <BackLink href={localizePath("/", locale)}>
                {t("common.home")}
            </BackLink>
            <PageHeading title={t("news.title")} />
            <NewsTabs current="announcements" />
            {/* 분류 필터 — 태그를 누르게 하지 않고 목록 위에 따로 (2026-09-18 B1) */}
            <FilterChipLinks
                label={t("announcements.filter")}
                options={[null, ...ANNOUNCEMENT_CATEGORIES].map((value) => ({
                    key: value ?? "all",
                    label: value
                        ? t(`announcements.category.${value}`)
                        : t("announcements.all"),
                    href: `${base}${announcementsQuery(value, 1)}`,
                    selected: value === category,
                }))}
            />
            {pinned.length ? (
                <ul className="nl-announcements__pinned">
                    {pinned.map((announcement) => (
                        <li key={announcement.id}>
                            <AnnouncementRow
                                announcement={announcement}
                                locale={locale}
                                categoryLabel={categoryLabel(announcement)}
                                pinned
                                pinnedLabel={t("announcements.pinned")}
                            />
                        </li>
                    ))}
                </ul>
            ) : null}
            {announcements.length ? (
                <ul className="nl-announcements__list">
                    {/* 월 제목 없음(2026-09-26 G1) — 날짜가 줄마다 오른쪽에 있다 */}
                    {announcements.map((announcement) => (
                        <li key={announcement.id}>
                            <AnnouncementRow
                                announcement={announcement}
                                locale={locale}
                                categoryLabel={categoryLabel(announcement)}
                            />
                        </li>
                    ))}
                </ul>
            ) : pinned.length ? null : (
                <p className="nl-body-secondary nl-muted">
                    {t("announcements.empty")}
                </p>
            )}
            <AnnouncementPagination
                page={page}
                totalPages={totalPages}
                category={category}
            />
        </PageContainer>
    );
}
