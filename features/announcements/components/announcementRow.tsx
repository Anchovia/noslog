import Link from "next/link";
import { localizePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";
import AnnouncementCategoryTag from "./announcementCategoryTag";

export function announcementDate(date: string, locale: Locale) {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: locale === "en" ? "short" : locale === "ja" ? "long" : "numeric",
        day: "numeric",
        timeZone: "Asia/Seoul",
    }).format(new Date(date));
}
export default function AnnouncementRow({
    announcement,
    locale,
    categoryLabel,
    pinned = false,
    pinnedLabel,
}: {
    announcement: PublicAnnouncement;
    locale: Locale;
    categoryLabel: string;
    // 활성 중대 공지로 목록 최상단에 고정된 행. 홈은 면 없이 「고정」 태그만(2026-09-18 N2), 전체 목록은 면 카드(B1)
    pinned?: boolean;
    // 고정 줄 — 분류 태그 뒤 「고정」 태그(기본 테두리 태그, 2026-09-18 N2). 홈 카드 · 전체 목록 모두
    pinnedLabel?: string;
}) {
    return (
        <div
            className="nl-announcement-row"
            data-pinned={pinned ? "" : undefined}
        >
            {/* 분류·날짜는 제목 위 한 줄 — 칩 폭이 달라도 제목이 같은 선에서 시작한다 (GitHub·Apple 방식) */}
            <div className="nl-announcement-meta">
                <AnnouncementCategoryTag
                    category={announcement.category}
                    label={categoryLabel}
                />
                {pinnedLabel ? (
                    <span className="nl-tag nl-metadata">{pinnedLabel}</span>
                ) : null}
                <time
                    className="nl-metadata nl-muted"
                    dateTime={announcement.publishedAt}
                >
                    {announcementDate(announcement.publishedAt, locale)}
                </time>
            </div>
            <p className="nl-announcement-row__title nl-body">
                <Link
                    prefetch={false}
                    href={localizePath(
                        `/announcements/${announcement.slug}`,
                        locale
                    )}
                >
                    {announcement.title}
                </Link>
            </p>
        </div>
    );
}
