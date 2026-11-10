export function formatProfileDate(
    value: string | null,
    locale: "ko" | "ja" | "en" = "ko",
    emptyLabel = "기록 없음"
) {
    if (!value) return emptyLabel;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value.split(" ")[0].replaceAll("-", ".");
    }

    return new Intl.DateTimeFormat(
        locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    )
        .format(date)
        .replaceAll(". ", ".")
        .replace(/\.$/, "");
}

export function getProfileCountryCode(country: string) {
    if (country === "ko-KR") return "KR";
    if (country === "ja-JP") return "JP";
    return country.split("-").at(-1)?.toUpperCase() || "GLO";
}
