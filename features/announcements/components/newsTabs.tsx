import Link from "next/link";

import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";

/**
 * 「소식」 입구 탭(2026-09-26 N1 · E1) — 공지사항 · 이벤트 두 게시판을 한 입구로 잇는다.
 * 게시판 · 주소(/announcements · /events)는 따로, 두 목록 머리에 같은 1단 탭만 둔다.
 * 그 아래 거르기는 두 쪽 모두 필터 칩(공지 분류 · 이벤트 상태)
 */
export default async function NewsTabs({
    current,
}: {
    current: "announcements" | "events";
}) {
    const { locale, t } = await getServerI18n();
    const items = [
        { key: "announcements", label: t("home.announcements") },
        { key: "events", label: t("events.title") },
    ] as const;
    return (
        <nav className="nl-tabs nl-tabs--primary" aria-label={t("news.tabs")}>
            {items.map((item) => (
                <Link
                    key={item.key}
                    prefetch={false}
                    href={localizePath(`/${item.key}`, locale)}
                    className="nl-tabs__item nl-control"
                    data-state={item.key === current ? "active" : "inactive"}
                    aria-current={item.key === current ? "page" : undefined}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
