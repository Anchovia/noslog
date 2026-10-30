import { describe, expect, it } from "vitest";

import {
    getPrivacyCopy,
    getPrivacyVersion,
    getPrivacyVersionCopy,
    PRIVACY_PREVIOUS_VERSIONS,
    privacyVersionPeriod,
} from "@/features/privacy/content/privacy-content";

describe("개인정보 처리방침 이전 버전", () => {
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
            ko: "시행 2026년 11월 6일",
            ja: "施行 2026年11月6日",
            en: "Effective November 6, 2026",
        } as const;
        for (const locale of ["ko", "ja", "en"] as const) {
            expect(getPrivacyCopy(locale).dates).toContain(effective[locale]);
            expect(getPrivacyVersionCopy(previous, locale)).not.toEqual(
                getPrivacyCopy(locale)
            );
        }
    });

    it("세 언어 모두 법이 정한 항목을 같은 절 순서로 싣는다(2026-11-06 판)", () => {
        const ids = [
            "operator",
            "data",
            "destruction",
            "third-party",
            "providers",
            "transfer",
            "public",
            "rights",
            "security",
            "storage",
            "external",
            "ai",
            "children",
            "contact",
            "history",
        ];
        for (const locale of ["ko", "ja", "en"] as const) {
            const copy = getPrivacyCopy(locale);
            expect(copy.sections.map((section) => section.id)).toEqual(ids);
            expect(copy.summary).toHaveLength(6);
            const text = (id: string) =>
                JSON.stringify(
                    copy.sections.find((section) => section.id === id)
                );
            // 제3자 제공 — 뮤즈캣 연결과 무료 Gemini 번역은 동의를 받는 제공
            expect(text("third-party")).toContain("Google LLC");
            expect(text("third-party")).toContain("musecat.app");
            // 국외 이전 — 받는 자 연락처와 저장 위치
            expect(text("transfer")).toContain("privacy@vercel.com");
            expect(text("transfer")).toContain("privacy@planetscale.com");
            expect(text("transfer")).toContain("asia-northeast3");
            // 보호책임자 실명과 권익침해 구제 기관
            expect(text("contact")).toContain("전병훈");
            for (const phone of ["1833-6972", "118", "182"])
                expect(text("contact")).toContain(phone);
            // 기기 저장 — 오락실 찾기 기준 위치
            expect(text("storage")).toContain("noslog.musecat.origin");
            // 개정 전후 대조표
            expect(
                copy.sections
                    .find((section) => section.id === "history")
                    ?.blocks.some((block) => block.kind === "table")
            ).toBe(true);
            // 공개 설정 — 기여 · 업적 · 고정 기록 공개 범위는 이전 판 문장을 그대로 둔다
            expect(text("public")).toContain(
                { ko: "제안자 이름", ja: "提案者名", en: "Your name" }[locale]
            );
            expect(text("public")).toContain(
                {
                    ko: "실력 · 수집 · 곡 묶음 · 계절 업적",
                    ja: "実力・コレクション・楽曲セット・季節の実績",
                    en: "skill, collection, song set or season achievements",
                }[locale]
            );
            expect(text("public")).toContain(
                { ko: "6가지", ja: "6つ", en: "six items" }[locale]
            );
        }
    });

    it("세 언어 모두 DB 위탁처를 PlanetScale · 서울로, 서버 리전을 서울로 알린다(2026-10-28)", () => {
        for (const locale of ["ko", "ja", "en"] as const) {
            const providers = JSON.stringify(
                getPrivacyCopy(locale).sections.find(
                    (section) => section.id === "providers"
                )
            );
            expect(providers).toContain("PlanetScale");
            expect(providers).toContain("asia-northeast3");
            expect(providers).toContain("icn1");
            expect(providers).not.toContain("Neon");
            expect(providers).not.toContain("sin1");
        }
    });

    it("적용 기간을 방침 머리와 같은 날짜 표기로 적는다", () => {
        const first = getPrivacyVersion("2026-07-27")!;
        expect(privacyVersionPeriod(first, "ko")).toBe(
            "2026년 7월 27일 – 2026년 9월 12일"
        );
        expect(privacyVersionPeriod(first, "ja")).toBe(
            "2026年7月27日〜2026年9月12日"
        );
        expect(privacyVersionPeriod(first, "en")).toBe(
            "July 27, 2026 – September 12, 2026"
        );
        // 방문 통계를 알린 버전 — 지금 방침 시행 전날까지
        const second = getPrivacyVersion("2026-09-13")!;
        expect(privacyVersionPeriod(second, "ko")).toBe(
            "2026년 9월 13일 – 2026년 9월 19일"
        );
    });

    it("없는 버전 주소는 찾지 않는다", () => {
        expect(getPrivacyVersion("2026-11-06")).toBeNull();
        expect(getPrivacyVersion("toString")).toBeNull();
    });
});
