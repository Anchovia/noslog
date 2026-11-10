import {
    opinionQuerySchema,
    opinionReplyQuerySchema,
} from "@/features/music/schemas/community-schema";
import {
    getCachedCommunityPattern,
    getCommunityData,
    getCommunityOpinions,
    getOpinionReplies,
} from "@/features/music/server/community-data";
import {
    apiFailureResponse,
    apiSuccessResponse,
    withRouteErrorLog,
} from "@/lib/api/route-response";
import getSession from "@/lib/session";

const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const parsed = opinionQuerySchema.safeParse(Object.fromEntries(params));
    if (!parsed.success)
        return apiFailureResponse(
            {
                code: "COMMUNITY_INVALID_REQUEST",
                message: "Invalid chart community request.",
                status: 400,
            },
            headers
        );
    return withRouteErrorLog(
        {
            event: "music-community.fetch.failed",
            method: "GET",
            path: "/api/music-community",
            routePath: "/api/music-community",
        },
        async () => {
            const session = await getSession();
            // 답글(2026-09-22) — 의견 하나의 답글 목록
            if (params.get("area") === "replies") {
                const replies = opinionReplyQuerySchema.safeParse(
                    Object.fromEntries(params)
                );
                if (!replies.success)
                    return apiFailureResponse(
                        {
                            code: "COMMUNITY_INVALID_REQUEST",
                            message: "Invalid chart community request.",
                            status: 400,
                        },
                        headers
                    );
                return apiSuccessResponse(
                    await getOpinionReplies(replies.data, session.id),
                    headers
                );
            }
            const data =
                params.get("area") === "pattern"
                    ? {
                          pattern: await getCachedCommunityPattern(
                              parsed.data.chartId
                          ),
                      }
                    : params.get("area") === "opinions"
                      ? await getCommunityOpinions(parsed.data, session.id)
                      : await getCommunityData(parsed.data.chartId, session.id);
            return apiSuccessResponse(data, headers);
        },
        () =>
            apiFailureResponse(
                {
                    code: "COMMUNITY_FETCH_FAILED",
                    message: "Unable to load chart community.",
                    status: 500,
                },
                headers
            )
    );
}
