import { NextResponse } from "next/server";
import getSession from "@/lib/session";
import { getServerI18n } from "@/lib/i18n/server";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";
import { getSyncStatus } from "@/features/sync/server/syncStatusService";

export async function GET() {
    const { t } = await getServerI18n();
    const headers = { "Cache-Control": "private, no-store" };
    const session = await getSession();
    if (!session.id)
        return NextResponse.json(
            createApiFailure({
                code: "UNAUTHORIZED",
                message: t("sync.loginRequired"),
            }),
            { status: 401, headers }
        );
    try {
        return NextResponse.json(
            createApiSuccess(await getSyncStatus(session.id)),
            { headers }
        );
    } catch (error) {
        logServerError(error, {
            event: "sync.status.failed",
            routePath: "/api/sync/status",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "SYNC_STATUS_FAILED",
                message: t("common.retryLater"),
            }),
            { status: 500, headers }
        );
    }
}
