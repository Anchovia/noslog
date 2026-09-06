import getSession from "@/lib/session";
import { NextResponse } from "next/server";
import {
    loadMusicDetail,
    normalizeMusicDetailTab,
    normalizeMusicDifficulty,
} from "@/features/music/server/loadMusicDetail";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/musicTitle";
import { isLocale } from "@/lib/i18n/routing";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";

const PRIVATE_NO_STORE_HEADERS = {
    "Cache-Control": "private, no-store",
};

export async function GET(request: Request) {
    try {
        const params = new URL(request.url).searchParams;
        const index = params.get("index") ?? "";
        const difficulty = normalizeMusicDifficulty(
            params.get("difficulty") ?? ""
        );
        const tab = normalizeMusicDetailTab(params.get("tab") ?? undefined);
        const requestedPage = Number(params.get("page") ?? "1");
        const page =
            Number.isSafeInteger(requestedPage) && requestedPage > 0
                ? requestedPage
                : 1;

        if (!index || !difficulty) {
            return NextResponse.json(
                createApiFailure({
                    code: "MUSIC_DETAIL_INVALID_REQUEST",
                    message: "Invalid music detail request.",
                }),
                { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
            );
        }

        const [session, requestLocale] = await Promise.all([
            getSession(),
            getRequestLocale(),
        ]);
        const localeParam = params.get("locale");
        const locale = isLocale(localeParam) ? localeParam : requestLocale;
        const showLocalizedTitle = await getMusicTitleDisplayPreference(
            session.id
        );
        const data = await loadMusicDetail(
            index,
            difficulty,
            tab,
            page,
            session.id,
            locale,
            showLocalizedTitle
        );
        if (!data) {
            return NextResponse.json(
                createApiFailure({
                    code: "MUSIC_DETAIL_NOT_FOUND",
                    message: "Music detail was not found.",
                }),
                { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
            );
        }

        return NextResponse.json(createApiSuccess(data), {
            headers: PRIVATE_NO_STORE_HEADERS,
        });
    } catch (error) {
        const path = new URL(request.url).pathname;
        logServerError(error, {
            event: "music-detail.fetch.failed",
            method: "GET",
            path,
            routePath: "/api/music-detail",
            routeType: "route",
        });

        return NextResponse.json(
            createApiFailure({
                code: "MUSIC_DETAIL_FETCH_FAILED",
                message: "Unable to load music detail.",
            }),
            { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
        );
    }
}
