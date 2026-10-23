import "server-only";

import type { OAuthGrantRevokeReason, Prisma } from "@prisma/client";

import {
    formatOAuthScope,
    OAUTH_SCOPES,
    type OAuthClientRegistration,
    type OAuthScope,
    parseOAuthScope,
} from "@/features/partner/server/oauth-authorize";
import { parseBasicClientCredentials } from "@/features/partner/server/oauth-client-auth";
import {
    createOAuthSubject,
    createOAuthToken,
    hashOAuthSecret,
    oauthSecretMatches,
    verifyPkceS256,
} from "@/features/partner/server/oauth-tokens";
import {
    enqueuePartnerMessage,
    PARTNER_SHARE_ITEMS,
    type PartnerShareItemName,
} from "@/features/partner/server/partner-outbox";
import db from "@/lib/db";

/** code 는 한 번 · 짧게(RFC 6749 §4.1.2 는 10분 이하) */
export const OAUTH_CODE_TTL_MS = 2 * 60 * 1000;
/** access 토큰 — 뮤즈캣 spec 300초 이상 권장 */
export const OAUTH_ACCESS_TTL_SECONDS = 60 * 60;
/** refresh 묶음 절대 수명 — 뮤즈캣 spec 30일 이상. 지나면 사용자가 다시 연결 */
export const OAUTH_FAMILY_TTL_MS = 90 * 24 * 60 * 60 * 1000;
/** 바뀐 refresh 토큰을, 새 토큰이 아직 한 번도 안 쓰였을 때만 이 시간 안에 한 번 더 받는다(응답을 놓친 재시도) */
const REFRESH_RETRY_GRACE_MS = 2 * 60 * 1000;

const DB_SCOPE = {
    "nostalgia:read": "nostalgia_read",
    profile: "profile",
} as const;
type DbScope = (typeof DB_SCOPE)[OAuthScope];

function toDbScopes(scopes: readonly OAuthScope[]) {
    return scopes.map((scope) => DB_SCOPE[scope]);
}

function fromDbScopes(scopes: readonly DbScope[]): OAuthScope[] {
    return OAUTH_SCOPES.filter((scope) => scopes.includes(DB_SCOPE[scope]));
}

type Tx = Prisma.TransactionClient;

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

export async function getAuthorizeClient(
    clientId: string | null
): Promise<OAuthClientRegistration | null> {
    if (!clientId) return null;
    const client = await db.oAuthClient.findFirst({
        where: { id: clientId, disabledAt: null },
        select: { id: true, redirectUris: true, allowedScopes: true },
    });
    if (!client) return null;
    return {
        clientId: client.id,
        redirectUris: client.redirectUris,
        allowedScopes: fromDbScopes(client.allowedScopes),
    };
}

export async function getClientName(clientId: string) {
    const client = await db.oAuthClient.findUnique({
        where: { id: clientId },
        select: { name: true },
    });
    return client?.name ?? null;
}

/** client_secret_basic — 교체 기간에는 옛 비밀도 받는다. 실패하면 null(→ 401) */
export async function authenticateOAuthClient(authorization: string | null) {
    const credentials = parseBasicClientCredentials(authorization);
    if (!credentials) return null;
    const client = await db.oAuthClient.findFirst({
        where: { id: credentials.clientId, disabledAt: null },
        select: {
            id: true,
            secretHash: true,
            previousSecretHash: true,
            previousSecretExpiresAt: true,
        },
    });
    if (!client) return null;
    const current = oauthSecretMatches(
        credentials.clientSecret,
        client.secretHash
    );
    const previous =
        client.previousSecretHash &&
        client.previousSecretExpiresAt &&
        client.previousSecretExpiresAt > new Date() &&
        oauthSecretMatches(credentials.clientSecret, client.previousSecretHash);
    return current || previous ? { id: client.id } : null;
}

async function ensureSubject(tx: Tx, userId: number, clientId: string) {
    const existing = await tx.oAuthSubject.findUnique({
        where: { userId_clientId: { userId, clientId } },
        select: { subject: true },
    });
    if (existing) return existing.subject;
    const created = await tx.oAuthSubject.create({
        data: { userId, clientId, subject: createOAuthSubject() },
        select: { subject: true },
    });
    return created.subject;
}

function activeGrantWhere(now: Date) {
    return { revokedAt: null, familyExpiresAt: { gt: now } };
}

/** 이 사용자가 이미 같은 범위를 허락했는지 — 처음 동의는 자동으로 넘기지 않는다(RFC 6749 §10.2) */
export async function findActiveGrant(userId: number, clientId: string) {
    const grant = await db.oAuthGrant.findFirst({
        where: { userId, clientId, ...activeGrantWhere(new Date()) },
        select: {
            id: true,
            scopes: true,
            sharedItems: true,
            generation: true,
            createdAt: true,
            lastUsedAt: true,
        },
        orderBy: { id: "desc" },
    });
    return grant
        ? {
              ...grant,
              scopes: fromDbScopes(grant.scopes),
              sharedItems: grant.sharedItems as PartnerShareItemName[],
          }
        : null;
}

/**
 * 동의 → 연결(grant)을 만들거나 고치고 한 번 쓰는 code 를 낸다.
 * 항목을 줄였으면 뮤즈캣 캐시 무효화를 같은 트랜잭션에서 outbox 에 넣는다(뮤즈캣 spec).
 */
export async function approveAuthorization(input: {
    userId: number;
    clientId: string;
    scopes: OAuthScope[];
    sharedItems: PartnerShareItemName[];
    redirectUri: string;
    codeChallenge: string;
}) {
    const now = new Date();
    const sharedItems = PARTNER_SHARE_ITEMS.filter((item) =>
        input.sharedItems.includes(item)
    );
    const code = createOAuthToken("code");
    await db.$transaction(async (tx) => {
        const subject = await ensureSubject(tx, input.userId, input.clientId);
        const active = await tx.oAuthGrant.findFirst({
            where: {
                userId: input.userId,
                clientId: input.clientId,
                ...activeGrantWhere(now),
            },
            select: { id: true, sharedItems: true, generation: true },
            orderBy: { id: "desc" },
        });
        const grant = active
            ? await tx.oAuthGrant.update({
                  where: { id: active.id },
                  data: {
                      scopes: toDbScopes(input.scopes),
                      sharedItems,
                  },
                  select: { id: true, generation: true },
              })
            : await tx.oAuthGrant.create({
                  data: {
                      userId: input.userId,
                      clientId: input.clientId,
                      scopes: toDbScopes(input.scopes),
                      sharedItems,
                      familyExpiresAt: new Date(
                          now.getTime() + OAUTH_FAMILY_TTL_MS
                      ),
                  },
                  select: { id: true, generation: true },
              });
        if (active?.sharedItems.some((item) => !sharedItems.includes(item))) {
            await enqueuePartnerMessage(tx, {
                clientId: input.clientId,
                grantId: grant.id,
                kind: "records_invalidation",
                generation: grant.generation,
                payload: { sub: subject, service: "nostalgia" },
            });
        }
        await tx.oAuthAuthorizationCode.create({
            data: {
                codeHash: code.hash,
                grantId: grant.id,
                redirectUri: input.redirectUri,
                codeChallenge: input.codeChallenge,
                scopes: toDbScopes(input.scopes),
                expiresAt: new Date(now.getTime() + OAUTH_CODE_TTL_MS),
            },
        });
    });
    return code.token;
}

async function revokeGrant(
    tx: Tx,
    grantId: number,
    reason: OAuthGrantRevokeReason,
    now: Date
) {
    await tx.oAuthGrant.updateMany({
        where: { id: grantId, revokedAt: null },
        data: { revokedAt: now, revokedReason: reason },
    });
    await tx.oAuthRefreshToken.updateMany({
        where: { grantId, revokedAt: null },
        data: { revokedAt: now },
    });
    await tx.oAuthAccessToken.updateMany({
        where: { grantId, revokedAt: null },
        data: { revokedAt: now },
    });
}

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
        if (
            !row ||
            row.grant.clientId !== input.clientId ||
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
                },
            },
        },
    });
    if (
        !token ||
        token.revokedAt ||
        token.expiresAt <= now ||
        token.grant.revokedAt ||
        token.grant.familyExpiresAt <= now
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

/** 사용자가 설정에서 연결을 끊음 — NosLog 쪽은 바로 막고, 파트너 알림은 outbox 가 재시도한다 */
export async function revokeGrantByUser(userId: number, clientId: string) {
    const now = new Date();
    await db.$transaction(async (tx) => {
        const grants = await tx.oAuthGrant.findMany({
            where: { userId, clientId, revokedAt: null },
            select: { id: true, generation: true },
        });
        const subject = await tx.oAuthSubject.findUnique({
            where: { userId_clientId: { userId, clientId } },
            select: { subject: true },
        });
        for (const grant of grants) {
            await revokeGrant(tx, grant.id, "user", now);
            await enqueuePartnerMessage(tx, {
                clientId,
                grantId: grant.id,
                kind: "revocation",
                generation: grant.generation,
                payload: {
                    sub: subject?.subject ?? null,
                    generation: grant.generation,
                    reason: "user",
                    revoked_at: now.toISOString(),
                },
            });
        }
    });
}

/** 설정 › 연결에서 보낼 항목을 바꿈. 줄었으면 뮤즈캣 캐시 무효화를 outbox 에 넣는다 */
export async function updateSharedItems(
    userId: number,
    clientId: string,
    items: PartnerShareItemName[]
) {
    const now = new Date();
    const next = PARTNER_SHARE_ITEMS.filter((item) => items.includes(item));
    return db.$transaction(async (tx) => {
        const grant = await tx.oAuthGrant.findFirst({
            where: { userId, clientId, ...activeGrantWhere(now) },
            select: { id: true, sharedItems: true, generation: true },
            orderBy: { id: "desc" },
        });
        if (!grant) return false;
        await tx.oAuthGrant.update({
            where: { id: grant.id },
            data: { sharedItems: next },
        });
        if (grant.sharedItems.some((item) => !next.includes(item))) {
            const subject = await tx.oAuthSubject.findUnique({
                where: { userId_clientId: { userId, clientId } },
                select: { subject: true },
            });
            await enqueuePartnerMessage(tx, {
                clientId,
                grantId: grant.id,
                kind: "records_invalidation",
                generation: grant.generation,
                payload: {
                    sub: subject?.subject ?? null,
                    service: "nostalgia",
                },
            });
        }
        return true;
    });
}

/** userinfo 에 싣는 닉네임 — Discord · 공식 게임 이름은 내보내지 않는다 */
export async function getPartnerUserName(userId: number) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { username: true },
    });
    return user?.username ?? null;
}
