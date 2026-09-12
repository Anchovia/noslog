import { NextRequest } from "next/server";

import { createBookmarkletScript } from "@/lib/bookmarklet";
import { serverEnv } from "@/lib/env/server";
import { isLocale } from "@/lib/i18n/routing";

// 북마클릿 로더가 NOSTALGIA 페이지에 붙이는 동기화 본체. 토큰은 담지 않는다(로더의 data-token)
export function GET(request: NextRequest) {
    const locale = request.nextUrl.searchParams.get("locale");
    const script = createBookmarkletScript(
        request.nextUrl.origin,
        isLocale(locale) ? locale : "ko",
        serverEnv.VERCEL_ENV === "preview"
            ? serverEnv.VERCEL_AUTOMATION_BYPASS_SECRET
            : undefined
    );

    return new Response(script, {
        headers: {
            "Content-Type": "text/javascript; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });
}
