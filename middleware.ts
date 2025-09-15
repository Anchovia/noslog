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
        "/profile/settings": true,
    },
} as const;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = await getSession();

    // 로그인 상태에서 public route 접근시
    if (session.id) {
        if (routes.publicOnly[pathname]) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
    // 비로그인 상태에서 private route 접근시
    else {
        if (routes.privateOnly[pathname]) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
