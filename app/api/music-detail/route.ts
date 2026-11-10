import {
    loadMusicDetail,
    normalizeMusicDetailTab,
} from "@/features/music/server/load-music-detail";
import {
    apiFailureResponse,
    apiSuccessResponse,
    withRouteErrorLog,
} from "@/lib/api/route-response";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/music-title";
import { isLocale } from "@/lib/i18n/routing";
import { getRequestLocale } from "@/lib/i18n/server";
import { parseChartDifficulty } from "@/lib/music/difficulty";
import getSession from "@/lib/session";

const PRIVATE_NO_STORE_HEADERS = {
    "Cache-Control": "private, no-store",
};

export async function GET(request: Request) {
    return withRouteErrorLog(
        {
            event: "music-detail.fetch.failed",
            method: "GET",
            path: new URL(request.url).pathname,
            routePath: "/api/music-detail",
        },
        async () => {
            const params = new URL(request.url).searchParams;
            const index = params.get("index") ?? "";
            const difficulty = parseChartDifficulty(
                params.get("difficulty") ?? ""
            );
            const tab = normalizeMusicDetailTab(params.get("tab") ?? undefined);
            const requestedPage = Number(params.get("page") ?? "1");
            const page =
                Number.isSafeInteger(requestedPage) && requestedPage > 0
                    ? requestedPage
                    : 1;

            if (!index || !difficulty) {
                return apiFailureResponse(
                    {
                        code: "MUSIC_DETAIL_INVALID_REQUEST",
                        message: "Invalid music detail request.",
                        status: 400,
                    },
                    PRIVATE_NO_STORE_HEADERS
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
                return apiFailureResponse(
                    {
                        code: "MUSIC_DETAIL_NOT_FOUND",
                        message: "Music detail was not found.",
                        status: 404,
                    },
                    PRIVATE_NO_STORE_HEADERS
                );
            }

            return apiSuccessResponse(data, PRIVATE_NO_STORE_HEADERS);
        },
        () =>
            apiFailureResponse(
                {
                    code: "MUSIC_DETAIL_FETCH_FAILED",
                    message: "Unable to load music detail.",
                    status: 500,
                },
                PRIVATE_NO_STORE_HEADERS
            )
    );
}
