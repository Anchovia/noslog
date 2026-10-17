import { readdirSync } from "node:fs";
import path from "node:path";

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
    PAGE_ROUTES,
    pageRouteFromPath,
} from "@/lib/analytics-routes";
import {
    getPrivacyCopy,
    PRIVACY_PREVIOUS_VERSIONS,
} from "@/features/privacy/content/privacy-content";

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

    it("공개 셸의 페이지는 모두 페이지 목록에 있다 — 새 탭이 페이지뷰에서 빠지지 않게", () => {
        const root = path.join(process.cwd(), "app/(site)");
        const routes = readdirSync(root, { recursive: true })
            .map(String)
            .filter((file) => path.basename(file) === "page.tsx")
            .map((file) => {
                const segments = path
                    .dirname(file)
                    .split(path.sep)
                    .filter(
                        (segment) =>
                            segment !== "." && !/^\(.+\)$/.test(segment)
                    );
                return `/${segments.join("/")}`;
            });
        expect(routes.length).toBeGreaterThan(0);
        const patterns = new Set(PAGE_ROUTES.map((route) => route.pattern));
        expect(routes.filter((route) => !patterns.has(route))).toEqual([]);
        expect(pageRouteFromPath("/ko/profile/42/stats")).toBe(
            "/profile/[id]/stats"
        );
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

    it("수집 시작일은 그것을 알린 방침 버전의 시행일이다", () => {
        // 2026-09-13 시행 버전이 방문 통계를 알렸다. 뒤에 방침을 고쳐도 시작일은 그 버전에 남는다
        const announced = PRIVACY_PREVIOUS_VERSIONS.find(
            (version) => version.effective === ANALYTICS_START_DATE
        );
        expect(announced).toBeDefined();
    });

    it("방침 버전은 날짜가 끊기지 않고 이어진다", () => {
        const dayBefore = (key: string) => {
            const [year, month, day] = key.split("-").map(Number);
            return new Date(Date.UTC(year, month - 1, day - 1))
                .toISOString()
                .slice(0, 10);
        };
        // 새것부터 — 각 버전의 until 은 바로 앞 시행일(맨 앞은 지금 방침 시행일)의 전날
        const current = getPrivacyCopy("ko").dates.match(
            /시행 (\d+)년 (\d+)월 (\d+)일/
        );
        expect(current).not.toBeNull();
        const [, year, month, day] = current!;
        let next = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        for (const version of PRIVACY_PREVIOUS_VERSIONS) {
            expect(version.until).toBe(dayBefore(next));
            next = version.effective;
        }
    });

    // 방문자 기록과 합계를 한 문장으로(2026-10-15 S8)
    function pageViewStatement() {
        return inserts().find((row) =>
            row.sql.includes('"analytics_daily_counts"')
        )!;
    }

    it("그날 처음 온 사람은 방문자·페이지뷰·페이지를 한 문장으로 함께 센다", async () => {
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
        // 그날의 무작위 값(인스턴스 처음 한 번) 뒤에는 문장 하나
        expect(
            rows.filter((row) => row.sql.includes('"analytics_daily_counts"'))
        ).toHaveLength(1);
        const statement = pageViewStatement();
        expect(statement.sql).toContain('"analytics_visitors"');
        const hash = statement.values[1] as string;
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        // IP·브라우저 정보 자체는 어디에도 넘기지 않는다
        for (const row of rows)
            for (const value of row.values) {
                expect(String(value)).not.toContain("203.0.113.7");
                expect(String(value)).not.toContain("Chrome");
            }
        // 합계 넷 + 그날 처음이면 둘 — 시각(서울 12시)과 로그인 여부만, 누가 왔는지는 남기지 않는다 (2026-09-20)
        for (const kind of ["pageviews", "page", "hour", "audience"])
            expect(statement.sql).toContain(`'${kind}'`);
        expect(statement.values).toEqual(
            expect.arrayContaining(["/music", "12", "guest"])
        );
    });

    it("로그인한 방문은 가입자 쪽으로 센다", async () => {
        await recordPageView({
            path: "/ko/music",
            ip: "203.0.113.7",
            userAgent: CHROME,
            signedIn: true,
            now: new Date("2026-09-13T20:30:00Z"),
        });

        // 서울 기준 다음 날 05시
        expect(pageViewStatement().values).toEqual(
            expect.arrayContaining(["member", "05"])
        );
        // 계정 번호 같은 것은 어디에도 넣지 않는다
        for (const row of inserts())
            expect(row.values.some((value) => value === true)).toBe(false);
    });

    it("방문자 합계는 그날 처음 들어간 방문자 해시가 있을 때만 더한다", async () => {
        await recordPageView({
            path: "/ko/tiers",
            ip: "203.0.113.7",
            userAgent: CHROME,
            now: new Date("2026-09-13T03:10:00Z"),
        });

        // INSERT … DO NOTHING … RETURNING 이 새로 들어간 때만 한 줄 → 그때만 방문자 줄이 생긴다
        const sql = pageViewStatement().sql;
        expect(sql).toMatch(/ON CONFLICT DO NOTHING\s+RETURNING 1/);
        expect(sql).toMatch(/SELECT 'visitors', '' FROM visitor/);
        expect(sql).toMatch(
            /SELECT 'audienceVisitor', \? ?(::text)? ?FROM visitor/
        );
        // 행을 늘 같은 순서로 잠근다
        expect(sql).toContain('ORDER BY "kind", "key"');
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
