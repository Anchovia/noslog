import { describe, expect, it } from "vitest";

import {
    getPrivacyCopy,
    getPrivacyVersion,
    getPrivacyVersionCopy,
    PRIVACY_PREVIOUS_VERSIONS,
    privacyVersionPeriod,
} from "@/features/privacy/content/privacyContent";

describe("개인정보처리방침 이전 버전", () => {
    it("보관한 버전은 세 언어 모두 방침 형식을 지킨다", () => {
        for (const version of PRIVACY_PREVIOUS_VERSIONS)
            for (const locale of ["ko", "ja", "en"] as const)
                expect(
                    getPrivacyVersionCopy(version, locale).sections
                ).toHaveLength(12);
    });

    it("세 언어 모두 새 시행일로 바뀌었고 직전 버전과 다르다", () => {
        const [previous] = PRIVACY_PREVIOUS_VERSIONS;
        const effective = {
            ko: "시행 2026년 9월 20일",
            ja: "施行 2026年9月20日",
            en: "Effective September 20, 2026",
        } as const;
        for (const locale of ["ko", "ja", "en"] as const) {
            expect(getPrivacyCopy(locale).dates).toContain(effective[locale]);
            expect(getPrivacyVersionCopy(previous, locale)).not.toEqual(
                getPrivacyCopy(locale)
            );
        }
    });

    it("적용 기간을 방침 머리와 같은 날짜 표기로 적는다", () => {
        const [previous] = PRIVACY_PREVIOUS_VERSIONS;
        expect(getPrivacyVersion("2026-07-27")).toBe(previous);
        expect(privacyVersionPeriod(previous, "ko")).toBe(
            "2026년 7월 27일 – 2026년 9월 19일"
        );
        expect(privacyVersionPeriod(previous, "ja")).toBe(
            "2026年7月27日〜2026年9月19日"
        );
        expect(privacyVersionPeriod(previous, "en")).toBe(
            "July 27, 2026 – September 19, 2026"
        );
    });

    it("없는 버전 주소는 찾지 않는다", () => {
        expect(getPrivacyVersion("2026-09-20")).toBeNull();
        expect(getPrivacyVersion("toString")).toBeNull();
    });
});
