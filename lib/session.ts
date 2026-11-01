import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { cache } from "react";

import db from "@/lib/db";
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
    discordOAuthMode?: "refresh" | "change" | "delete" | "admin";
    discordOAuthUserId?: number;
    deletionVerification?: {
        userId: number;
        discordId: string;
        verifiedAt: number;
    };
    /** 역할 변경 · 동기화 토큰 초기화 앞의 Discord 재확인. 탈퇴 재확인으로 관리자 작업이 열리지 않게 칸을 나눈다 */
    adminVerification?: {
        userId: number;
        discordId: string;
        verifiedAt: number;
    };
    /** User.sessionVersion 과 다르면 로그아웃으로 친다. 이 칸이 생기기 전의 쿠키는 0 으로 본다 */
    sessionVersion?: number;
    /** 마지막 Discord 인증 때 받은 mfa_enabled. true 가 아니면 관리자 권한을 주지 않는다 */
    discordMfaEnabled?: boolean;
    onboardingReturnTo?: string;
    /** 파트너 OAuth 동의 대기(뮤즈캣 연동 B, 2026-10-20) — /oauth/authorize 가 검사한 요청을 동의 화면까지 들고 간다 */
    oauthAuthorize?: {
        clientId: string;
        redirectUri: string;
        scopes: string[];
        state: string | null;
        codeChallenge: string;
        /** 동의 폼에 실어 보내는 값 — 화면에 보인 요청에만 동의하게 한다 */
        requestId: string;
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

/** 권한을 판단하지 않고 언어 · 온보딩 이동만 보는 proxy 용. 모든 요청에서 DB 를 읽지 않게 버전을 비교하지 않는다 */
export async function getUncheckedSession() {
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

const readSessionVersion = cache((userId: number) =>
    db.user.findUnique({
        where: { id: userId },
        select: { sessionVersion: true },
    })
);

export default async function getSession() {
    const session = await getUncheckedSession();
    if (!session.id) return session;

    const user = await readSessionVersion(session.id);
    // 서버 컴포넌트에서는 쿠키를 지울 수 없어 이 요청에서만 로그아웃 상태로 돌려준다. 쿠키는 다음 저장이나 로그인이 덮어쓴다
    if (user && (session.sessionVersion ?? 0) !== user.sessionVersion) {
        delete session.id;
        delete session.profileCompleted;
        delete session.role;
        delete session.discordMfaEnabled;
        delete session.adminVerification;
        delete session.deletionVerification;
        delete session.oauthAuthorize;
        delete session.musecatConnect;
        delete session.musecatMock;
        delete session.onboardingReturnTo;
    }
    return session;
}
