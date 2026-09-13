import { recordExternalCall, recordPageView } from "@/lib/analytics";
import { isBotUserAgent, isExternalEvent } from "@/lib/analyticsRoutes";
import { logServerError } from "@/lib/observability/server";

export const dynamic = "force-dynamic";

const MAX_BODY_LENGTH = 1024;

function noContent() {
    return new Response(null, {
        status: 204,
        headers: { "Cache-Control": "no-store" },
    });
}

// 방문·외부 호출 신호를 받는다. 실패해도 이용자 화면에는 영향이 없도록 늘 204 로 답한다
export async function POST(request: Request) {
    // 다른 사이트에서 보낸 신호는 세지 않는다(브라우저가 붙이는 Sec-Fetch-Site)
    const site = request.headers.get("sec-fetch-site");
    if (site && site !== "same-origin") return noContent();
    const userAgent = request.headers.get("user-agent");
    if (isBotUserAgent(userAgent)) return noContent();

    let body: unknown;
    try {
        body = JSON.parse((await request.text()).slice(0, MAX_BODY_LENGTH));
    } catch {
        return new Response(null, { status: 400 });
    }
    if (!body || typeof body !== "object") return noContent();
    const { type, path, name } = body as {
        type?: unknown;
        path?: unknown;
        name?: unknown;
    };

    try {
        if (type === "view" && typeof path === "string") {
            const forwarded = request.headers.get("x-forwarded-for");
            const ip =
                forwarded?.split(",")[0]?.trim() ||
                request.headers.get("x-real-ip");
            await recordPageView({ path, ip, userAgent });
        } else if (type === "event" && isExternalEvent(name)) {
            await recordExternalCall(name);
        }
    } catch (error) {
        logServerError(error, {
            event: "analytics.record.failed",
            routePath: "/api/analytics",
            routeType: "route",
        });
    }
    return noContent();
}
