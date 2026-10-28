import { NextResponse } from "next/server";

import { dispatchPartnerOutbox } from "@/features/partner/server/partner-outbox";
import { serverEnv } from "@/lib/env/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** 파트너에게 못 보낸 알림(해제 · 캐시 무효화)을 다시 보낸다 — Vercel Cron 이 부른다 */
export async function GET(request: Request) {
    const cronSecret = serverEnv.CRON_SECRET;
    if (
        !cronSecret ||
        request.headers.get("authorization") !== `Bearer ${cronSecret}`
    ) {
        return NextResponse.json(
            { message: "접근할 수 없습니다." },
            { status: 401 }
        );
    }
    const result = await dispatchPartnerOutbox();
    return NextResponse.json(result, {
        headers: { "Cache-Control": "no-store" },
    });
}
