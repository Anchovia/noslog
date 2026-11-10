import { NextResponse } from "next/server";

import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import {
    logServerError,
    type ServerErrorContext,
} from "@/lib/observability/server";

type ResponseHeaders = Record<string, string>;

export function apiSuccessResponse<T>(result: T, headers?: ResponseHeaders) {
    return NextResponse.json(createApiSuccess(result), { headers });
}

export function apiFailureResponse(
    {
        code,
        message,
        status,
    }: {
        code: string;
        message: string;
        status: number;
    },
    headers?: ResponseHeaders
) {
    return NextResponse.json(createApiFailure({ code, message }), {
        status,
        headers,
    });
}

export async function withRouteErrorLog(
    log: Omit<ServerErrorContext, "routeType">,
    run: () => Promise<Response>,
    onError: () => Response
) {
    try {
        return await run();
    } catch (error) {
        logServerError(error, { ...log, routeType: "route" });
        return onError();
    }
}
