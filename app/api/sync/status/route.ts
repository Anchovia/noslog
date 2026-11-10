import { getSyncStatus } from "@/features/sync/server/sync-status-service";
import {
    apiFailureResponse,
    apiSuccessResponse,
    withRouteErrorLog,
} from "@/lib/api/route-response";
import { getServerI18n } from "@/lib/i18n/server";
import getSession from "@/lib/session";

export async function GET() {
    const { t } = await getServerI18n();
    const headers = { "Cache-Control": "private, no-store" };
    const session = await getSession();
    const userId = session.id;
    if (!userId)
        return apiFailureResponse(
            {
                code: "UNAUTHORIZED",
                message: t("sync.loginRequired"),
                status: 401,
            },
            headers
        );
    return withRouteErrorLog(
        { event: "sync.status.failed", routePath: "/api/sync/status" },
        async () => apiSuccessResponse(await getSyncStatus(userId), headers),
        () =>
            apiFailureResponse(
                {
                    code: "SYNC_STATUS_FAILED",
                    message: t("common.retryLater"),
                    status: 500,
                },
                headers
            )
    );
}
