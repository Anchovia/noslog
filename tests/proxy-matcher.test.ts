import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({ default: vi.fn() }));

import { config } from "@/proxy";

const matcher = new RegExp(`^${config.matcher[0]}$`);

// 확장자로 빼면 페이지 주소 끝에 .png 를 붙여 점검 · 온보딩 확인을 건너뛸 수 있었다
describe("proxy matcher", () => {
    it("public 폴더 · 파일과 정적 아이콘만 proxy 를 건너뛴다", () => {
        for (const path of [
            "/_next/static/chunks/app.js",
            "/_next/image",
            "/fonts/pretendard-jp/1.3.9/a.woff2",
            "/bg/123.webp",
            "/brand/logo.svg",
            "/flag/kr.svg",
            "/flags/kr.png",
            "/grade/s.png",
            "/icon/pianist.png",
            "/icons/close.svg",
            "/images/loading.gif",
            "/favicon.ico",
            "/icon-192.png",
            "/logo.png",
            "/main_signup.png",
        ])
            expect(matcher.test(path), path).toBe(false);
    });

    it("그림 확장자로 끝나는 페이지 주소도 proxy 를 지난다", () => {
        for (const path of [
            "/tiers/x.png",
            "/ko/tiers/x.png",
            "/music/1/Normal.jpg",
            "/events/1.webp",
            "/admin/bingos.svg",
            "/icon",
            "/",
        ])
            expect(matcher.test(path), path).toBe(true);
    });
});
