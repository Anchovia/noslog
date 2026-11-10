import { createHash } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env/server", () => ({ serverEnv: {} }));
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    const { createLocalTestClient } = await import("./helpers/local-database");
    return {
        default: createLocalTestClient(
            value,
            "Partner OAuth tests require a local database."
        ),
    };
});

import { authenticateOAuthClient } from "@/features/partner/server/oauth-client-service";
import {
    approveAuthorization,
    enqueueRecordsInvalidationForUser,
    findActiveGrant,
    revokeGrantByUser,
    updateSharedItems,
} from "@/features/partner/server/oauth-grant-service";
import {
    authenticateBearer,
    exchangeAuthorizationCode,
    refreshAccessToken,
    revokeOAuthToken,
} from "@/features/partner/server/oauth-token-service";
import { hashOAuthSecret } from "@/features/partner/server/oauth-tokens";
import { dispatchPartnerOutbox } from "@/features/partner/server/partner-outbox";
import db from "@/lib/db";

// 파트너 OAuth 흐름(뮤즈캣 연동 B, 2026-10-20) — 실제 Postgres 로 code 1회 · refresh 회전 · 재사용 폐기 · 해제 알림을 본다
describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "partner OAuth on isolated PostgreSQL",
    () => {
        const clientId = `test-client-${Date.now()}`;
        const secret = "client-secret-value-0123456789";
        const redirectUri = "https://partner.example/callback";
        const verifier = "dBjftJeZ4CVP-mJ92K1o3Fq8xH7rQ0sLnUwYzAbCdEf";
        const challenge = createHash("sha256")
            .update(verifier)
            .digest("base64url");
        let userId = 0;
        const basic = `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`;

        async function newCode(
            sharedItems = ["summary", "recent_plays"] as const
        ) {
            return approveAuthorization({
                userId,
                clientId,
                scopes: ["profile", "nostalgia:read"],
                sharedItems: [...sharedItems],
                redirectUri,
                codeChallenge: challenge,
            });
        }

        beforeAll(async () => {
            const user = await db.user.create({
                data: { username: `oauth-test-${Date.now()}` },
                select: { id: true },
            });
            userId = user.id;
            await db.oAuthClient.create({
                data: {
                    id: clientId,
                    name: "Test partner",
                    secretHash: hashOAuthSecret(secret),
                    redirectUris: [redirectUri],
                    allowedScopes: ["profile", "nostalgia_read"],
                },
            });
        });

        afterAll(async () => {
            await db.oAuthClient.deleteMany({ where: { id: clientId } });
            await db.user.deleteMany({ where: { id: userId } });
        });

        it("authenticates the client with its secret only", async () => {
            expect(await authenticateOAuthClient(basic)).toEqual({
                id: clientId,
            });
            const wrong = `Basic ${Buffer.from(`${clientId}:nope`).toString("base64")}`;
            expect(await authenticateOAuthClient(wrong)).toBeNull();
        });

        it("exchanges a code once and serves bearer checks", async () => {
            const code = await newCode();
            const first = await exchangeAuthorizationCode({
                clientId,
                code,
                redirectUri,
                codeVerifier: verifier,
            });
            expect(first.ok).toBe(true);
            if (!first.ok) return;
            expect(first.body.scope).toBe("profile nostalgia:read");
            expect(first.body.access_token.startsWith("nla_")).toBe(true);
            const auth = await authenticateBearer(
                `Bearer ${first.body.access_token}`,
                "nostalgia:read"
            );
            expect(auth).toMatchObject({
                ok: true,
                userId,
                sharedItems: ["summary", "recent_plays"],
            });
            if (auth.ok) expect(auth.subject.startsWith("nl_")).toBe(true);
            // 같은 code 를 다시 쓰면 연결 전체를 폐기
            const replay = await exchangeAuthorizationCode({
                clientId,
                code,
                redirectUri,
                codeVerifier: verifier,
            });
            expect(replay).toEqual({ ok: false, error: "invalid_grant" });
            expect(
                await authenticateBearer(
                    `Bearer ${first.body.access_token}`,
                    "profile"
                )
            ).toEqual({ ok: false, error: "invalid_token" });
            expect(await findActiveGrant(userId, clientId)).toBeNull();
        });

        it("rejects a wrong verifier or redirect", async () => {
            for (const input of [
                { redirectUri, codeVerifier: `${verifier.slice(0, -1)}x` },
                { redirectUri: `${redirectUri}/x`, codeVerifier: verifier },
            ]) {
                const code = await newCode();
                expect(
                    await exchangeAuthorizationCode({
                        clientId,
                        code,
                        ...input,
                    })
                ).toEqual({ ok: false, error: "invalid_grant" });
            }
        });

        it("rotates refresh tokens, tolerates one lost response and revokes on replay", async () => {
            const code = await newCode();
            const issued = await exchangeAuthorizationCode({
                clientId,
                code,
                redirectUri,
                codeVerifier: verifier,
            });
            if (!issued.ok) throw new Error("exchange failed");
            const firstRefresh = issued.body.refresh_token;
            const rotated = await refreshAccessToken({
                clientId,
                refreshToken: firstRefresh,
                scope: null,
            });
            expect(rotated.ok).toBe(true);
            // 응답을 놓친 재시도 — 새 토큰이 아직 안 쓰였으니 한 번 더 받아 준다
            const retried = await refreshAccessToken({
                clientId,
                refreshToken: firstRefresh,
                scope: null,
            });
            expect(retried.ok).toBe(true);
            if (!rotated.ok || !retried.ok) return;
            expect(
                await authenticateBearer(
                    `Bearer ${rotated.body.access_token}`,
                    "profile"
                )
            ).toEqual({ ok: false, error: "invalid_token" });
            // 재시도로 받은 토큰을 쓰고, 그 다음 토큰까지 쓰인 뒤 옛 토큰이 다시 오면 폐기
            const next = await refreshAccessToken({
                clientId,
                refreshToken: retried.body.refresh_token,
                scope: null,
            });
            if (!next.ok) throw new Error("rotation failed");
            const after = await refreshAccessToken({
                clientId,
                refreshToken: next.body.refresh_token,
                scope: null,
            });
            expect(after.ok).toBe(true);
            expect(
                await refreshAccessToken({
                    clientId,
                    refreshToken: retried.body.refresh_token,
                    scope: null,
                })
            ).toEqual({ ok: false, error: "invalid_grant" });
            expect(await findActiveGrant(userId, clientId)).toBeNull();
        });

        it("gives a new generation to a reconnect and keeps one active grant", async () => {
            const grantUser = await db.user.create({
                data: { username: `oauth-grant-test-${Date.now()}` },
                select: { id: true },
            });
            const approve = () =>
                approveAuthorization({
                    userId: grantUser.id,
                    clientId,
                    scopes: ["profile"],
                    sharedItems: [],
                    redirectUri,
                    codeChallenge: challenge,
                });
            const grants = () =>
                db.oAuthGrant.findMany({
                    where: { userId: grantUser.id, clientId },
                    orderBy: { id: "asc" },
                });
            // 동시에 처음 연결해도 활성 연결은 하나
            await Promise.all([approve(), approve(), approve(), approve()]);
            expect(await grants()).toHaveLength(1);
            const [first] = await grants();
            expect(first.generation).toBe(1);

            await db.oAuthGrant.update({
                where: { id: first.id },
                data: { revokedAt: new Date(), revokedReason: "user" },
            });
            await approve();
            expect((await grants()).map((g) => g.generation)).toEqual([1, 2]);

            // 만료만 된 줄은 닫히고 다음 세대가 시작된다
            const [, second] = await grants();
            await db.oAuthGrant.update({
                where: { id: second.id },
                data: { familyExpiresAt: new Date(Date.now() - 1000) },
            });
            await approve();
            const after = await grants();
            expect(after.map((g) => g.generation)).toEqual([1, 2, 3]);
            expect(after[1].revokedAt).not.toBeNull();
            expect(after[2].revokedAt).toBeNull();

            await expect(
                db.oAuthGrant.create({
                    data: {
                        userId: grantUser.id,
                        clientId,
                        scopes: after[2].scopes,
                        familyExpiresAt: new Date(Date.now() + 60_000),
                    },
                })
            ).rejects.toMatchObject({ code: "P2002" });
            await db.user.delete({ where: { id: grantUser.id } });
        });

        it("refuses to widen scope on refresh", async () => {
            const code = await approveAuthorization({
                userId,
                clientId,
                scopes: ["profile"],
                sharedItems: [],
                redirectUri,
                codeChallenge: challenge,
            });
            const issued = await exchangeAuthorizationCode({
                clientId,
                code,
                redirectUri,
                codeVerifier: verifier,
            });
            if (!issued.ok) throw new Error("exchange failed");
            expect(
                await refreshAccessToken({
                    clientId,
                    refreshToken: issued.body.refresh_token,
                    scope: "profile nostalgia:read",
                })
            ).toEqual({ ok: false, error: "invalid_scope" });
        });

        it("ends the connection when the partner revokes a refresh token", async () => {
            const issued = await exchangeAuthorizationCode({
                clientId,
                code: await newCode(),
                redirectUri,
                codeVerifier: verifier,
            });
            if (!issued.ok) throw new Error("exchange failed");
            await revokeOAuthToken("someone-else", issued.body.refresh_token);
            expect(await findActiveGrant(userId, clientId)).not.toBeNull();
            await revokeOAuthToken(clientId, issued.body.refresh_token);
            expect(await findActiveGrant(userId, clientId)).toBeNull();
            await revokeOAuthToken(clientId, "unknown-token");
        });

        it("queues invalidation when items shrink and revocation when the user disconnects", async () => {
            await exchangeAuthorizationCode({
                clientId,
                code: await newCode(),
                redirectUri,
                codeVerifier: verifier,
            });
            expect(await updateSharedItems(userId, clientId, ["summary"])).toBe(
                true
            );
            await revokeGrantByUser(userId, clientId);
            const kinds = await db.partnerOutboxMessage.findMany({
                where: { clientId, status: "pending" },
                select: { kind: true },
                orderBy: { createdAt: "asc" },
            });
            expect(kinds.map(({ kind }) => kind)).toEqual([
                "records_invalidation",
                "revocation",
            ]);
            const sent: string[] = [];
            const result = await dispatchPartnerOutbox({
                sender: async (message) => {
                    sent.push(message.kind);
                    return message.kind === "revocation"
                        ? { kind: "retry", status: 503, error: "http_503" }
                        : { kind: "delivered", status: 204 };
                },
            });
            expect(result).toMatchObject({ delivered: 1 });
            expect(sent.sort()).toEqual(["records_invalidation", "revocation"]);
            const retry = await db.partnerOutboxMessage.findFirst({
                where: { clientId, kind: "revocation" },
                select: { status: true, attempts: true, lastHttpStatus: true },
            });
            expect(retry).toEqual({
                status: "pending",
                attempts: 1,
                lastHttpStatus: 503,
            });
        });

        it("keeps the granted scopes when an existing connection is approved again with fewer", async () => {
            await exchangeAuthorizationCode({
                clientId,
                code: await newCode(),
                redirectUri,
                codeVerifier: verifier,
            });
            const grant = await findActiveGrant(userId, clientId);
            if (!grant) throw new Error("grant missing");
            await approveAuthorization({
                userId,
                clientId,
                scopes: ["profile"],
                grantScopes: grant.scopes,
                sharedItems: grant.sharedItems,
                redirectUri,
                codeChallenge: challenge,
            });
            expect(await findActiveGrant(userId, clientId)).toMatchObject({
                id: grant.id,
                scopes: ["profile", "nostalgia:read"],
            });
            await revokeGrantByUser(userId, clientId);
        });

        it("stops issued access tokens once the client is disabled", async () => {
            const issued = await exchangeAuthorizationCode({
                clientId,
                code: await newCode(),
                redirectUri,
                codeVerifier: verifier,
            });
            if (!issued.ok) throw new Error("exchange failed");
            const bearer = `Bearer ${issued.body.access_token}`;
            expect(await authenticateBearer(bearer, "profile")).toMatchObject({
                ok: true,
            });
            await db.oAuthClient.update({
                where: { id: clientId },
                data: { disabledAt: new Date() },
            });
            try {
                expect(await authenticateBearer(bearer, "profile")).toEqual({
                    ok: false,
                    error: "invalid_token",
                });
            } finally {
                await db.oAuthClient.update({
                    where: { id: clientId },
                    data: { disabledAt: null },
                });
                await revokeGrantByUser(userId, clientId);
            }
        });

        it("ends the connection when a revoked refresh token comes back", async () => {
            const issued = await exchangeAuthorizationCode({
                clientId,
                code: await newCode(),
                redirectUri,
                codeVerifier: verifier,
            });
            if (!issued.ok) throw new Error("exchange failed");
            const grant = await findActiveGrant(userId, clientId);
            if (!grant) throw new Error("grant missing");
            const first = issued.body.refresh_token;
            const lost = await refreshAccessToken({
                clientId,
                refreshToken: first,
                scope: null,
            });
            // 응답을 놓친 재시도 — 먼저 낸 토큰은 거두고 새 토큰을 다시 낸다
            const retried = await refreshAccessToken({
                clientId,
                refreshToken: first,
                scope: null,
            });
            if (!lost.ok || !retried.ok) throw new Error("rotation failed");
            // 다른 클라이언트가 내밀면 연결은 그대로
            expect(
                await refreshAccessToken({
                    clientId: "someone-else",
                    refreshToken: lost.body.refresh_token,
                    scope: null,
                })
            ).toEqual({ ok: false, error: "invalid_grant" });
            expect(await findActiveGrant(userId, clientId)).not.toBeNull();
            expect(
                await refreshAccessToken({
                    clientId,
                    refreshToken: lost.body.refresh_token,
                    scope: null,
                })
            ).toEqual({ ok: false, error: "invalid_grant" });
            expect(await findActiveGrant(userId, clientId)).toBeNull();
            expect(
                await db.oAuthGrant.findUnique({
                    where: { id: grant.id },
                    select: { revokedReason: true },
                })
            ).toEqual({ revokedReason: "replay" });
            expect(
                await authenticateBearer(
                    `Bearer ${retried.body.access_token}`,
                    "profile"
                )
            ).toEqual({ ok: false, error: "invalid_token" });
            expect(
                await db.partnerOutboxMessage.count({
                    where: { grantId: grant.id, kind: "revocation" },
                })
            ).toBe(0);
        });

        it("queues invalidation for record-reading connections when the user hides records", async () => {
            await exchangeAuthorizationCode({
                clientId,
                code: await newCode(),
                redirectUri,
                codeVerifier: verifier,
            });
            const reader = await findActiveGrant(userId, clientId);
            if (!reader) throw new Error("grant missing");
            await db.$transaction((tx) =>
                enqueueRecordsInvalidationForUser(tx, userId)
            );
            const queued = await db.partnerOutboxMessage.findMany({
                where: { grantId: reader.id },
                select: { kind: true, generation: true, payload: true },
            });
            const subject = await db.oAuthSubject.findUnique({
                where: { userId_clientId: { userId, clientId } },
                select: { subject: true },
            });
            expect(queued).toEqual([
                {
                    kind: "records_invalidation",
                    generation: reader.generation,
                    payload: { sub: subject?.subject, service: "nostalgia" },
                },
            ]);
            // 기록 범위가 없는 연결에는 보내지 않는다
            await revokeGrantByUser(userId, clientId);
            await approveAuthorization({
                userId,
                clientId,
                scopes: ["profile"],
                sharedItems: [],
                redirectUri,
                codeChallenge: challenge,
            });
            const profileOnly = await findActiveGrant(userId, clientId);
            if (!profileOnly) throw new Error("grant missing");
            await db.$transaction((tx) =>
                enqueueRecordsInvalidationForUser(tx, userId)
            );
            expect(
                await db.partnerOutboxMessage.count({
                    where: { grantId: profileOnly.id },
                })
            ).toBe(0);
            await revokeGrantByUser(userId, clientId);
        });
    }
);
