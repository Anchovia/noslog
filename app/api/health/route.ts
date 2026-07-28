import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
    const startedAt = performance.now();

    try {
        await db.$queryRaw`SELECT 1`;

        return Response.json(
            {
                status: "ok",
                database: "reachable",
                responseTimeMs: Math.round(performance.now() - startedAt),
                timestamp: new Date().toISOString(),
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                    "X-Content-Type-Options": "nosniff",
                },
            }
        );
    } catch (error) {
        logServerError(error, {
            event: "health.database.unreachable",
            method: "GET",
            path: "/api/health",
            routePath: "/api/health",
            routeType: "route",
        });

        return Response.json(
            {
                status: "unavailable",
                database: "unreachable",
                timestamp: new Date().toISOString(),
            },
            {
                status: 503,
                headers: {
                    "Cache-Control": "no-store",
                    "Retry-After": "30",
                    "X-Content-Type-Options": "nosniff",
                },
            }
        );
    }
}
