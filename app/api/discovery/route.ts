import { parseDiscoverySearchParams } from "@/features/music/schemas/discovery-schema";
import {
    getDiscoveryCounts,
    getDiscoveryPage,
} from "@/features/music/server/discovery-service";
import {
    apiFailureResponse,
    apiSuccessResponse,
    withRouteErrorLog,
} from "@/lib/api/route-response";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/music-title";
import { isLocale } from "@/lib/i18n/routing";
import { getRequestLocale } from "@/lib/i18n/server";
import getSession from "@/lib/session";

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    return withRouteErrorLog(
        {
            event: "discovery.fetch.failed",
            method: "GET",
            path: "/api/discovery",
            routePath: "/api/discovery",
        },
        async () => {
            const query = parseDiscoverySearchParams(
                Object.fromEntries(params)
            );
            const offset = Number(params.get("offset") ?? 0);
            if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000)
                return apiFailureResponse({
                    code: "DISCOVERY_INVALID_REQUEST",
                    message: "Invalid offset.",
                    status: 400,
                });
            const [session, requestLocale] = await Promise.all([
                getSession(),
                getRequestLocale(),
            ]);
            const localeParam = params.get("locale");
            const locale = isLocale(localeParam) ? localeParam : requestLocale;
            return apiSuccessResponse(
                params.get("counts") === "1"
                    ? await getDiscoveryCounts(query, session.id ?? null)
                    : await getDiscoveryPage(
                          query,
                          offset,
                          session.id ?? null,
                          {
                              locale,
                              showLocalizedTitle:
                                  await getMusicTitleDisplayPreference(
                                      session.id
                                  ),
                          }
                      ),
                { "Cache-Control": "private, no-store" }
            );
        },
        () =>
            apiFailureResponse({
                code: "DISCOVERY_UNAVAILABLE",
                message: "Search is unavailable.",
                status: 500,
            })
    );
}
