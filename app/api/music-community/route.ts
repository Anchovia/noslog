import { NextResponse } from "next/server";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import { opinionQuerySchema } from "@/features/music/schemas/communitySchema";
import {
    getCommunityData,
    getCommunityOpinions,
    getCommunityPattern,
} from "@/features/music/server/communityData";

const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const parsed = opinionQuerySchema.safeParse(Object.fromEntries(params));
    if (!parsed.success)
        return NextResponse.json(
            createApiFailure({
                code: "COMMUNITY_INVALID_REQUEST",
                message: "Invalid chart community request.",
            }),
            { status: 400, headers }
        );
    try {
        const session = await getSession();
        const data =
            params.get("area") === "pattern"
                ? { pattern: await getCommunityPattern(parsed.data.chartId) }
                : params.get("area") === "opinions"
                  ? await getCommunityOpinions(parsed.data, session.id)
                  : await getCommunityData(parsed.data.chartId, session.id);
        return NextResponse.json(createApiSuccess(data), { headers });
    } catch (error) {
        logServerError(error, {
            event: "music-community.fetch.failed",
            method: "GET",
            path: "/api/music-community",
            routePath: "/api/music-community",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "COMMUNITY_FETCH_FAILED",
                message: "Unable to load chart community.",
            }),
            { status: 500, headers }
        );
    }
}
