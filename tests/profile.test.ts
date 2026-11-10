import { describe, expect, it } from "vitest";

import {
    formatProfileDate,
    getProfileCountryCode,
} from "@/features/profile/profile-utils";

describe("프로필 표시 유틸리티", () => {
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
});
