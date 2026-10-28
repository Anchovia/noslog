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
