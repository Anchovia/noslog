import "server-only";

import { createHash, randomBytes, randomUUID } from "node:crypto";

import { getMusecatMode } from "@/features/musecat/server/musecat-mode";
import {
    decryptMusecatToken,
    encryptMusecatToken,
    MUSECAT_TOKEN_KEY_ID,
} from "@/features/musecat/server/musecat-token-crypto";
import db from "@/lib/db";
import { serverEnv } from "@/lib/env/server";
import getSession from "@/lib/session";

/** 뮤즈캣 refresh 묶음 절대 수명(뮤즈캣 spec 30일) — 응답에 만료가 없으면 이것으로 계산 */
const MUSECAT_FAMILY_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CONNECT_TTL_MS = 10 * 60 * 1000;
const REFRESH_LEASE_MS = 15_000;
/** 쓰기 직전 만료가 이만큼 남았으면 refresh(미리 refresh 하지 않는다 — 회전만 늘어 위험) */
const REFRESH_SKEW_MS = 60_000;

export type MusecatConnectionView =
    | { status: "none" }
    | {
          status: "active" | "needs_reconnect";
          username: string | null;
          connectedAt: string;
          familyExpiresAt: string | null;
      };

function musecatOrigin() {
    const value = serverEnv.MUSECAT_API_ORIGIN;
    if (!value) throw new Error("MUSECAT_API_ORIGIN is not configured");
    return value.replace(/\/$/, "");
}

function clientBasic() {
    const id = serverEnv.MUSECAT_CLIENT_ID;
    const secret = serverEnv.MUSECAT_CLIENT_SECRET;
    if (!id || !secret) throw new Error("Musecat client is not configured");
    const encode = (value: string) =>
        encodeURIComponent(value).replace(/%20/g, "+");
    return `Basic ${Buffer.from(`${encode(id)}:${encode(secret)}`).toString("base64")}`;
}

const aad = (userId: number, column: string, generation: number) =>
    `${userId}|${column}|${generation}`;

export async function getMusecatConnection(
    userId: number
): Promise<MusecatConnectionView> {
    const mode = getMusecatMode();
    if (mode === "off") return { status: "none" };
    if (mode === "mock") {
        const session = await getSession();
        const mock = session.id === userId ? session.musecatMock : undefined;
        return mock
            ? {
                  status: "active",
                  username: mock.username,
                  connectedAt: new Date(mock.connectedAt).toISOString(),
                  familyExpiresAt: new Date(
                      mock.connectedAt + MUSECAT_FAMILY_TTL_MS
                  ).toISOString(),
              }
            : { status: "none" };
    }
    const row = await db.musecatConnection.findUnique({
        where: { userId },
        select: {
            status: true,
            musecatUsername: true,
            connectedAt: true,
            familyExpiresAt: true,
        },
    });
    if (!row || row.status === "revoked") return { status: "none" };
    const expired = row.familyExpiresAt && row.familyExpiresAt <= new Date();
    return {
        status:
            row.status === "needs_reconnect" || expired
                ? "needs_reconnect"
                : "active",
        username: row.musecatUsername,
        connectedAt: row.connectedAt.toISOString(),
        familyExpiresAt: row.familyExpiresAt?.toISOString() ?? null,
    };
}

/** 연결 시작 — mock 은 바로 연결된 것으로, live 는 뮤즈캣 동의 화면 주소(PKCE S256 · state)를 돌려준다 */
export async function beginMusecatConnect(returnTo: string) {
    const session = await getSession();
    if (!session.id) throw new Error("login required");
    if (getMusecatMode() === "mock") {
        const user = await db.user.findUnique({
            where: { id: session.id },
            select: { username: true },
        });
        session.musecatMock = {
            username: user?.username ?? "mock-user",
            connectedAt: Date.now(),
        };
        await session.save();
        return returnTo;
    }
    const state = randomBytes(24).toString("base64url");
    const verifier = randomBytes(48).toString("base64url");
    session.musecatConnect = {
        state,
        verifier,
        returnTo,
        createdAt: Date.now(),
    };
    await session.save();
    const url = new URL(`${musecatOrigin()}/oauth/authorize`);
    url.search = new URLSearchParams({
        response_type: "code",
        client_id: serverEnv.MUSECAT_CLIENT_ID ?? "",
        redirect_uri: serverEnv.MUSECAT_REDIRECT_URI ?? "",
        scope: "account:access",
        state,
        code_challenge: createHash("sha256")
            .update(verifier)
            .digest("base64url"),
        code_challenge_method: "S256",
    }).toString();
    return url.toString();
}

async function tokenRequest(body: URLSearchParams) {
    const response = await fetch(`${musecatOrigin()}/oauth/token`, {
        method: "POST",
        headers: {
            Authorization: clientBasic(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
    });
    const json = (await response.json().catch(() => null)) as {
        access_token?: string;
        refresh_token?: string;
        expires_in?: number;
        scope?: string;
        error?: string;
    } | null;
    return { status: response.status, json };
}

/** live 콜백 — state · iss 확인 → code 교환 → 뮤즈캣 계정 확인 → 암호화해 저장 */
export async function completeMusecatConnect(params: URLSearchParams) {
    const session = await getSession();
    const pending = session.musecatConnect;
    delete session.musecatConnect;
    await session.save();
    const returnTo = pending?.returnTo ?? "/settings?category=connections";
    if (
        !session.id ||
        !pending ||
        Date.now() - pending.createdAt > CONNECT_TTL_MS ||
        params.get("state") !== pending.state
    ) {
        return { ok: false as const, error: "invalid_state", returnTo };
    }
    const issuer = params.get("iss");
    if (issuer && issuer.replace(/\/$/, "") !== musecatOrigin()) {
        return { ok: false as const, error: "invalid_issuer", returnTo };
    }
    if (params.get("error")) {
        return { ok: false as const, error: "denied", returnTo };
    }
    const code = params.get("code");
    if (!code)
        return { ok: false as const, error: "invalid_request", returnTo };
    const token = await tokenRequest(
        new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: serverEnv.MUSECAT_REDIRECT_URI ?? "",
            code_verifier: pending.verifier,
        })
    );
    if (token.status !== 200 || !token.json?.access_token) {
        return { ok: false as const, error: "token_exchange", returnTo };
    }
    const me = (await fetch(`${musecatOrigin()}/developer/v1/me`, {
        headers: { Authorization: `Bearer ${token.json.access_token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
    })
        .then((response) => response.json())
        .catch(() => null)) as { sub?: string; username?: string } | null;
    if (!me?.sub)
        return { ok: false as const, error: "profile_fetch", returnTo };
    const now = Date.now();
    const userId = session.id;
    const existing = await db.musecatConnection.findUnique({
        where: { userId },
        select: { generation: true },
    });
    const generation = (existing?.generation ?? 0) + 1;
    const data = {
        musecatSubject: me.sub,
        musecatUsername: me.username ?? null,
        generation,
        status: "active" as const,
        scopes: (token.json.scope ?? "account:access").split(" "),
        accessTokenEnc: encryptMusecatToken(
            token.json.access_token,
            aad(userId, "access", generation)
        ),
        accessExpiresAt: new Date(now + (token.json.expires_in ?? 600) * 1000),
        refreshTokenEnc: token.json.refresh_token
            ? encryptMusecatToken(
                  token.json.refresh_token,
                  aad(userId, "refresh", generation)
              )
            : null,
        familyExpiresAt: new Date(now + MUSECAT_FAMILY_TTL_MS),
        encKeyId: MUSECAT_TOKEN_KEY_ID,
        refreshLeaseUntil: null,
        refreshAttemptId: null,
        refreshSentAt: null,
        lastErrorCode: null,
        blockedUntil: null,
        connectedAt: new Date(now),
        revokedAt: null,
    };
    await db.musecatConnection.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
    });
    return { ok: true as const, returnTo };
}

/**
 * 쓸 수 있는 access 토큰. 만료가 가까우면 refresh — DB lease 를 잡은 실행만 보내고, 보내기 전 attempt id 를 남긴다.
 * 응답이 불확실하면(보냈는데 못 받음) 다시 보내지 않고 「다시 연결 필요」(뮤즈캣은 재사용 시 연결을 폐기).
 */
export async function getMusecatAccessToken(userId: number) {
    const row = await db.musecatConnection.findUnique({ where: { userId } });
    if (!row || row.status !== "active" || !row.accessTokenEnc) {
        return { ok: false as const, error: "not_connected" };
    }
    const now = new Date();
    if (row.blockedUntil && row.blockedUntil > now) {
        return { ok: false as const, error: "rate_limited" };
    }
    if (row.familyExpiresAt && row.familyExpiresAt <= now) {
        await db.musecatConnection.update({
            where: { userId },
            data: {
                status: "needs_reconnect",
                lastErrorCode: "family_expired",
            },
        });
        return { ok: false as const, error: "needs_reconnect" };
    }
    if (
        row.accessExpiresAt &&
        row.accessExpiresAt.getTime() - now.getTime() > REFRESH_SKEW_MS
    ) {
        return {
            ok: true as const,
            token: decryptMusecatToken(
                row.accessTokenEnc,
                aad(userId, "access", row.generation)
            ),
            generation: row.generation,
            connectionId: row.id,
        };
    }
    if (!row.refreshTokenEnc)
        return { ok: false as const, error: "needs_reconnect" };
    const attemptId = randomUUID();
    const lease = await db.musecatConnection.updateMany({
        where: {
            id: row.id,
            status: "active",
            OR: [
                { refreshLeaseUntil: null },
                { refreshLeaseUntil: { lt: now } },
            ],
        },
        data: {
            refreshLeaseUntil: new Date(now.getTime() + REFRESH_LEASE_MS),
            refreshAttemptId: attemptId,
            refreshSentAt: now,
        },
    });
    if (lease.count !== 1) return { ok: false as const, error: "busy" };
    const refreshToken = decryptMusecatToken(
        row.refreshTokenEnc,
        aad(userId, "refresh", row.generation)
    );
    let result: Awaited<ReturnType<typeof tokenRequest>> | null = null;
    try {
        result = await tokenRequest(
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            })
        );
    } catch {
        result = null;
    }
    const failWith = async (
        code: string,
        status: "active" | "needs_reconnect",
        blockedUntil?: Date
    ) => {
        await db.musecatConnection.updateMany({
            where: { id: row.id, refreshAttemptId: attemptId },
            data: {
                status,
                lastErrorCode: code,
                refreshLeaseUntil: null,
                ...(blockedUntil ? { blockedUntil } : {}),
            },
        });
        return {
            ok: false as const,
            error: status === "needs_reconnect" ? "needs_reconnect" : code,
        };
    };
    // 보냈는데 응답을 못 받음 · 5xx — 옛 토큰이 이미 소비됐을 수 있어 다시 보내지 않는다
    if (!result || result.status >= 500)
        return failWith("uncertain_refresh", "needs_reconnect");
    if (result.status === 429) {
        return failWith(
            "rate_limited",
            "active",
            new Date(now.getTime() + 60_000)
        );
    }
    if (result.status !== 200 || !result.json?.access_token) {
        return failWith(
            result.json?.error ?? `http_${result.status}`,
            "needs_reconnect"
        );
    }
    await db.musecatConnection.updateMany({
        where: { id: row.id, refreshAttemptId: attemptId },
        data: {
            accessTokenEnc: encryptMusecatToken(
                result.json.access_token,
                aad(userId, "access", row.generation)
            ),
            accessExpiresAt: new Date(
                now.getTime() + (result.json.expires_in ?? 600) * 1000
            ),
            ...(result.json.refresh_token
                ? {
                      refreshTokenEnc: encryptMusecatToken(
                          result.json.refresh_token,
                          aad(userId, "refresh", row.generation)
                      ),
                  }
                : {}),
            refreshLeaseUntil: null,
            lastErrorCode: null,
        },
    });
    return {
        ok: true as const,
        token: result.json.access_token,
        generation: row.generation,
        connectionId: row.id,
    };
}

/** 연결 끊기 — NosLog 쪽은 바로 막고, live 면 뮤즈캣 토큰 폐기를 한 번 부른다(RFC 7009, 실패해도 막은 상태 유지) */
export async function disconnectMusecat(userId: number) {
    if (getMusecatMode() === "mock") {
        const session = await getSession();
        delete session.musecatMock;
        await session.save();
        return;
    }
    const row = await db.musecatConnection.findUnique({
        where: { userId },
        select: { refreshTokenEnc: true, generation: true },
    });
    await db.musecatConnection.updateMany({
        where: { userId },
        data: {
            status: "revoked",
            revokedAt: new Date(),
            accessTokenEnc: null,
            refreshTokenEnc: null,
        },
    });
    if (row?.refreshTokenEnc) {
        await fetch(`${musecatOrigin()}/oauth/revoke`, {
            method: "POST",
            headers: {
                Authorization: clientBasic(),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                token: decryptMusecatToken(
                    row.refreshTokenEnc,
                    aad(userId, "refresh", row.generation)
                ),
                token_type_hint: "refresh_token",
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        }).catch(() => null);
    }
}
