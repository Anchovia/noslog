import { NextResponse } from "next/server";

import { getTierBandForUser } from "@/app/(site)/tiers/data";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/music-title";
import { isLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import {
    isTierDifficulty,
    isTierLevelFilter,
    type TierDifficulty,
} from "@/lib/tiers";
import { getUser } from "@/lib/user";

const headers = { "Cache-Control": "private, no-store" };

interface TierBandRouteProps {
    params: Promise<{ slug: string; bandId: string }>;
}

export async function GET(request: Request, { params }: TierBandRouteProps) {
    const { slug, bandId: requestedBandId } = await params;
    const bandId = Number(requestedBandId);
    if (!Number.isSafeInteger(bandId) || bandId <= 0) {
        return NextResponse.json(
            createApiFailure({
                code: "INVALID_TIER_BAND",
                message: "올바르지 않은 서열 구간입니다.",
            }),
            { status: 400, headers }
        );
    }

    const searchParams = new URL(request.url).searchParams;
    const difficulties = (searchParams.get("difficulty") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(isTierDifficulty) as TierDifficulty[];
    const levels = (searchParams.get("level") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(isTierLevelFilter);
    try {
        const user = await getUser();
        const requestedLocale = searchParams.get("locale");
        const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
        const showLocalizedTitle = await getMusicTitleDisplayPreference(
            user?.id
        );
        const band = await getTierBandForUser(
            slug,
            bandId,
            user?.id,
            difficulties,
            levels,
            locale,
            showLocalizedTitle
        );
        if (!band) {
            return NextResponse.json(
                createApiFailure({
                    code: "TIER_BAND_NOT_FOUND",
                    message: "서열 구간을 찾을 수 없습니다.",
                }),
                { status: 404, headers }
            );
        }

        return NextResponse.json(
            // Retain the top-level band for already-open clients during rollout.
            { ...createApiSuccess({ band }), band },
            { headers }
        );
    } catch (error) {
        logServerError(error, {
            event: "tiers.band.load.failed",
            routePath: "/api/tiers/[slug]/bands/[bandId]",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "TIER_BAND_LOAD_FAILED",
                message: "Could not load the tier band.",
            }),
            { status: 500, headers }
        );
    }
}
