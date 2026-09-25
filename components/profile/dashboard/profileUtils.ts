import type { ProfileRankRow, ProfileUser } from "./profileTypes";

const DIFFICULTY_COLORS: Record<string, string> = {
    normal: "text-normal",
    hard: "text-hard",
    expert: "text-expert",
    real: "text-real",
};

export function getProfileDifficultyColor(difficulty: string) {
    return DIFFICULTY_COLORS[difficulty.toLowerCase()];
}

export function formatProfileGrade(value: number | null | undefined) {
    return value ? Math.round(value / 100).toLocaleString("ko-KR") : "-";
}

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

export function getProfileRankRows(user: ProfileUser): ProfileRankRow[] {
    return [
        { label: "P", value: user.score_p ?? 0 },
        { label: "FC", value: user.score_f ?? 0 },
        { label: "S", value: user.score_s ?? 0 },
        { label: "A+", value: user.score_a2 ?? 0 },
        { label: "A", value: user.score_a ?? 0 },
        { label: "B+", value: user.score_b2 ?? 0 },
        { label: "B", value: user.score_b ?? 0 },
        { label: "C", value: user.score_c ?? 0 },
        { label: "D", value: user.score_d ?? 0 },
    ];
}

/** 상위 N% — 1% 아래는 소수 한 자리(최소 0.1), 그 위는 정수 */
export function formatTopPercent(rank: number, total: number, locale: string) {
    const percent = (rank / total) * 100;
    return percent < 1
        ? Math.max(0.1, Math.ceil(percent * 10) / 10).toLocaleString(locale, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
          })
        : Math.ceil(percent).toLocaleString(locale);
}
