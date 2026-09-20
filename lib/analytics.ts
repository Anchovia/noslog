import "server-only";

import { createHash, randomBytes } from "node:crypto";

import {
    apiRouteFromPath,
    isBotUserAgent,
    pageRouteFromPath,
    type ExternalEvent,
} from "@/lib/analyticsRoutes";
import db from "@/lib/db";

// 날짜별 합계의 종류 — visitors·pageviews 는 열쇠 없이 하루 합계, page·api·external 은 경로·이름별,
// hour 는 시각(00~23)별 페이지뷰, audience·audienceVisitor 는 로그인 여부(member·guest)별 합계(2026-09-20).
// 누가 왔는지는 남기지 않는다 — 합계만 는다
export type AnalyticsKind =
    | "visitors"
    | "pageviews"
    | "page"
    | "api"
    | "external"
    | "hour"
    | "audience"
    | "audienceVisitor";

export type AnalyticsAudience = "member" | "guest";

// 방문 통계는 개인정보처리방침 2026-09-13 시행 버전이 알린 것이라 그날(서울 기준)부터 센다.
// 바꾸면 policyCopy.json 의 시행일과 PRIVACY_PREVIOUS_VERSIONS 의 until 도 같이 바꾼다(테스트가 맞춰 본다)
export const ANALYTICS_START_DATE = "2026-09-13";

// 운영 배포에서만 센다 — 로컬 개발·미리보기 배포도 같은 DB 를 쓰므로 그 방문이 운영 통계에 섞이지 않게.
// 테스트는 ANALYTICS_FORCE=true 로 켠다(시행일과 무관)
export function isAnalyticsEnabled(now = new Date()) {
    if (process.env.ANALYTICS_FORCE === "true") return true;
    return (
        process.env.VERCEL_ENV === "production" &&
        analyticsDateKey(now) >= ANALYTICS_START_DATE
    );
}

// 통계 날짜는 서울 기준 — 한국 시각 자정에 하루가 바뀐다
export function analyticsDateKey(now = new Date()) {
    return new Date(now.getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
}

// 시각도 서울 기준 「00」~「23」 (2026-09-20)
export function analyticsHourKey(now = new Date()) {
    return new Date(now.getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(11, 13);
}

// 동시에 들어와도 빠지지 않게 한 문장으로 더한다(없으면 1로 만들고 있으면 +1)
export async function incrementAnalytics(
    kind: AnalyticsKind,
    key: string,
    now = new Date()
) {
    const date = analyticsDateKey(now);
    await db.$executeRaw`
        INSERT INTO "analytics_daily_counts" ("date", "kind", "key", "count")
        VALUES (${date}::date, ${kind}, ${key}, 1)
        ON CONFLICT ("date", "kind", "key")
        DO UPDATE SET "count" = "analytics_daily_counts"."count" + 1`;
}

let saltCache: { date: string; salt: string } | null = null;

// 방문자 해시에 섞는 그날의 무작위 값 — 여러 서버가 같은 값을 쓰도록 DB 에 두고, 다음 날 정리 작업이 지운다
async function dailySalt(date: string) {
    if (saltCache?.date === date) return saltCache.salt;
    const candidate = randomBytes(16).toString("hex");
    await db.$executeRaw`
        INSERT INTO "analytics_salts" ("date", "salt")
        VALUES (${date}::date, ${candidate})
        ON CONFLICT ("date") DO NOTHING`;
    const rows = await db.$queryRaw<{ salt: string }[]>`
        SELECT "salt" FROM "analytics_salts" WHERE "date" = ${date}::date`;
    const salt = rows[0]?.salt ?? candidate;
    saltCache = { date, salt };
    return salt;
}

/**
 * 페이지 방문 1회. 사람 방문만(봇 제외), 알려진 페이지만 센다.
 * IP·브라우저 정보는 저장하지 않고 그날 하루만 유효한 해시로 「오늘 처음 온 사람인지」 만 가린다
 */
export async function recordPageView({
    path,
    ip,
    userAgent,
    signedIn = false,
    now = new Date(),
}: {
    path: string;
    ip: string | null;
    userAgent: string | null;
    /** 그때 로그인 상태였는지 — 가입자·손님 합계에만 쓰고 누구인지는 남기지 않는다 (2026-09-20) */
    signedIn?: boolean;
    now?: Date;
}) {
    if (!isAnalyticsEnabled(now) || isBotUserAgent(userAgent)) return false;
    const route = pageRouteFromPath(path);
    if (!route) return false;
    const date = analyticsDateKey(now);
    const salt = await dailySalt(date);
    const hash = createHash("sha256")
        .update(`${salt}|${ip ?? ""}|${userAgent ?? ""}`)
        .digest("hex");
    const firstVisit = await db.$executeRaw`
        INSERT INTO "analytics_visitors" ("date", "hash")
        VALUES (${date}::date, ${hash})
        ON CONFLICT DO NOTHING`;
    const audience: AnalyticsAudience = signedIn ? "member" : "guest";
    await Promise.all([
        incrementAnalytics("pageviews", "", now),
        incrementAnalytics("page", route, now),
        incrementAnalytics("hour", analyticsHourKey(now), now),
        incrementAnalytics("audience", audience, now),
        firstVisit > 0 ? incrementAnalytics("visitors", "", now) : null,
        firstVisit > 0
            ? incrementAnalytics("audienceVisitor", audience, now)
            : null,
    ]);
    return true;
}

// 우리 API 요청 1회 — 알려진 라우트만(동적 칸은 패턴으로 묶는다)
export async function recordApiCall(path: string, now = new Date()) {
    if (!isAnalyticsEnabled(now)) return false;
    const route = apiRouteFromPath(path);
    if (!route) return false;
    await incrementAnalytics("api", route, now);
    return true;
}

export async function recordExternalCall(
    event: ExternalEvent,
    now = new Date()
) {
    if (!isAnalyticsEnabled(now)) return false;
    await incrementAnalytics("external", event, now);
    return true;
}
