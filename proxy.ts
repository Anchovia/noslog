// 라이브러리 선언
import { NextRequest, NextResponse } from "next/server";
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

export async function proxy(request: NextRequest) {
    const requestedPathname = request.nextUrl.pathname;
    const pathLocale = getPathLocale(requestedPathname);
    const pathname = stripLocaleFromPath(requestedPathname);

    // Vercel Cron은 자체 Bearer 토큰으로 인증하고 사용자 세션을 사용하지 않음
    if (pathname.startsWith("/api/cron/")) {
        return;
    }

    if (process.env.MAINTENANCE_MODE?.toLowerCase() === "true") {
        const maintenanceLocale =
            pathLocale ??
            (isLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value)
                ? request.cookies.get(LOCALE_COOKIE_NAME)!.value
                : localeFromAcceptLanguage(
                      request.headers.get("accept-language")
                  ));
        const isMaintenanceBypass =
            pathname === "/maintenance" ||
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

        if (pathname.startsWith("/api/")) {
            return NextResponse.json(
                { message: "현재 서비스 점검 중입니다." },
                {
                    status: 503,
                    headers: {
                        "Cache-Control": "no-store",
                        "Retry-After": "3600",
                    },
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
            headers: {
                "Cache-Control": "no-store",
                "Retry-After": "3600",
            },
        });
    }

    const session = await getSession();
    if (session.id && !isLocale(session.locale)) {
        const userPreference = await db.user.findUnique({
            where: { id: session.id },
            select: { locale: true },
        });
        if (isLocale(userPreference?.locale)) {
            session.locale = userPreference.locale;
            await session.save();
        }
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
            return NextResponse.redirect(
                new URL(localizePath("/onboarding", locale), request.url)
            );
        }
        if (pathname === "/onboarding" && session.profileCompleted === true) {
            return NextResponse.redirect(
                new URL(localizePath("/", locale), request.url)
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
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
    });
    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
