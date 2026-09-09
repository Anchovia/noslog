import { NextRequest, NextResponse } from "next/server";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";
import {
    profileIdSchema,
    profileProgressQuerySchema,
} from "@/features/profile/schemas/publicProfileSchema";
import { getPublicProfileProgress } from "@/features/profile/server/profileProgressService";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const id = profileIdSchema.safeParse((await context.params).id);
    const query = profileProgressQuerySchema.safeParse(
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
        const result = await getPublicProfileProgress(id.data, query.data);
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
            event: "profile.progress.fetch.failed",
            method: "GET",
            path: request.nextUrl.pathname,
            routePath: "/api/profiles/[id]/progress",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "PROFILE_PROGRESS_FAILED",
                message: "Unable to load profile progress.",
            }),
            { status: 500, headers }
        );
    }
}
