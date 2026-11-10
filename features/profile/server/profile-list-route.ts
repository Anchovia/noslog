import "server-only";

import type { NextRequest } from "next/server";
import type { z } from "zod";

import { profileIdSchema } from "@/features/profile/schemas/public-profile-schema";
import { scoresHiddenFrom } from "@/features/profile/server/score-visibility";
import {
    apiFailureResponse,
    apiSuccessResponse,
    withRouteErrorLog,
} from "@/lib/api/route-response";
import getSession from "@/lib/session";

export function createProfileListRoute<TQuery>({
    querySchema,
    load,
    event,
    routePath,
    failureCode,
    failureMessage,
}: {
    querySchema: z.ZodType<TQuery>;
    load: (
        userId: number,
        query: TQuery,
        options: { owner: boolean }
    ) => Promise<unknown>;
    event: string;
    routePath: string;
    failureCode: string;
    failureMessage: string;
}) {
    return async function GET(
        request: NextRequest,
        context: { params: Promise<{ id: string }> }
    ) {
        const id = profileIdSchema.safeParse((await context.params).id);
        const query = querySchema.safeParse(
            Object.fromEntries(request.nextUrl.searchParams)
        );
        const headers = { "Cache-Control": "private, no-store" };
        if (!id.success || !query.success)
            return apiFailureResponse(
                {
                    code: "INVALID_PROFILE_QUERY",
                    message: "Invalid profile request.",
                    status: 400,
                },
                headers
            );
        return withRouteErrorLog(
            {
                event,
                method: "GET",
                path: request.nextUrl.pathname,
                routePath,
            },
            async () => {
                const session = await getSession();
                if (await scoresHiddenFrom(id.data, session.id))
                    return apiFailureResponse(
                        {
                            code: "PROFILE_SCORES_PRIVATE",
                            message: "This player keeps their scores private.",
                            status: 403,
                        },
                        headers
                    );
                const result = await load(id.data, query.data, {
                    owner: session.id === id.data,
                });
                return result
                    ? apiSuccessResponse(result, headers)
                    : apiFailureResponse(
                          {
                              code: "PROFILE_NOT_FOUND",
                              message: "Profile not found.",
                              status: 404,
                          },
                          headers
                      );
            },
            () =>
                apiFailureResponse(
                    {
                        code: failureCode,
                        message: failureMessage,
                        status: 500,
                    },
                    headers
                )
        );
    };
}
