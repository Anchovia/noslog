import { NextRequest, NextResponse } from "next/server";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import { scoresHiddenFrom } from "@/features/profile/server/scoreVisibility";
import {
    profileIdSchema,
    profileListQuerySchema,
} from "@/features/profile/schemas/publicProfileSchema";
import { getPublicProfilePlays } from "@/features/profile/server/profilePlaysService";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const id = profileIdSchema.safeParse((await context.params).id);
    const query = profileListQuerySchema.safeParse(
        Object.fromEntries(request.nextUrl.searchParams)
    );
    const headers = { "Cache-Control": "private, no-store" };
    if (!id.success || !query.success)
        return NextResponse.json(
            createApiFailure({
                code: "INVALID_PROFILE_QUERY",
                message: "Invalid profile request.",
            }),
            { status: 400, headers }
        );
    try {
        const session = await getSession();
        if (await scoresHiddenFrom(id.data, session.id))
            return NextResponse.json(
                createApiFailure({
                    code: "PROFILE_SCORES_PRIVATE",
                    message: "This player keeps their scores private.",
                }),
                { status: 403, headers }
            );
        const result = await getPublicProfilePlays(id.data, query.data, {
            owner: session.id === id.data,
        });
        return result
            ? NextResponse.json(createApiSuccess(result), { headers })
            : NextResponse.json(
                  createApiFailure({
                      code: "PROFILE_NOT_FOUND",
                      message: "Profile not found.",
                  }),
                  { status: 404, headers }
              );
    } catch (error) {
        logServerError(error, {
            event: "profile.plays.fetch.failed",
            method: "GET",
            path: request.nextUrl.pathname,
            routePath: "/api/profiles/[id]/plays",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "PROFILE_PLAYS_FAILED",
                message: "Unable to load profile records.",
            }),
            { status: 500, headers }
        );
    }
}
