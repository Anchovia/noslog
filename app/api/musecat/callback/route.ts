import { NextRequest, NextResponse } from "next/server";

import { completeMusecatConnect } from "@/features/musecat/server/musecat-connection-service";

export const dynamic = "force-dynamic";

/** 뮤즈캣 동의 뒤 돌아오는 곳(live, MUSECAT_REDIRECT_URI) — code 교환 결과를 돌아갈 화면에 붙인다 */
export async function GET(request: NextRequest) {
    const result = await completeMusecatConnect(request.nextUrl.searchParams);
    const target = new URL(result.returnTo, request.url);
    target.searchParams.set(
        "musecat",
        result.ok ? "connected" : `error_${result.error}`
    );
    return NextResponse.redirect(target, 303);
}
