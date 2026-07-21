import { describe, expect, it } from "vitest";

import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import {
    formatProfileDate,
    formatProfileGrade,
    getProfileCountryCode,
    getProfileDifficultyColor,
    getProfileRankRows,
} from "@/components/profile/dashboard/profileUtils";

function profileUser(): ProfileUser {
    return {
        id: 1,
        username: "CAROL",
        nostalgia_name: "CAROL",
        discord_name: "carol",
        discord_username: "carol_tag",
        preferredArcade: null,
        avatar: null,
        country: "ko-KR",
        rank_basic: 1,
        rank_basic_country: 1,
        rank_recital: null,
        rank_recital_country: null,
        grade_basic: 568300,
        grade_recital: null,
        exam_basic: 7,
        exam_recital: null,
        play_count: 10,
        hide_nostalgia_name: false,
        hide_discord_name: false,
        hide_play_count: false,
        score_p: 1,
        score_f: 2,
        score_s: 3,
        score_a2: 4,
        score_a: 5,
        score_b2: 6,
        score_b: 7,
        score_c: 8,
        score_d: 9,
        created_at: "2026-07-18",
        last_played_at: null,
    };
}

describe("프로필 표시 유틸리티", () => {
    it("저장된 그레이드를 화면 표시 단위로 변환한다", () => {
        expect(formatProfileGrade(568300)).toBe("5,683");
        expect(formatProfileGrade(null)).toBe("-");
        expect(formatProfileGrade(0)).toBe("-");
    });

    it("국가 로케일을 짧은 국가 코드로 변환한다", () => {
        expect(getProfileCountryCode("ko-KR")).toBe("KR");
        expect(getProfileCountryCode("ja-JP")).toBe("JP");
        expect(getProfileCountryCode("en-US")).toBe("US");
        expect(getProfileCountryCode("")).toBe("GLO");
    });

    it("날짜가 없거나 파싱할 수 없어도 안전하게 표시한다", () => {
        expect(formatProfileDate(null)).toBe("기록 없음");
        expect(formatProfileDate("2026-07-18 invalid")).toBe("2026.07.18");
    });

    it("난이도 표기는 대소문자를 구분하지 않는다", () => {
        expect(getProfileDifficultyColor("Expert")).toBe("text-expert");
        expect(getProfileDifficultyColor("real")).toBe("text-real");
    });

    it("랭크 카운트를 화면 순서대로 만든다", () => {
        const rows = getProfileRankRows(profileUser());

        expect(rows.map((row) => row.label)).toEqual([
            "P",
            "FC",
            "S",
            "A+",
            "A",
            "B+",
            "B",
            "C",
            "D",
        ]);
        expect(rows.map((row) => row.value)).toEqual([
            1, 2, 3, 4, 5, 6, 7, 8, 9,
        ]);
    });
});
