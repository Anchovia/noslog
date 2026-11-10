import "server-only";

import type { OAuthGrantRevokeReason, Prisma } from "@prisma/client";

import {
    OAUTH_SCOPES,
    type OAuthScope,
} from "@/features/partner/server/oauth-authorize";
import {
    createOAuthSubject,
    createOAuthToken,
} from "@/features/partner/server/oauth-tokens";
import {
    enqueuePartnerMessage,
    PARTNER_SHARE_ITEMS,
    type PartnerShareItemName,
} from "@/features/partner/server/partner-outbox";
import db from "@/lib/db";

/** code 는 한 번 · 짧게(RFC 6749 §4.1.2 는 10분 이하) */
const OAUTH_CODE_TTL_MS = 2 * 60 * 1000;
/** refresh 묶음 절대 수명 — 뮤즈캣 spec 30일 이상. 지나면 사용자가 다시 연결 */
const OAUTH_FAMILY_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const DB_SCOPE = {
    "nostalgia:read": "nostalgia_read",
    profile: "profile",
} as const;
export type DbScope = (typeof DB_SCOPE)[OAuthScope];

export function toDbScopes(scopes: readonly OAuthScope[]) {
    return scopes.map((scope) => DB_SCOPE[scope]);
}

export function fromDbScopes(scopes: readonly DbScope[]): OAuthScope[] {
    return OAUTH_SCOPES.filter((scope) => scopes.includes(DB_SCOPE[scope]));
}

export type Tx = Prisma.TransactionClient;

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
    /** 자동 승인은 요청 scope 가 더 좁아도 연결이 이미 허락한 범위를 그대로 둔다 */
    grantScopes?: OAuthScope[];
    sharedItems: PartnerShareItemName[];
    redirectUri: string;
    codeChallenge: string;
}) {
    const grantScopes = toDbScopes(input.grantScopes ?? input.scopes);
    const now = new Date();
    const sharedItems = PARTNER_SHARE_ITEMS.filter((item) =>
        input.sharedItems.includes(item)
    );
    const code = createOAuthToken("code");
    const save = () =>
        db.$transaction(async (tx) => {
            const subject = await ensureSubject(
                tx,
                input.userId,
                input.clientId
            );
            const active = await tx.oAuthGrant.findFirst({
                where: {
                    userId: input.userId,
                    clientId: input.clientId,
                    ...activeGrantWhere(now),
                },
                select: { id: true, sharedItems: true, generation: true },
                orderBy: { id: "desc" },
            });
            if (!active) {
                // 만료만 된 줄도 활성 유일 인덱스에 걸리므로 새 연결 전에 닫는다. 닫는 이유 값이 따로 없어 비워 둔다
                await tx.oAuthGrant.updateMany({
                    where: {
                        userId: input.userId,
                        clientId: input.clientId,
                        revokedAt: null,
                    },
                    data: { revokedAt: now },
                });
            }
            const last = active
                ? null
                : await tx.oAuthGrant.aggregate({
                      where: { userId: input.userId, clientId: input.clientId },
                      _max: { generation: true },
                  });
            const grant = active
                ? await tx.oAuthGrant.update({
                      where: { id: active.id },
                      data: {
                          scopes: grantScopes,
                          sharedItems,
                      },
                      select: { id: true, generation: true },
                  })
                : await tx.oAuthGrant.create({
                      data: {
                          userId: input.userId,
                          clientId: input.clientId,
                          scopes: grantScopes,
                          sharedItems,
                          generation: (last?._max.generation ?? 0) + 1,
                          familyExpiresAt: new Date(
                              now.getTime() + OAUTH_FAMILY_TTL_MS
                          ),
                      },
                      select: { id: true, generation: true },
                  });
            if (
                active?.sharedItems.some((item) => !sharedItems.includes(item))
            ) {
                await enqueueRecordsInvalidation(
                    tx,
                    input.userId,
                    input.clientId,
                    grant,
                    subject
                );
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
    // 같은 연결을 동시에 처음 만들면 한쪽이 유일 인덱스에 걸린다. 다시 돌면 먼저 만든 연결을 고친다
    await save().catch((error: unknown) => {
        if ((error as { code?: unknown }).code !== "P2002") throw error;
        return save();
    });
    return code.token;
}

export async function revokeGrant(
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
            await enqueueRecordsInvalidation(tx, userId, clientId, grant);
        }
        return true;
    });
}

/**
 * 공개 설정에서 점수 · 활동을 비공개로 바꿈 — 기록을 읽는 연결마다 뮤즈캣 캐시 무효화를 outbox 에 넣는다.
 * 공개 설정 저장과 같은 트랜잭션에서 부른다
 */
export async function enqueueRecordsInvalidationForUser(
    tx: Tx,
    userId: number
) {
    const grants = await tx.oAuthGrant.findMany({
        where: {
            userId,
            scopes: { has: DB_SCOPE["nostalgia:read"] },
            ...activeGrantWhere(new Date()),
        },
        select: { id: true, clientId: true, generation: true },
        orderBy: { id: "asc" },
    });
    for (const grant of grants) {
        await enqueueRecordsInvalidation(tx, userId, grant.clientId, grant);
    }
}

async function enqueueRecordsInvalidation(
    tx: Tx,
    userId: number,
    clientId: string,
    grant: { id: number; generation: number },
    knownSubject?: string
) {
    const subject =
        knownSubject ??
        (
            await tx.oAuthSubject.findUnique({
                where: { userId_clientId: { userId, clientId } },
                select: { subject: true },
            })
        )?.subject ??
        null;
    await enqueuePartnerMessage(tx, {
        clientId,
        grantId: grant.id,
        kind: "records_invalidation",
        generation: grant.generation,
        payload: {
            sub: subject,
            service: "nostalgia",
        },
    });
}
