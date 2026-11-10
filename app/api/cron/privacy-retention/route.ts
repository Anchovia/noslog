import { NextResponse } from "next/server";

import { runPrivacyRetention } from "@/features/privacy/server/privacy-retention";
import { runCronRoute } from "@/lib/api/cron-route";
import { serverEnv } from "@/lib/env/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
    const headers = { "Cache-Control": "no-store" };
    return runCronRoute(request, {
        secret: serverEnv.CRON_SECRET,
        event: "privacy-retention.run.failed",
        routePath: "/api/cron/privacy-retention",
        unauthorized: () =>
            NextResponse.json(
                { message: "접근할 수 없습니다." },
                { status: 401 }
            ),
        run: async () =>
            NextResponse.json(await runPrivacyRetention(), { headers }),
        failed: () =>
            NextResponse.json(
                { message: "보존 기간이 지난 개인정보 정리에 실패했습니다." },
                { status: 500, headers }
            ),
    });
}
