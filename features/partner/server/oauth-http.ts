import "server-only";

import { NextResponse } from "next/server";

/** OAuth 응답은 캐시하지 않는다(RFC 6749 §5.1) — 토큰 · 오류 모두 */
export function oauthJson(
    body: unknown,
    status = 200,
    headers: Record<string, string> = {}
) {
    return NextResponse.json(body, {
        status,
        headers: {
            "Cache-Control": "no-store",
            Pragma: "no-cache",
            ...headers,
        },
    });
}

export function oauthError(
    error: string,
    status = 400,
    headers: Record<string, string> = {}
) {
    return oauthJson({ error }, status, headers);
}

/** 클라이언트 인증 실패 — 401 + Basic 안내(RFC 6749 §5.2) */
export function invalidClient() {
    return oauthError("invalid_client", 401, {
        "WWW-Authenticate": 'Basic realm="noslog"',
    });
}

/** Bearer 실패 — RFC 6750 §3 */
export function bearerError(error: "invalid_token" | "insufficient_scope") {
    return oauthError(error, error === "invalid_token" ? 401 : 403, {
        "WWW-Authenticate": `Bearer realm="noslog", error="${error}"`,
    });
}

/** token · revoke 는 application/x-www-form-urlencoded 본문만 받는다 */
export async function readOAuthForm(request: Request) {
    const type = request.headers.get("content-type") ?? "";
    if (!type.toLowerCase().startsWith("application/x-www-form-urlencoded")) {
        return null;
    }
    return new URLSearchParams(await request.text());
}
