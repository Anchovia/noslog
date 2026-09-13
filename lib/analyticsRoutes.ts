// 방문·API 통계의 경로 묶음 — 실제 주소(/ko/music/123/hard)를 라우트 한 칸(/music/[index]/[difficulty])으로 모은다.
// 목록에 없는 경로는 세지 않는다(오타·공격성 요청이 표를 채우지 않게). 서버·브라우저 어디서나 쓰는 순수 모듈

export interface AnalyticsRoute {
    pattern: string;
    label: string;
}

export const PAGE_ROUTES: readonly AnalyticsRoute[] = [
    { pattern: "/", label: "홈" },
    { pattern: "/music", label: "악곡" },
    { pattern: "/music/[index]/[difficulty]", label: "악곡 상세" },
    { pattern: "/music/[index]/[difficulty]/pattern", label: "채보 뷰어" },
    { pattern: "/tiers", label: "서열표" },
    { pattern: "/tiers/[slug]", label: "서열표 상세" },
    { pattern: "/rankings", label: "랭킹" },
    { pattern: "/bingo", label: "빙고" },
    { pattern: "/bingo/[id]", label: "빙고 상세" },
    { pattern: "/exams", label: "검정" },
    { pattern: "/exams/[slug]", label: "검정 상세" },
    { pattern: "/gamecenter", label: "오락실" },
    { pattern: "/gamecenter/[slug]", label: "오락실 상세" },
    { pattern: "/announcements", label: "공지" },
    { pattern: "/announcements/[slug]", label: "공지 상세" },
    { pattern: "/profile/[id]", label: "프로필" },
    { pattern: "/profile/settings", label: "프로필 설정" },
    { pattern: "/settings", label: "설정" },
    { pattern: "/bookmarklet", label: "동기화" },
    { pattern: "/privacy", label: "개인정보처리방침" },
    { pattern: "/privacy/history", label: "개인정보처리방침 이전 버전 목록" },
    {
        pattern: "/privacy/history/[version]",
        label: "개인정보처리방침 이전 버전",
    },
];

export const API_ROUTES: readonly AnalyticsRoute[] = [
    { pattern: "/api/discovery", label: "악곡 목록" },
    { pattern: "/api/music-detail", label: "악곡 상세" },
    { pattern: "/api/music-preview", label: "악곡 미리보기" },
    { pattern: "/api/music-community", label: "커뮤니티 평가" },
    { pattern: "/api/rankings", label: "랭킹" },
    { pattern: "/api/tier-browser", label: "서열표 목록" },
    { pattern: "/api/tiers/[slug]/bands/[bandId]", label: "서열표 구간" },
    { pattern: "/api/profiles/[id]/plays", label: "프로필 플레이 기록" },
    { pattern: "/api/profiles/[id]/progress", label: "프로필 성장 추이" },
    { pattern: "/api/bookmarklet", label: "북마클릿 불러오기" },
    { pattern: "/api/receivePlayerData", label: "동기화 수신" },
    { pattern: "/api/receiveJacket", label: "자켓 수집" },
    { pattern: "/api/sync/status", label: "동기화 상태" },
    { pattern: "/api/health", label: "상태 확인" },
    {
        pattern: "/api/admin/private-images/[kind]/[id]",
        label: "관리자 비공개 이미지",
    },
];

// 외부 서비스 호출 — 공식 X 는 서버가 실제로 부를 때, 카카오 지도는 브라우저가 지도를 열 때 센다
export const EXTERNAL_EVENTS = {
    "x-api": { label: "공식 X 소식", detail: "X API" },
    "kakao-map": { label: "카카오 지도 열기", detail: "지도 SDK" },
} as const;
export type ExternalEvent = keyof typeof EXTERNAL_EVENTS;

// in 은 toString 같은 기본 속성까지 참으로 봐서 자기 열쇠만 받는다
export function isExternalEvent(value: unknown): value is ExternalEvent {
    return typeof value === "string" && Object.hasOwn(EXTERNAL_EVENTS, value);
}

const LOCALE_PREFIX = /^\/(?:ko|ja|en)(?=\/|$)/;

function segments(path: string) {
    return path.split("/").filter(Boolean);
}

// 고정 칸이 더 많은 패턴이 이긴다 — /profile/settings 가 /profile/[id] 보다 먼저
function matchRoute(routes: readonly AnalyticsRoute[], path: string) {
    const parts = segments(path);
    let best: { pattern: string; score: number } | null = null;
    for (const route of routes) {
        const expected = segments(route.pattern);
        if (expected.length !== parts.length) continue;
        let score = 0;
        const matches = expected.every((segment, index) => {
            if (segment.startsWith("[")) return parts[index].length > 0;
            if (segment !== parts[index]) return false;
            score += 1;
            return true;
        });
        if (matches && (!best || score > best.score))
            best = { pattern: route.pattern, score };
    }
    return best?.pattern ?? null;
}

function cleanPath(path: string) {
    const [withoutQuery] = path.split(/[?#]/);
    if (!withoutQuery.startsWith("/") || withoutQuery.length > 300) return null;
    const trimmed = withoutQuery.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
}

// 브라우저 주소(/ko/music) → 페이지 라우트 패턴. 언어 경로가 없거나 목록에 없으면 null
export function pageRouteFromPath(path: string) {
    const clean = cleanPath(path);
    if (!clean || !LOCALE_PREFIX.test(clean)) return null;
    const withoutLocale = clean.replace(LOCALE_PREFIX, "") || "/";
    return matchRoute(PAGE_ROUTES, withoutLocale);
}

export function apiRouteFromPath(path: string) {
    const clean = cleanPath(path);
    return clean ? matchRoute(API_ROUTES, clean) : null;
}

export function routeLabel(routes: readonly AnalyticsRoute[], pattern: string) {
    return routes.find((route) => route.pattern === pattern)?.label ?? pattern;
}

// 사람이 아닌 방문 — 검색 로봇·미리보기·자동화 브라우저는 세지 않는다
export function isBotUserAgent(userAgent: string | null | undefined) {
    return (
        !userAgent ||
        /bot|crawl|spider|slurp|headless|preview|facebookexternalhit|lighthouse|curl|wget|python|node-fetch/i.test(
            userAgent
        )
    );
}
