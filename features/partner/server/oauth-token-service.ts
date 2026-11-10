import "server-only";

import {
    formatOAuthScope,
    type OAuthScope,
    parseOAuthScope,
} from "@/features/partner/server/oauth-authorize";
import {
    type DbScope,
    fromDbScopes,
    revokeGrant,
    toDbScopes,
    type Tx,
} from "@/features/partner/server/oauth-grant-service";
import {
    createOAuthToken,
    hashOAuthSecret,
    verifyPkceS256,
} from "@/features/partner/server/oauth-tokens";
import type { PartnerShareItemName } from "@/features/partner/server/partner-outbox";
import db from "@/lib/db";

/** access 토큰 — 뮤즈캣 spec 300초 이상 권장 */
const OAUTH_ACCESS_TTL_SECONDS = 60 * 60;
/** 바뀐 refresh 토큰을, 새 토큰이 아직 한 번도 안 쓰였을 때만 이 시간 안에 한 번 더 받는다(응답을 놓친 재시도) */
const REFRESH_RETRY_GRACE_MS = 2 * 60 * 1000;

export type OAuthTokenResult =
    | {
          ok: true;
          body: {
              access_token: string;
              token_type: "Bearer";
              expires_in: number;
              refresh_token: string;
              scope: string;
          };
      }
    | { ok: false; error: "invalid_grant" | "invalid_scope" };

const OAUTH_TOKEN_HOURLY_LIMIT = 2_000;
const OAUTH_TOKEN_WINDOW_MS = 60 * 60 * 1000;

async function issueTokens(
    tx: Tx,
    grant: { id: number; familyExpiresAt: Date },
    scopes: DbScope[],
    parentId: number | null,
    now: Date
) {
    const refresh = createOAuthToken("refresh");
    const access = createOAuthToken("access");
    const refreshRow = await tx.oAuthRefreshToken.create({
        data: {
            tokenHash: refresh.hash,
            grantId: grant.id,
            parentId,
            expiresAt: grant.familyExpiresAt,
        },
        select: { id: true },
    });
    await tx.oAuthAccessToken.create({
        data: {
            tokenHash: access.hash,
            grantId: grant.id,
            refreshTokenId: refreshRow.id,
            scopes,
            expiresAt: new Date(
                now.getTime() + OAUTH_ACCESS_TTL_SECONDS * 1000
            ),
        },
    });
    await tx.oAuthGrant.update({
        where: { id: grant.id },
        data: { lastUsedAt: now },
    });
    return {
        access_token: access.token,
        token_type: "Bearer" as const,
        expires_in: OAUTH_ACCESS_TTL_SECONDS,
        refresh_token: refresh.token,
        scope: formatOAuthScope(fromDbScopes(scopes)),
    };
}

/** 클라이언트가 지난 1시간에 받은 토큰이 한도에 닿았는지 — 토큰 행을 세므로 따로 기록하지 않는다 */
export async function isOAuthTokenLimitReached(clientId: string) {
    const issued = await db.oAuthAccessToken.count({
        where: {
            grant: { clientId },
            createdAt: { gte: new Date(Date.now() - OAUTH_TOKEN_WINDOW_MS) },
        },
    });
    return issued >= OAUTH_TOKEN_HOURLY_LIMIT;
}

/** grant_type=authorization_code. 이미 쓴 code 가 다시 오면 그 연결을 폐기한다(RFC 9700 §4.2.4) */
export async function exchangeAuthorizationCode(input: {
    clientId: string;
    code: string;
    redirectUri: string | null;
    codeVerifier: string | null;
}): Promise<OAuthTokenResult> {
    const now = new Date();
    return db.$transaction(async (tx) => {
        const row = await tx.oAuthAuthorizationCode.findUnique({
            where: { codeHash: hashOAuthSecret(input.code) },
            select: {
                id: true,
                consumedAt: true,
                expiresAt: true,
                redirectUri: true,
                codeChallenge: true,
                scopes: true,
                grant: {
                    select: {
                        id: true,
                        clientId: true,
                        revokedAt: true,
                        familyExpiresAt: true,
                    },
                },
            },
        });
        if (!row || row.grant.clientId !== input.clientId) {
            return { ok: false, error: "invalid_grant" } as const;
        }
        if (row.consumedAt) {
            await revokeGrant(tx, row.grant.id, "replay", now);
            return { ok: false, error: "invalid_grant" } as const;
        }
        const consumed = await tx.oAuthAuthorizationCode.updateMany({
            where: { id: row.id, consumedAt: null },
            data: { consumedAt: now },
        });
        if (consumed.count !== 1) {
            await revokeGrant(tx, row.grant.id, "replay", now);
            return { ok: false, error: "invalid_grant" } as const;
        }
        if (
            row.expiresAt <= now ||
            row.redirectUri !== input.redirectUri ||
            !input.codeVerifier ||
            !verifyPkceS256(input.codeVerifier, row.codeChallenge) ||
            row.grant.revokedAt ||
            row.grant.familyExpiresAt <= now
        ) {
            return { ok: false, error: "invalid_grant" } as const;
        }
        return {
            ok: true,
            body: await issueTokens(tx, row.grant, row.scopes, null, now),
        } as const;
    });
}

/**
 * grant_type=refresh_token. 쓸 때마다 바꾼다. 바뀐 토큰이 다시 오면 연결을 폐기하되,
 * 새 토큰이 한 번도 안 쓰였고 짧은 시간 안이면 응답을 놓친 재시도로 보고 새 토큰을 다시 낸다(Cloudflare 방식).
 */
export async function refreshAccessToken(input: {
    clientId: string;
    refreshToken: string;
    scope: string | null;
}): Promise<OAuthTokenResult> {
    const now = new Date();
    return db.$transaction(async (tx) => {
        const row = await tx.oAuthRefreshToken.findUnique({
            where: { tokenHash: hashOAuthSecret(input.refreshToken) },
            select: {
                id: true,
                rotatedAt: true,
                revokedAt: true,
                expiresAt: true,
                grant: {
                    select: {
                        id: true,
                        clientId: true,
                        scopes: true,
                        revokedAt: true,
                        familyExpiresAt: true,
                    },
                },
                children: {
                    select: { id: true, rotatedAt: true, revokedAt: true },
                    orderBy: { id: "desc" },
                    take: 1,
                },
            },
        });
        if (!row || row.grant.clientId !== input.clientId) {
            return { ok: false, error: "invalid_grant" } as const;
        }
        // 거둔 refresh 가 다시 오면 새어 나간 토큰으로 보고 살아 있는 연결 전체를 끝낸다(RFC 9700 §4.14.2)
        if (
            row.revokedAt &&
            !row.grant.revokedAt &&
            row.grant.familyExpiresAt > now
        ) {
            await revokeGrant(tx, row.grant.id, "replay", now);
            return { ok: false, error: "invalid_grant" } as const;
        }
        if (
            row.revokedAt ||
            row.grant.revokedAt ||
            row.expiresAt <= now ||
            row.grant.familyExpiresAt <= now
        ) {
            return { ok: false, error: "invalid_grant" } as const;
        }
        const requested = parseOAuthScope(input.scope);
        const grantScopes = fromDbScopes(row.grant.scopes);
        if (
            requested &&
            requested.some(
                (scope) => !grantScopes.includes(scope as OAuthScope)
            )
        ) {
            return { ok: false, error: "invalid_scope" } as const;
        }
        if (row.rotatedAt) {
            const [child] = row.children;
            const isRetry =
                child &&
                !child.rotatedAt &&
                !child.revokedAt &&
                now.getTime() - row.rotatedAt.getTime() <
                    REFRESH_RETRY_GRACE_MS;
            if (!isRetry) {
                await revokeGrant(tx, row.grant.id, "replay", now);
                return { ok: false, error: "invalid_grant" } as const;
            }
            await tx.oAuthRefreshToken.update({
                where: { id: child.id },
                data: { revokedAt: now },
            });
            await tx.oAuthAccessToken.updateMany({
                where: { refreshTokenId: child.id, revokedAt: null },
                data: { revokedAt: now },
            });
        } else {
            const rotated = await tx.oAuthRefreshToken.updateMany({
                where: { id: row.id, rotatedAt: null },
                data: { rotatedAt: now },
            });
            if (rotated.count !== 1) {
                return { ok: false, error: "invalid_grant" } as const;
            }
        }
        const scopes = requested
            ? toDbScopes(requested as OAuthScope[])
            : row.grant.scopes;
        return {
            ok: true,
            body: await issueTokens(tx, row.grant, scopes, row.id, now),
        } as const;
    });
}

/** RFC 7009 — 이 클라이언트의 토큰일 때만 효과가 있고, 결과는 늘 200 이다 */
export async function revokeOAuthToken(clientId: string, token: string) {
    const hash = hashOAuthSecret(token);
    const now = new Date();
    await db.$transaction(async (tx) => {
        const refresh = await tx.oAuthRefreshToken.findUnique({
            where: { tokenHash: hash },
            select: { grant: { select: { id: true, clientId: true } } },
        });
        if (refresh && refresh.grant.clientId === clientId) {
            // refresh 를 거두면 연결 전체를 끝낸다 — 파트너가 해제한 것
            await revokeGrant(tx, refresh.grant.id, "partner", now);
            return;
        }
        const access = await tx.oAuthAccessToken.findUnique({
            where: { tokenHash: hash },
            select: { id: true, grant: { select: { clientId: true } } },
        });
        if (access && access.grant.clientId === clientId) {
            await tx.oAuthAccessToken.update({
                where: { id: access.id },
                data: { revokedAt: now },
            });
        }
    });
}

export type BearerAuthResult =
    | {
          ok: true;
          grantId: number;
          userId: number;
          clientId: string;
          subject: string;
          scopes: OAuthScope[];
          sharedItems: PartnerShareItemName[];
      }
    | { ok: false; error: "invalid_token" | "insufficient_scope" };

/** 기록 API · userinfo 의 Bearer 확인. 헤더로만 받는다(쿼리 토큰 없음) */
export async function authenticateBearer(
    authorization: string | null,
    requiredScope: OAuthScope
): Promise<BearerAuthResult> {
    const match = /^bearer\s+(\S+)$/i.exec(authorization ?? "");
    if (!match) return { ok: false, error: "invalid_token" };
    const now = new Date();
    const token = await db.oAuthAccessToken.findUnique({
        where: { tokenHash: hashOAuthSecret(match[1]) },
        select: {
            scopes: true,
            revokedAt: true,
            expiresAt: true,
            grant: {
                select: {
                    id: true,
                    userId: true,
                    clientId: true,
                    sharedItems: true,
                    revokedAt: true,
                    familyExpiresAt: true,
                    client: { select: { disabledAt: true } },
                },
            },
        },
    });
    if (
        !token ||
        token.revokedAt ||
        token.expiresAt <= now ||
        token.grant.revokedAt ||
        token.grant.familyExpiresAt <= now ||
        token.grant.client.disabledAt
    ) {
        return { ok: false, error: "invalid_token" };
    }
    const scopes = fromDbScopes(token.scopes);
    if (!scopes.includes(requiredScope)) {
        return { ok: false, error: "insufficient_scope" };
    }
    const subject = await db.oAuthSubject.findUnique({
        where: {
            userId_clientId: {
                userId: token.grant.userId,
                clientId: token.grant.clientId,
            },
        },
        select: { subject: true },
    });
    if (!subject) return { ok: false, error: "invalid_token" };
    return {
        ok: true,
        grantId: token.grant.id,
        userId: token.grant.userId,
        clientId: token.grant.clientId,
        subject: subject.subject,
        scopes,
        sharedItems: token.grant.sharedItems as PartnerShareItemName[],
    };
}

/** userinfo 에 싣는 닉네임 — Discord · 공식 게임 이름은 내보내지 않는다 */
export async function getPartnerUserName(userId: number) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { username: true },
    });
    return user?.username ?? null;
}
