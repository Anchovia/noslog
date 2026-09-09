import type {
    ProfileMode,
    ProfileUser,
} from "@/components/profile/dashboard/profileTypes";
import { normalizeStoredGrade } from "@/lib/utils";

export function getProfileCardMode(user: ProfileUser, mode: ProfileMode) {
    const grade = normalizeStoredGrade(
        mode === "recital" ? user.grade_recital : user.grade_basic
    );
    return {
        label: mode === "recital" ? "Recital" : "Basic",
        grade,
        globalRank: mode === "recital" ? user.rank_recital : user.rank_basic,
        countryRank:
            mode === "recital"
                ? user.rank_recital_country
                : user.rank_basic_country,
    };
}

export function getProfileCardInitial(name: string, locale: string) {
    for (const { segment } of new Intl.Segmenter(locale, {
        granularity: "grapheme",
    }).segment(name)) {
        if (/\p{L}/u.test(segment)) return segment.toLocaleUpperCase(locale);
    }
    return "N";
}

export function getCardExamColor(exam: number) {
    if (exam === 1) return "#F2A634";
    if (exam === 2) return "#D85C4F";
    if (exam <= 4) return "#AD69E9";
    if (exam <= 7) return "#3FA2FF";
    return "#8A8A8A";
}
