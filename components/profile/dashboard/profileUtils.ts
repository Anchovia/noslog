import type { ProfileRankRow, ProfileUser } from "./profileTypes";

export const PROFILE_RANK_COLORS = [
    "bg-rank-p-start",
    "bg-rank-fc",
    "bg-rank-s",
    "bg-rank-a-plus",
    "bg-rank-a",
    "bg-text-disabled",
    "bg-text-disabled",
    "bg-text-disabled",
    "bg-text-disabled",
];

export const PROFILE_RANK_ICON_NAMES = [
    "p",
    "fc_bg",
    "s",
    "a2",
    "a",
    "b2",
    "b",
    "c",
    "d",
];

export const PROFILE_RANK_ICON_BASE_URL =
    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade";

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

export function formatProfileDate(value: string | null) {
    if (!value) return "기록 없음";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value.split(" ")[0].replaceAll("-", ".");
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
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
