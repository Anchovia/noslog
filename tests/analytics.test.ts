import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    executeRaw: vi.fn(),
    queryRaw: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: { $executeRaw: mocks.executeRaw, $queryRaw: mocks.queryRaw },
}));

import {
    ANALYTICS_START_DATE,
    analyticsDateKey,
    isAnalyticsEnabled,
    recordApiCall,
    recordExternalCall,
    recordPageView,
} from "@/lib/analytics";
import {
    apiRouteFromPath,
    isBotUserAgent,
    isExternalEvent,
    pageRouteFromPath,
} from "@/lib/analyticsRoutes";
import {
    getPrivacyCopy,
    PRIVACY_PREVIOUS_VERSIONS,
} from "@/features/privacy/content/privacyContent";

const CHROME =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

// 태그 템플릿 호출 → 어느 표에 무엇을 넣었는지
function inserts() {
    return mocks.executeRaw.mock.calls.map((call) => ({
        sql: (call[0] as string[]).join("?"),
        values: call.slice(1),
    }));
}

describe("통계 경로 묶음", () => {
    it("언어 경로를 떼고 페이지 라우트 패턴으로 모은다", () => {
        expect(pageRouteFromPath("/ko")).toBe("/");
        expect(pageRouteFromPath("/ja/music")).toBe("/music");
        expect(pageRouteFromPath("/ko/music/")).toBe("/music");
        expect(pageRouteFromPath("/ko/music?q=abc")).toBe("/music");
        expect(pageRouteFromPath("/en/music/123/hard")).toBe(
            "/music/[index]/[difficulty]"
        );
        expect(pageRouteFromPath("/ko/music/123/hard/pattern")).toBe(
            "/music/[index]/[difficulty]/pattern"
        );
        // 고정 칸이 이긴다
        expect(pageRouteFromPath("/ko/profile/settings")).toBe(
            "/profile/settings"
        );
        expect(pageRouteFromPath("/ko/profile/42")).toBe("/profile/[id]");
    });

    it("언어 경로가 없거나 목록에 없는 주소는 세지 않는다", () => {
        expect(pageRouteFromPath("/music")).toBeNull();
        expect(pageRouteFromPath("/ko/admin")).toBeNull();
        expect(pageRouteFromPath("/ko/wp-login.php")).toBeNull();
        expect(pageRouteFromPath("https://evil.example/ko")).toBeNull();
    });

    it("API 는 동적 칸을 패턴으로 묶고 목록에 없는 경로는 버린다", () => {
        expect(apiRouteFromPath("/api/profiles/7/plays")).toBe(
            "/api/profiles/[id]/plays"
        );
        expect(apiRouteFromPath("/api/tiers/basic-s/bands/12")).toBe(
            "/api/tiers/[slug]/bands/[bandId]"
        );
        expect(apiRouteFromPath("/api/receivePlayerData")).toBe(
            "/api/receivePlayerData"
        );
        expect(apiRouteFromPath("/api/cron/privacy-retention")).toBeNull();
        expect(apiRouteFromPath("/api/nope")).toBeNull();
    });

    it("외부 호출 이름은 정해 둔 것만 받는다(기본 속성 이름 제외)", () => {
        expect(isExternalEvent("x-api")).toBe(true);
        expect(isExternalEvent("kakao-map")).toBe(true);
        expect(isExternalEvent("toString")).toBe(false);
        expect(isExternalEvent("constructor")).toBe(false);
        expect(isExternalEvent(1)).toBe(false);
    });

    it("봇·자동화 브라우저는 사람 방문이 아니다", () => {
        expect(isBotUserAgent(null)).toBe(true);
        expect(
            isBotUserAgent(
                "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
            )
        ).toBe(true);
        expect(isBotUserAgent(`${CHROME} HeadlessChrome/140.0`)).toBe(true);
        expect(isBotUserAgent(CHROME)).toBe(false);
    });
});

describe("방문·API 기록", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("ANALYTICS_FORCE", "true");
        mocks.executeRaw.mockResolvedValue(1);
        mocks.queryRaw.mockResolvedValue([{ salt: "day-salt" }]);
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("날짜는 서울 기준이다 — 한국 시각 자정에 바뀐다", () => {
        expect(analyticsDateKey(new Date("2026-09-12T14:59:59Z"))).toBe(
            "2026-09-12"
        );
        expect(analyticsDateKey(new Date("2026-09-12T15:00:00Z"))).toBe(
            "2026-09-13"
        );
    });

    it("운영 배포가 아니면(로컬 개발·미리보기) 아무것도 쓰지 않는다", async () => {
        vi.stubEnv("ANALYTICS_FORCE", "");
        vi.stubEnv("VERCEL_ENV", "preview");

        await expect(
            recordPageView({
                path: "/ko/music",
                ip: "203.0.113.7",
                userAgent: CHROME,
            })
        ).resolves.toBe(false);
        await expect(recordApiCall("/api/rankings")).resolves.toBe(false);
        await expect(recordExternalCall("x-api")).resolves.toBe(false);
        expect(mocks.executeRaw).not.toHaveBeenCalled();
    });

    it("운영 배포여도 개인정보처리방침 시행일(서울 기준) 전에는 쓰지 않는다", async () => {
        vi.stubEnv("ANALYTICS_FORCE", "");
        vi.stubEnv("VERCEL_ENV", "production");

        expect(isAnalyticsEnabled(new Date("2026-09-12T14:59:59Z"))).toBe(
            false
        );
        expect(isAnalyticsEnabled(new Date("2026-09-12T15:00:00Z"))).toBe(true);
        await expect(
            recordApiCall("/api/rankings", new Date("2026-09-12T03:00:00Z"))
        ).resolves.toBe(false);
        expect(mocks.executeRaw).not.toHaveBeenCalled();
    });

    it("수집 시작일은 방침의 시행일이고 직전 버전은 그 전날까지다", () => {
        const [year, month, day] = ANALYTICS_START_DATE.split("-").map(Number);
        expect(getPrivacyCopy("ko").dates).toContain(
            `시행 ${year}년 ${month}월 ${day}일`
        );
        const dayBefore = new Date(Date.UTC(year, month - 1, day - 1))
            .toISOString()
            .slice(0, 10);
        expect(PRIVACY_PREVIOUS_VERSIONS[0].until).toBe(dayBefore);
    });

    it("그날 처음 온 사람은 방문자·페이지뷰·페이지를 함께 센다", async () => {
        const now = new Date("2026-09-13T03:00:00Z");
        await expect(
            recordPageView({
                path: "/ko/music",
                ip: "203.0.113.7",
                userAgent: CHROME,
                now,
            })
        ).resolves.toBe(true);

        const rows = inserts();
        // 그날의 무작위 값 → 방문자 해시 → 합계 셋
        expect(rows[0].sql).toContain('"analytics_salts"');
        expect(rows[1].sql).toContain('"analytics_visitors"');
        const hash = rows[1].values[1] as string;
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        // IP·브라우저 정보 자체는 어디에도 넘기지 않는다
        for (const row of rows)
            for (const value of row.values) {
                expect(String(value)).not.toContain("203.0.113.7");
                expect(String(value)).not.toContain("Chrome");
            }
        const counts = rows
            .filter((row) => row.sql.includes('"analytics_daily_counts"'))
            .map((row) => row.values.slice(1, 3));
        expect(counts).toEqual(
            expect.arrayContaining([
                ["pageviews", ""],
                ["page", "/music"],
                ["visitors", ""],
            ])
        );
    });

    it("같은 날 다시 온 사람은 방문자로 두 번 세지 않는다", async () => {
        // 방문자 해시가 이미 있으면 INSERT … DO NOTHING 이 0 을 돌려준다
        mocks.executeRaw.mockImplementation(async (strings: string[]) =>
            strings.join("?").includes('"analytics_visitors"') ? 0 : 1
        );

        await recordPageView({
            path: "/ko/tiers",
            ip: "203.0.113.7",
            userAgent: CHROME,
            now: new Date("2026-09-13T03:10:00Z"),
        });

        const kinds = inserts()
            .filter((row) => row.sql.includes('"analytics_daily_counts"'))
            .map((row) => row.values[1]);
        expect(kinds).toEqual(expect.arrayContaining(["pageviews", "page"]));
        expect(kinds).not.toContain("visitors");
    });

    it("봇이나 목록에 없는 페이지는 아무것도 쓰지 않는다", async () => {
        await expect(
            recordPageView({
                path: "/ko/music",
                ip: "203.0.113.7",
                userAgent: "Googlebot/2.1",
            })
        ).resolves.toBe(false);
        await expect(
            recordPageView({
                path: "/ko/unknown",
                ip: "203.0.113.7",
                userAgent: CHROME,
            })
        ).resolves.toBe(false);
        expect(mocks.executeRaw).not.toHaveBeenCalled();
    });

    it("API 호출은 라우트 패턴으로 하루 합계에 더한다", async () => {
        await expect(
            recordApiCall(
                "/api/profiles/9/plays",
                new Date("2026-09-13T03:00:00Z")
            )
        ).resolves.toBe(true);
        expect(inserts()[0].values).toEqual([
            "2026-09-13",
            "api",
            "/api/profiles/[id]/plays",
        ]);
    });
});
