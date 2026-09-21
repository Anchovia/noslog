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
import { getMaintenanceConfig } from "./features/recovery/server/maintenanceConfig";
import { createTranslator, getMessages } from "./lib/i18n/messages";
import { getAuthReturnPath, getSafeAuthReturnPath } from "./lib/authReturnPath";

interface Routes {
    [key: string]: boolean;
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
    const sessionUser =
        session.id && (!isLocale(session.locale) || shouldRecordApiCall)
            ? await db.user.findUnique({
                  where: { id: session.id },
                  select: { locale: true, role: true },
              })
            : null;
    if (session.id && !isLocale(session.locale)) {
        if (isLocale(sessionUser?.locale)) {
            session.locale = sessionUser.locale;
            await session.save();
        }
    }
    if (shouldRecordApiCall && sessionUser?.role !== "admin") {
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
        return;
    }

    if (!pathLocale) {
        const localizedUrl = request.nextUrl.clone();
        localizedUrl.pathname = localizePath(pathname, locale);
        return NextResponse.redirect(localizedUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_REQUEST_HEADER, locale);

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname;
    const response = NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
    });
    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|fonts/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
