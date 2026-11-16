import { parseTierBrowserQuery } from "@/features/tiers/schemas/tier-browser-schema";
import {
    getPublicTierBrowserList,
    getTierBrowserOverview,
    getTierBrowserRecords,
} from "@/features/tiers/server/tier-browser-data";
import {
    apiFailureResponse,
    apiSuccessResponse,
    withRouteErrorLog,
} from "@/lib/api/route-response";
import { resolveLocale } from "@/lib/i18n/routing";
import { getUser } from "@/lib/user";

const headers = { "Cache-Control": "private, no-store" };
// 목록 공개 응답은 세션을 읽지 않아 같은 주소면 누구에게나 같다 — CDN 5분. 서열표 저장이 최대 5분 늦게 보일 수 있다
const publicHeaders = { "Cache-Control": "public, max-age=0, s-maxage=300" };
export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const query = parseTierBrowserQuery(params);
    const part = params.get("part");
    return withRouteErrorLog(
        {
            event: "tiers.browser.load.failed",
            routePath: "/api/tier-browser",
        },
        async () => {
            // 서열표 전체 공개 본문 — 쿠키를 읽지 않는다. 번역 제목 표시 여부는 주소(localized)로 받는다
            if (part === "list") {
                const bands = await getPublicTierBrowserList(
                    query,
                    resolveLocale(params.get("locale")),
                    params.get("localized") !== "0"
                );
                return apiSuccessResponse({ bands }, publicHeaders);
            }
            const user = await getUser();
            // 서열표 전체의 내 기록 — 로그인하지 않았으면 빈 기록
            if (part === "records") {
                const records = user
                    ? await getTierBrowserRecords(query, user.id)
                    : {};
                return apiSuccessResponse({ records }, headers);
            }
            const data = await getTierBrowserOverview(query, user?.id ?? null);
            return apiSuccessResponse(data, headers);
        },
        () =>
            apiFailureResponse(
                {
                    code: "TIER_BROWSER_LOAD_FAILED",
                    message: "Could not load the tier data.",
                    status: 500,
                },
                headers
            )
    );
}
