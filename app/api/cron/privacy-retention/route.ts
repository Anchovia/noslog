import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env/server";
import { runPrivacyRetention } from "@/lib/privacyRetention";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

    const result = await runPrivacyRetention();
    return NextResponse.json(result, {
        headers: { "Cache-Control": "no-store" },
    });
}
