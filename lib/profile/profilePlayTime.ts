import type { Locale } from "@/lib/i18n/routing";

export function formatProfilePlayTime(source: string | null, locale: Locale) {
    if (!source) return null;
    const normalized = source.replace(" ", "T");
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
