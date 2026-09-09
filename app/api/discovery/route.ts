import { NextResponse } from "next/server";

import { parseDiscoverySearchParams } from "@/features/music/schemas/discoverySchema";
import { getDiscoveryPage } from "@/features/music/server/discoveryService";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    try {
        const query = parseDiscoverySearchParams(Object.fromEntries(params));
        const offset = Number(params.get("offset") ?? 0);
        if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000)
            return NextResponse.json(
                createApiFailure({
                    code: "DISCOVERY_INVALID_REQUEST",
                    message: "Invalid offset.",
                }),
                { status: 400 }
            );
        const session = await getSession();
        return NextResponse.json(
            createApiSuccess(
                await getDiscoveryPage(query, offset, session.id ?? null)
            ),
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        logServerError(error, {
            event: "discovery.fetch.failed",
            method: "GET",
            path: "/api/discovery",
            routePath: "/api/discovery",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "DISCOVERY_UNAVAILABLE",
                message: "Search is unavailable.",
            }),
            { status: 500 }
        );
    }
}
