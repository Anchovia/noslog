import { NextResponse } from "next/server";

import { dispatchPartnerOutbox } from "@/features/partner/server/partner-outbox";
import { runCronRoute } from "@/lib/api/cron-route";
import { serverEnv } from "@/lib/env/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** 파트너에게 못 보낸 알림(해제 · 캐시 무효화)을 다시 보낸다 — Vercel Cron 이 부른다 */
export async function GET(request: Request) {
    const headers = { "Cache-Control": "no-store" };
    return runCronRoute(request, {
        secret: serverEnv.CRON_SECRET,
        event: "partner-outbox.dispatch.failed",
        routePath: "/api/cron/partner-outbox",
        unauthorized: () =>
            NextResponse.json(
                { message: "접근할 수 없습니다." },
                { status: 401 }
            ),
        run: async () =>
            NextResponse.json(await dispatchPartnerOutbox(), { headers }),
        failed: () =>
            NextResponse.json(
                { message: "파트너 알림 재전송에 실패했습니다." },
                { status: 500, headers }
            ),
    });
}
