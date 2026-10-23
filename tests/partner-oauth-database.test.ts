import { createHash } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({ serverEnv: {} }));
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    const url = new URL(value);
    if (!["localhost", "127.0.0.1"].includes(url.hostname))
        throw new Error("Partner OAuth tests require a local database.");
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PRISMA_PG_SESSION_OPTIONS } = await import("@/lib/prisma-pg");
    return {
        default: new PrismaClient({
            adapter: new PrismaPg({
                connectionString: value,
                options: PRISMA_PG_SESSION_OPTIONS,
            }),
        }),
    };
});

import {
    approveAuthorization,
    authenticateBearer,
    authenticateOAuthClient,
    exchangeAuthorizationCode,
    findActiveGrant,
    refreshAccessToken,
    revokeGrantByUser,
    revokeOAuthToken,
    updateSharedItems,
} from "@/features/partner/server/oauth-service";
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
    }
);
