import { NextResponse } from "next/server";
import { z } from "zod";

import { parseTierBrowserQuery } from "@/features/tiers/schemas/tierBrowserSchema";
import {
    getTierBrowserBand,
    getTierBrowserOverview,
} from "@/features/tiers/server/tierBrowserData";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { isLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";

const headers = { "Cache-Control": "private, no-store" };
export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const query = parseTierBrowserQuery(params);
    const requestedBand = params.get("bandId");
    const band =
        requestedBand === null
            ? null
            : z.coerce
                  .number()
                  .int()
                  .positive()
                  .safe()
                  .safeParse(requestedBand);
    if (band && !band.success)
        return NextResponse.json(
            createApiFailure({
                code: "INVALID_TIER_BAND",
                message: "Invalid tier band.",
            }),
            { status: 400, headers }
        );
    try {
        const user = await getUser();
        const requestedLocale = params.get("locale");
        const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
        const data = band?.success
            ? await getTierBrowserBand(
                  query,
                  band.data,
                  user?.id ?? null,
                  locale
              )
            : await getTierBrowserOverview(query, user?.id ?? null);
        if (!data)
            return NextResponse.json(
                createApiFailure({
                    code: "TIER_BAND_NOT_FOUND",
                    message: "Tier band not found.",
                }),
                { status: 404, headers }
            );
        return NextResponse.json(createApiSuccess(data), { headers });
    } catch (error) {
        logServerError(error, {
            event: "tiers.browser.load.failed",
            routePath: "/api/tier-browser",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "TIER_BROWSER_LOAD_FAILED",
                message: "Could not load the tier data.",
            }),
            { status: 500, headers }
        );
    }
}
