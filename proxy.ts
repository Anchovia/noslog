// 라이브러리 선언
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// 함수 선언
import {
    getPathLocale,
    isLocale,
    isNonLocalizedPath,
    LOCALE_COOKIE_NAME,
    LOCALE_REQUEST_HEADER,
    localeFromAcceptLanguage,
    localizePath,
    stripLocaleFromPath,
} from "./lib/i18n/routing";
import db from "./lib/db";
import getSession from "./lib/session";
import { recordApiCall } from "./lib/analytics";
import { getMaintenanceConfig } from "./features/recovery/server/maintenance-config";
import { createTranslator, getMessages } from "./lib/i18n/messages";
import {
    getAuthReturnPath,
    getSafeAuthReturnPath,
} from "./lib/auth-return-path";

interface Routes {
    [key: string]: boolean;
}

const CSP_REPORT_PATH = "/api/csp-report";

// 요청마다 새 nonce 를 요청 헤더의 CSP 에 넣으면 Next 가 읽어 프레임워크 · 페이지 스크립트에 붙인다.
// 스크립트만 강제하고(저장형 XSS 를 막는 층) 나머지 지시는 next.config 의 Report-Only 로 지켜본다
function applyScriptPolicy(requestHeaders: Headers) {
    const nonce = btoa(crypto.randomUUID());
    const devEval =
        process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
    const policy = [
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devEval}`,
        "object-src 'none'",
        "base-uri 'self'",
        `report-uri ${CSP_REPORT_PATH}`,
    ].join("; ");
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", policy);
    return policy;
}

// public, private route 설정
const routes: {
    publicOnly: Routes;
    privateOnly: Routes;
} = {
    publicOnly: {},
    privateOnly: {
        "/onboarding": true,
        "/profile/settings": true,
    },
} as const;

// event 는 Next 가 늘 넘기지만, 기존 테스트처럼 요청만 넘겨 부르는 경우도 있어 선택으로 둔다
export async function proxy(request: NextRequest, event?: NextFetchEvent) {
    const requestedPathname = request.nextUrl.pathname;
    const pathLocale = getPathLocale(requestedPathname);
    const pathname = stripLocaleFromPath(requestedPathname);

    // 예약 작업(cron)과 통계 수집 자체는 세지 않고, 목록에 없는 경로는 recordApiCall 이 버린다.
    // 관리자 제외를 위해 세션을 확인한 뒤 응답 뒤에서 기록한다.
    const shouldRecordApiCall = Boolean(
        event &&
        requestedPathname.startsWith("/api/") &&
        !requestedPathname.startsWith("/api/cron/") &&
        !requestedPathname.startsWith("/api/analytics") &&
        request.method !== "OPTIONS" &&
        request.method !== "HEAD"
    );

    // Vercel Cron은 자체 Bearer 토큰으로 인증하고 사용자 세션을 사용하지 않음
    if (pathname.startsWith("/api/cron/")) {
        return;
    }

    if (process.env.MAINTENANCE_MODE?.toLowerCase() === "true") {
        const maintenanceCookie =
            request.cookies.get(LOCALE_COOKIE_NAME)?.value;
        const maintenanceLocale =
            pathLocale ??
            (isLocale(maintenanceCookie)
                ? maintenanceCookie
                : localeFromAcceptLanguage(
                      request.headers.get("accept-language")
                  ));
        const isMaintenanceBypass =
            pathname === "/login" ||
            pathname.startsWith("/admin") ||
            pathname.startsWith("/discord/") ||
            pathname === "/manifest.webmanifest" ||
            pathname === "/robots.txt" ||
            pathname === "/sitemap.xml" ||
            pathname === "/icon" ||
            pathname === "/apple-icon" ||
            pathname === "/opengraph-image" ||
            pathname === "/twitter-image";

        if (isMaintenanceBypass) {
            return;
        }

        const { retryAfter } = getMaintenanceConfig();
        const responseHeaders: Record<string, string> = {
            "Cache-Control": "no-store",
        };
        if (retryAfter) responseHeaders["Retry-After"] = retryAfter;

        if (pathname.startsWith("/api/")) {
            return NextResponse.json(
                {
                    isSuccess: false,
                    code: "MAINTENANCE",
                    message: createTranslator(getMessages(maintenanceLocale))(
                        "maintenance.description"
                    ),
                    result: null,
                },
                {
                    status: 503,
                    headers: responseHeaders,
                }
            );
        }

        const maintenanceUrl = request.nextUrl.clone();
        maintenanceUrl.pathname = "/maintenance";
        maintenanceUrl.search = "";
        const maintenanceHeaders = new Headers(request.headers);
        maintenanceHeaders.set(LOCALE_REQUEST_HEADER, maintenanceLocale);
        return NextResponse.rewrite(maintenanceUrl, {
            status: 503,
            request: { headers: maintenanceHeaders },
            headers: responseHeaders,
        });
    }

    const session = await getSession();
    // 언어 · 통계용 역할이 세션에 없을 때만 DB 를 읽어 세션에 채운다 — 로그인 API 호출마다 읽지 않게(2026-10-15 S8)
    const needsLocale = Boolean(session.id) && !isLocale(session.locale);
    const needsRole =
        shouldRecordApiCall && Boolean(session.id) && !session.role;
    const sessionUser =
        session.id && (needsLocale || needsRole)
            ? await db.user.findUnique({
                  where: { id: session.id },
                  select: { locale: true, role: true },
              })
            : null;
    let sessionChanged = false;
    if (needsLocale && isLocale(sessionUser?.locale)) {
        session.locale = sessionUser.locale;
        sessionChanged = true;
    }
    if (needsRole && sessionUser) {
        session.role = sessionUser.role;
        sessionChanged = true;
    }
    if (sessionChanged) await session.save();
    if (shouldRecordApiCall && session.role !== "admin") {
        event!.waitUntil(recordApiCall(requestedPathname).catch(() => null));
    }
    const localeCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const locale =
        pathLocale ??
        (isLocale(session.locale) ? session.locale : null) ??
        (isLocale(localeCookie) ? localeCookie : null) ??
        localeFromAcceptLanguage(request.headers.get("accept-language"));

    // 로그인 상태에서 public route 접근시
    if (session.id) {
        if (
            session.profileCompleted === false &&
            !pathname.startsWith("/onboarding") &&
            !pathname.startsWith("/discord/")
        ) {
            const destination = getSafeAuthReturnPath(
                `${request.nextUrl.pathname}${request.nextUrl.search}`
            );
            if (destination && pathname !== "/") {
                session.onboardingReturnTo = destination;
                await session.save();
            }
            return NextResponse.redirect(
                new URL(localizePath("/onboarding", locale), request.url)
            );
        }
        if (pathname === "/onboarding" && session.profileCompleted === true) {
            return NextResponse.redirect(
                new URL(
                    getAuthReturnPath(session.onboardingReturnTo, locale),
                    request.url
                )
            );
        }
        if (routes.publicOnly[pathname]) {
            return NextResponse.redirect(
                new URL(localizePath("/", locale), request.url)
            );
        }
    }
    // 비로그인 상태에서 private route 접근시
    else {
        if (routes.privateOnly[pathname]) {
            return NextResponse.redirect(
                new URL(localizePath("/login", locale), request.url)
            );
        }
    }

    if (isNonLocalizedPath(requestedPathname)) {
        // 관리자 화면도 사용자가 쓴 글을 그리므로 같은 스크립트 정책을 건다
        if (pathname !== "/admin" && !pathname.startsWith("/admin/")) return;
        const adminHeaders = new Headers(request.headers);
        const adminPolicy = applyScriptPolicy(adminHeaders);
        const adminResponse = NextResponse.next({
            request: { headers: adminHeaders },
        });
        adminResponse.headers.set("Content-Security-Policy", adminPolicy);
        return adminResponse;
    }

    if (!pathLocale) {
        const localizedUrl = request.nextUrl.clone();
        localizedUrl.pathname = localizePath(pathname, locale);
        return NextResponse.redirect(localizedUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_REQUEST_HEADER, locale);
    const policy = applyScriptPolicy(requestHeaders);

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname;
    const response = NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", policy);
    return response;
}

// 빼는 것은 public/ 의 실제 폴더 · 파일과 정적 아이콘 라우트뿐이다. 확장자로 빼면 /tiers/x.png 같은 페이지 주소가
// 점검 · 온보딩 확인 없이 열린다
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|fonts/|bg/|brand/|flag/|flags/|grade/|icon/|icons/|images/|.well-known/security.txt$|favicon.ico$|icon-192.png$|logo.png$|main_signup.png$).*)",
    ],
};
