import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * 파트너 OAuth(뮤즈캣 연동 B 방향, 2026-10-20 결정)의 비밀값.
 * 값은 256비트 무작위 + 종류 접두(유출 검사에 걸리게 — GitHub · Gitea · Lichess 방식)이고, DB 에는 SHA-256 해시만 둔다.
 */
export const OAUTH_TOKEN_PREFIXES = {
    code: "nlc_",
    access: "nla_",
    refresh: "nlr_",
} as const;

export type OAuthTokenKind = keyof typeof OAUTH_TOKEN_PREFIXES;

export function hashOAuthSecret(value: string) {
    return createHash("sha256").update(value, "utf8").digest("hex");
}

export function createOAuthToken(kind: OAuthTokenKind) {
    const token = `${OAUTH_TOKEN_PREFIXES[kind]}${randomBytes(32).toString("base64url")}`;
    return { token, hash: hashOAuthSecret(token) };
}

/** 저장해 둔 해시와 시간 차이 없이 비교한다 — 클라이언트 비밀값 · 토큰 모두 */
export function oauthSecretMatches(value: string, storedHash: string) {
    const actual = Buffer.from(hashOAuthSecret(value), "hex");
    const expected = Buffer.from(storedHash, "hex");
    return (
        expected.length === actual.length && timingSafeEqual(actual, expected)
    );
}

/** 파트너에게 주는 사용자 식별자 — 숫자 · 이메일이 아니고 다시 쓰지 않는 값(OIDC Core · 뮤즈캣 spec) */
export function createOAuthSubject() {
    return `nl_${randomBytes(18).toString("base64url")}`;
}

const PKCE_VERIFIER = /^[A-Za-z0-9\-._~]{43,128}$/;
const PKCE_S256_CHALLENGE = /^[A-Za-z0-9_-]{43}$/;

export function isPkceS256Challenge(value: string) {
    return PKCE_S256_CHALLENGE.test(value);
}

/** RFC 7636 §4.6 — S256 만 받는다(plain 은 authorize 에서 거절) */
export function verifyPkceS256(verifier: string, challenge: string) {
    if (!PKCE_VERIFIER.test(verifier) || !isPkceS256Challenge(challenge)) {
        return false;
    }
    const computed = createHash("sha256")
        .update(verifier, "ascii")
        .digest("base64url");
    return timingSafeEqual(Buffer.from(computed), Buffer.from(challenge));
}
