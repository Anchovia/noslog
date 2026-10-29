import { NextRequest, NextResponse } from "next/server";

import { beginMusecatConnect } from "@/features/musecat/server/musecat-connection-service";
import { getMusecatMode } from "@/features/musecat/server/musecat-mode";
import { getSafeAuthReturnPath } from "@/lib/auth-return-path";
import getSession from "@/lib/session";

export const dynamic = "force-dynamic";

/** 뮤즈캣 연결 시작(A 방향) — 로그인한 사용자만. mock 은 바로 돌아가고, live 는 뮤즈캣 동의 화면으로 */
export async function GET(request: NextRequest) {
    const returnTo =
        getSafeAuthReturnPath(
            request.nextUrl.searchParams.get("returnTo") ?? undefined
        ) ?? "/settings?category=connections";
    // 다른 사이트가 연결을 시작시키지 못하게 한다(Fetch Metadata). 헤더를 안 보내는 옛 브라우저는 그대로 둔다
    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
        return NextResponse.redirect(new URL(returnTo, request.url), 303);
    }
    const session = await getSession();
    if (getMusecatMode() === "off") {
        return NextResponse.redirect(new URL(returnTo, request.url), 303);
    }
    if (!session.id) {
        const login = new URL("/login", request.url);
        login.searchParams.set("returnTo", returnTo);
        return NextResponse.redirect(login, 303);
    }
    const target = await beginMusecatConnect(returnTo);
    return NextResponse.redirect(new URL(target, request.url), 303);
}
