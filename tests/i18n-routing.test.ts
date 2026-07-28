import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));

import {
    getPathLocale,
    isNonLocalizedPath,
    localeFromAcceptLanguage,
    localeFromCountry,
    localizePath,
    stripLocaleFromPath,
} from "@/lib/i18n/routing";
import { proxy } from "@/proxy";

describe("언어 경로 유틸리티", () => {
    it.each([
        ["ko-KR", "ko"],
        ["ja-JP", "ja"],
        ["global", "en"],
        ["unknown", "ko"],
    ] as const)("%s 국가의 초기 언어를 %s로 정한다", (country, locale) => {
        expect(localeFromCountry(country)).toBe(locale);
    });

    it.each([
        ["ko-KR,ko;q=0.9,en;q=0.8", "ko"],
        ["ja-JP,ja;q=0.9,en;q=0.8", "ja"],
        ["fr-FR,fr;q=0.9,en;q=0.8", "en"],
        ["ko;q=0.4,ja;q=0.9", "ja"],
        [null, "en"],
    ] as const)("브라우저 언어 %s를 %s로 감지한다", (header, locale) => {
        expect(localeFromAcceptLanguage(header)).toBe(locale);
    });

    it("언어 경로를 분리하고 다시 조합한다", () => {
        expect(getPathLocale("/ja/music/123")).toBe("ja");
        expect(stripLocaleFromPath("/ja/music/123")).toBe("/music/123");
        expect(localizePath("/ja/music/123", "en")).toBe("/en/music/123");
        expect(localizePath("/", "ko")).toBe("/ko");
    });

    it("관리자와 시스템 경로에는 언어 접두사를 사용하지 않는다", () => {
        expect(isNonLocalizedPath("/admin/music")).toBe(true);
        expect(isNonLocalizedPath("/api/rankings")).toBe(true);
        expect(isNonLocalizedPath("/manifest.webmanifest")).toBe(true);
        expect(isNonLocalizedPath("/music")).toBe(false);
    });
});

describe("언어 경로 프록시", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({});
    });

    it("비로그인 사용자를 브라우저 언어 경로로 보낸다", async () => {
        const response = await proxy(
            new NextRequest("http://localhost:3000/music?q=rain", {
                headers: { "accept-language": "ja-JP,ja;q=0.9" },
            })
        );

        expect(response?.headers.get("location")).toBe(
            "http://localhost:3000/ja/music?q=rain"
        );
    });

    it("저장된 쿠키를 브라우저 언어보다 우선한다", async () => {
        const response = await proxy(
            new NextRequest("http://localhost:3000/music", {
                headers: {
                    "accept-language": "ja-JP",
                    cookie: "noslog-locale=en",
                },
            })
        );

        expect(response?.headers.get("location")).toBe(
            "http://localhost:3000/en/music"
        );
    });

    it("로그인 세션 언어를 쿠키보다 우선한다", async () => {
        mocks.getSession.mockResolvedValue({ id: 9, locale: "ja" });

        const response = await proxy(
            new NextRequest("http://localhost:3000/music", {
                headers: { cookie: "noslog-locale=en" },
            })
        );

        expect(response?.headers.get("location")).toBe(
            "http://localhost:3000/ja/music"
        );
    });

    it("언어 경로를 기존 내부 페이지로 연결하고 언어 쿠키를 저장한다", async () => {
        const response = await proxy(
            new NextRequest("http://localhost:3000/ko/music")
        );

        expect(response?.headers.get("x-middleware-rewrite")).toBe(
            "http://localhost:3000/music"
        );
        expect(response?.headers.get("set-cookie")).toContain(
            "noslog-locale=ko"
        );
    });

    it("관리자 경로는 언어 접두사 없이 유지한다", async () => {
        await expect(
            proxy(new NextRequest("http://localhost:3000/admin"))
        ).resolves.toBeUndefined();
    });
});
