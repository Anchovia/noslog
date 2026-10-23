import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { serverEnv } from "@/lib/env/server";
import type { Locale } from "@/lib/i18n/routing";

interface SessionContent {
    id?: number;
    profileCompleted?: boolean;
    locale?: Locale;
    /** 통계에서 운영자 방문을 빼는 데만 쓴다(2026-10-15 S8) — 권한 확인은 늘 DB 로. 로그인 때 채우고, 바뀐 역할은 다시 로그인하면 반영 */
    role?: string;
    discordOAuthState?: string;
    discordOAuthReturnTo?: string;
    discordOAuthMode?: "refresh" | "change" | "delete";
    discordOAuthUserId?: number;
    deletionVerification?: {
        userId: number;
        discordId: string;
        verifiedAt: number;
    };
    onboardingReturnTo?: string;
    /** 파트너 OAuth 동의 대기(뮤즈캣 연동 B, 2026-10-20) — /oauth/authorize 가 검사한 요청을 동의 화면까지 들고 간다 */
    oauthAuthorize?: {
        clientId: string;
        redirectUri: string;
        scopes: string[];
        state: string | null;
        codeChallenge: string;
        createdAt: number;
    };
    /** 뮤즈캣 연결(A 방향) 진행 중 — PKCE verifier · state · 돌아갈 곳(live) */
    musecatConnect?: {
        state: string;
        verifier: string;
        returnTo: string;
        createdAt: number;
    };
    /** MUSECAT_MODE=mock 의 흉내 연결 — DB 없이 화면 흐름만 확인한다 */
    musecatMock?: { username: string; connectedAt: number };
}

const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60;

export default async function getSession() {
    return getIronSession<SessionContent>(await cookies(), {
        cookieName: "user_session_cookie",
        password: serverEnv.COOKIE_PASSWORD,
        ttl: SESSION_TTL_SECONDS,
        cookieOptions: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            priority: "high",
        },
    });
}
