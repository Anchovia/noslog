// 라이브러리 선언
import { NextRequest, NextResponse } from "next/server";
// 함수 선언
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
    const { pathname } = request.nextUrl;

    // Vercel Cron은 자체 Bearer 토큰으로 인증하고 사용자 세션을 사용하지 않음
    if (pathname.startsWith("/api/cron/")) {
        return;
    }

    if (process.env.MAINTENANCE_MODE?.toLowerCase() === "true") {
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
        return NextResponse.rewrite(maintenanceUrl, {
            status: 503,
            headers: {
                "Cache-Control": "no-store",
                "Retry-After": "3600",
            },
        });
    }

    const session = await getSession();

    // 로그인 상태에서 public route 접근시
    if (session.id) {
        if (
            session.profileCompleted === false &&
            !pathname.startsWith("/onboarding") &&
            !pathname.startsWith("/discord/")
        ) {
            return NextResponse.redirect(new URL("/onboarding", request.url));
        }
        if (pathname === "/onboarding" && session.profileCompleted === true) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        if (routes.publicOnly[pathname]) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
    // 비로그인 상태에서 private route 접근시
    else {
        if (routes.privateOnly[pathname]) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
