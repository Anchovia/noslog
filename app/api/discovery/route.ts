import { NextResponse } from "next/server";

import { parseDiscoverySearchParams } from "@/features/music/schemas/discovery-schema";
import {
    getDiscoveryCounts,
    getDiscoveryPage,
} from "@/features/music/server/discovery-service";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/music-title";
import { isLocale } from "@/lib/i18n/routing";
import { getRequestLocale } from "@/lib/i18n/server";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    try {
        const query = parseDiscoverySearchParams(Object.fromEntries(params));
        const offset = Number(params.get("offset") ?? 0);
        if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000)
            return NextResponse.json(
                createApiFailure({
                    code: "DISCOVERY_INVALID_REQUEST",
                    message: "Invalid offset.",
                }),
                { status: 400 }
            );
        const [session, requestLocale] = await Promise.all([
            getSession(),
            getRequestLocale(),
        ]);
        const localeParam = params.get("locale");
        const locale = isLocale(localeParam) ? localeParam : requestLocale;
        return NextResponse.json(
            createApiSuccess(
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
                      )
            ),
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        logServerError(error, {
            event: "discovery.fetch.failed",
            method: "GET",
            path: "/api/discovery",
            routePath: "/api/discovery",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "DISCOVERY_UNAVAILABLE",
                message: "Search is unavailable.",
            }),
            { status: 500 }
        );
    }
}
