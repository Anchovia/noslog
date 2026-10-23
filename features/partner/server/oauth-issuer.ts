import "server-only";

import { headers } from "next/headers";

import { normalizeOAuthIssuer } from "@/features/partner/server/oauth-metadata";
import { serverEnv } from "@/lib/env/server";

function normalize(origin: string) {
    return normalizeOAuthIssuer(origin, {
        allowLoopbackHttp: process.env.NODE_ENV !== "production",
    });
}

/**
 * issuer = 서비스 origin(APP_URL, 없으면 요청 origin). 운영은 https 만,
 * 개발은 localhost http 도 받는다(뮤즈캣 개발 모드 · mock 확인용).
 */
export function getOAuthIssuer(requestUrl: string) {
    return normalize(serverEnv.APP_URL ?? new URL(requestUrl).origin);
}

/** Server Action 처럼 요청 URL 이 없는 곳 — 같은 규칙으로 호스트 헤더에서 */
export async function getRequestOAuthIssuer() {
    if (serverEnv.APP_URL) return normalize(serverEnv.APP_URL);
    const list = await headers();
    const host = list.get("x-forwarded-host") ?? list.get("host") ?? "";
    const proto =
        list.get("x-forwarded-proto") ??
        (host.startsWith("localhost") || host.startsWith("127.0.0.1")
            ? "http"
            : "https");
    return normalize(`${proto}://${host}`);
}
