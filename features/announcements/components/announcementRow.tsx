import { Pin } from "lucide-react";
import Link from "next/link";
import { localizePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";
import type { PublicAnnouncementSummary } from "@/features/announcements/schemas/publicAnnouncementSchema";
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
    announcement: PublicAnnouncementSummary;
    locale: Locale;
    categoryLabel: string;
    // 활성 중대 공지로 목록 최상단에 고정된 행. 홈은 면 없이 고정 표시만(2026-09-18 N2), 전체 목록은 면 카드(B1)
    pinned?: boolean;
    // 고정 표시 = 날짜 앞 핀 아이콘 16, 이름은 화면 읽기로(2026-09-28 인상 점검 A4 — 줄마다 태그 두 개 대신 태그 하나)
    pinnedLabel?: string;
}) {
    return (
        <div
            className="nl-announcement-row"
            data-pinned={pinned ? "" : undefined}
        >
            {/* 한 줄(2026-09-26 R1) — 분류 태그 · 제목 · 오른쪽 (고정 핀 ·) 날짜. 폰은 「태그 … 날짜」 위 · 제목 아래 */}
            <div className="nl-announcement-meta">
                <AnnouncementCategoryTag
                    category={announcement.category}
                    label={categoryLabel}
                />
            </div>
            <p className="nl-announcement-row__title nl-entity-title">
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
            <span className="nl-announcement-row__date nl-metadata nl-muted">
                {pinnedLabel ? (
                    <>
                        <Pin className="nl-icon-small" aria-hidden />
                        <span className="sr-only">{pinnedLabel}</span>
                    </>
                ) : null}
                <time dateTime={announcement.publishedAt}>
                    {announcementDate(announcement.publishedAt, locale)}
                </time>
            </span>
        </div>
    );
}
