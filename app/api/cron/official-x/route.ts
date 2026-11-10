import { syncOfficialXFeed } from "@/features/home/server/official-x-sync";
import { runCronRoute } from "@/lib/api/cron-route";
import {
    apiFailureResponse,
    apiSuccessResponse,
} from "@/lib/api/route-response";
import { serverEnv } from "@/lib/env/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: Request) {
    const headers = { "Cache-Control": "no-store" };
    return runCronRoute(request, {
        secret: serverEnv.OFFICIAL_X_SYNC_SECRET,
        event: "official-x.sync.failed",
        routePath: "/api/cron/official-x",
        unauthorized: () =>
            apiFailureResponse(
                {
                    code: "UNAUTHORIZED",
                    message: "접근할 수 없습니다.",
                    status: 401,
                },
                headers
            ),
        run: async () => {
            const result = await syncOfficialXFeed();
            if (result.status === "translation-pending") {
                return apiFailureResponse(
                    {
                        code: "TRANSLATION_PENDING",
                        message:
                            "원문은 보관했지만 번역에 실패했습니다. 다음 주기에 다시 시도합니다.",
                        status: 503,
                    },
                    headers
                );
            }
            return apiSuccessResponse(result, headers);
        },
        failed: () =>
            apiFailureResponse(
                {
                    code: "SYNC_FAILED",
                    message: "공식 소식 갱신에 실패했습니다.",
                    status: 503,
                },
                headers
            ),
    });
}
