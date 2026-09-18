import Image from "next/image";

import type {
    EventPhase,
    EventStatus,
} from "@/features/events/schemas/eventSchema";
import type { Locale } from "@/lib/i18n/routing";

const DAY_MS = 24 * 60 * 60 * 1000;

// 기간 한 줄 — 「2026. 9. 20. ~ 10. 3.」: 끝 날은 시작과 같은 해면 연도를 빼고(시안 L1 · H1), 해가 넘어가면 둘 다.
// 끝은 저장된 다음 날 0시에서 하루 뺀 날
export function eventPeriod(startsAt: string, endsAt: string, locale: Locale) {
    const options = {
        month: locale === "en" ? "short" : "numeric",
        day: "numeric",
        timeZone: "Asia/Seoul",
    } as const;
    const start = new Date(startsAt);
    const end = new Date(new Date(endsAt).getTime() - DAY_MS);
    const year = (date: Date) =>
        new Intl.DateTimeFormat("en", {
            year: "numeric",
            timeZone: "Asia/Seoul",
        }).format(date);
    const full = new Intl.DateTimeFormat(locale, {
        ...options,
        year: "numeric",
    });
    const short = new Intl.DateTimeFormat(locale, options);
    return `${full.format(start)} ~ ${(year(start) === year(end) ? short : full).format(end)}`;
}

// 상태 태그 = 태그 가족의 면 변형(높이 24 · 좌우 8 · 모서리 4). 색은 알림 면 토큰 (2026-09-18 결정 4)
const STATUS_TONE: Record<EventStatus | EventPhase, string> = {
    DRAFT: "neutral",
    PENDING: "warning",
    CHANGES_REQUESTED: "info",
    PUBLISHED: "success",
    REJECTED: "danger",
    live: "success",
    upcoming: "info",
    ended: "neutral",
};
export function EventStatusTag({
    status,
    label,
}: {
    status: EventStatus | EventPhase;
    label: string;
}) {
    return (
        <span
            className="nl-tag nl-tag--status nl-metadata"
            data-tone={STATUS_TONE[status]}
        >
            {label}
        </span>
    );
}

// 대표 이미지 2.4 : 1 · 모서리 8. 이미지가 없으면 같은 비율의 빈 면(가라앉은 면)
export function EventBanner({
    src,
    sizes,
    priority = false,
}: {
    src: string | null;
    sizes: string;
    priority?: boolean;
}) {
    return (
        <div className="nl-event-banner">
            {src ? (
                <Image
                    src={src}
                    alt=""
                    fill
                    sizes={sizes}
                    priority={priority}
                />
            ) : null}
        </div>
    );
}
