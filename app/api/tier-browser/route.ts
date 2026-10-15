import { NextResponse } from "next/server";
import { z } from "zod";

import { parseTierBrowserQuery } from "@/features/tiers/schemas/tier-browser-schema";
import {
    getPublicTierBrowserBand,
    getTierBrowserBandRecords,
    getTierBrowserOverview,
} from "@/features/tiers/server/tier-browser-data";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { isLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";

const headers = { "Cache-Control": "private, no-store" };
// 구간 공개 응답은 세션을 읽지 않아 같은 주소면 누구에게나 같다 — CDN 5분(2026-10-15 S7). 서열표 저장이 최대 5분 늦게 보일 수 있다
const publicHeaders = { "Cache-Control": "public, max-age=0, s-maxage=300" };
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
        // 구간 공개 본문 — 쿠키를 읽지 않는다. 번역 제목 표시 여부는 주소(localized)로 받는다
        if (band?.success && params.get("part") !== "records") {
            const requestedLocale = params.get("locale");
            const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
            const data = await getPublicTierBrowserBand(
                query,
                band.data,
                locale,
                params.get("localized") !== "0"
            );
            return data
                ? NextResponse.json(createApiSuccess(data), {
                      headers: publicHeaders,
                  })
                : NextResponse.json(
                      createApiFailure({
                          code: "TIER_BAND_NOT_FOUND",
                          message: "Tier band not found.",
                      }),
                      { status: 404, headers }
                  );
        }
        const user = await getUser();
        // 구간 안 내 기록 — 로그인하지 않았으면 빈 기록
        if (band?.success) {
            const records = user
                ? await getTierBrowserBandRecords(query, band.data, user.id)
                : {};
            return records
                ? NextResponse.json(createApiSuccess({ records }), { headers })
                : NextResponse.json(
                      createApiFailure({
                          code: "TIER_BAND_NOT_FOUND",
                          message: "Tier band not found.",
                      }),
                      { status: 404, headers }
                  );
        }
        const data = await getTierBrowserOverview(query, user?.id ?? null);
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
