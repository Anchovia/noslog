import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { serverEnv } from "@/lib/env/server";
import { logServerError } from "@/lib/observability/server";
import { syncOfficialXFeed } from "@/features/home/server/officialXSync";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: Request) {
    const expected = serverEnv.OFFICIAL_X_SYNC_SECRET;
    const supplied = request.headers.get("authorization") ?? "";
    const expectedHeader = `Bearer ${expected ?? ""}`;
    const headers = { "Cache-Control": "no-store" };
    if (
        !expected ||
        Buffer.byteLength(supplied) !== Buffer.byteLength(expectedHeader) ||
        !timingSafeEqual(Buffer.from(supplied), Buffer.from(expectedHeader))
    ) {
        return NextResponse.json(
            createApiFailure({
                code: "UNAUTHORIZED",
                message: "접근할 수 없습니다.",
            }),
            { status: 401, headers }
        );
    }
    try {
        const result = await syncOfficialXFeed();
        if (result.status === "translation-pending") {
            return NextResponse.json(
                createApiFailure({
                    code: "TRANSLATION_PENDING",
                    message:
                        "원문은 보관했지만 번역에 실패했습니다. 다음 주기에 다시 시도합니다.",
                }),
                { status: 503, headers }
            );
        }
        return NextResponse.json(createApiSuccess(result), { headers });
    } catch (error) {
        logServerError(error, {
            event: "official-x.sync.failed",
            routePath: "/api/cron/official-x",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "SYNC_FAILED",
                message: "공식 소식 갱신에 실패했습니다.",
            }),
            { status: 503, headers }
        );
    }
}
