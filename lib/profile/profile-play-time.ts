import type { Locale } from "@/lib/i18n/routing";

export function formatProfilePlayTime(source: string | null, locale: Locale) {
    if (!source) return null;
    // 북마클릿이 가져온 최근 플레이는 「2026/09/12 22:30」 — 빗금 날짜는 ISO 로 바꿔야 읽힌다(2026-09-26)
    const normalized = source
        .trim()
        .replace(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/, (_, y, m, d) =>
            [y, m.padStart(2, "0"), d.padStart(2, "0")].join("-")
        )
        .replace(" ", "T");
    const date = new Date(
        /(?:Z|[+-]\d{2}:?\d{2})$/.test(normalized)
            ? normalized
            : `${normalized}+09:00`
    );
    if (!Number.isFinite(date.getTime()))
        return { label: source, dateTime: undefined };
    const parts = new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Seoul",
        month: locale === "en" ? "short" : "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((value) => value.type === type)?.value ?? "";
    const time = `${part("hour").padStart(2, "0")}:${part("minute").padStart(2, "0")}`;
    // ICU versions differ in combined-date literals (comma versus "at"). Keep
    // the approved compact composition identical during SSR and hydration.
    const label =
        locale === "ko"
            ? `${part("month")}월 ${part("day")}일 ${time}`
            : locale === "ja"
              ? `${part("month")}月${part("day")}日 ${time}`
              : `${part("month")} ${part("day")}, ${time}`;
    return { label, dateTime: date.toISOString() };
}

/** 베스트 기록의 달성 날짜(2026-09-25) — 올해면 월 · 일, 지난해 것은 연도까지. 시각은 두지 않는다 */
export function formatProfileRecordDate(
    source: string | null,
    locale: Locale,
    now = new Date()
) {
    const time = formatProfilePlayTime(source, locale);
    if (!time?.dateTime) return time;
    const date = new Date(time.dateTime);
    const year = (value: Date) =>
        new Intl.DateTimeFormat("en", {
            timeZone: "Asia/Seoul",
            year: "numeric",
        }).format(value);
    return {
        dateTime: time.dateTime,
        label: new Intl.DateTimeFormat(locale, {
            timeZone: "Asia/Seoul",
            year: year(date) === year(now) ? undefined : "numeric",
            month: locale === "en" ? "short" : "numeric",
            day: "numeric",
        }).format(date),
    };
}
