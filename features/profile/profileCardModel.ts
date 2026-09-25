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

/**
 * 카드의 FC 수 = FC 램프 + Pianist(2026-09-25, 사용자). Pianist 도 풀 콤보라 「P 1000 · FC 100」 처럼 FC 가 P 보다 적게 보이지 않게.
 * 동기화는 score_f 에 FC 램프(fc_type 2)만, score_p 에 P 랭크(= Pianist 램프 fc_type 3)를 따로 센다
 */
export function getProfileCardFullComboCount(user: ProfileUser) {
    return (user.score_f ?? 0) + (user.score_p ?? 0);
}

export function getProfileCardInitial(name: string, locale: string) {
    for (const { segment } of new Intl.Segmenter(locale, {
        granularity: "grapheme",
    }).segment(name)) {
        if (/\p{L}/u.test(segment)) return segment.toLocaleUpperCase(locale);
    }
    return "N";
}
