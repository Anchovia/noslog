import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
    createSyncToken,
    isSyncTokenExpired,
    LEGACY_SYNC_TOKEN_EXPIRES_AT,
    verifySyncToken,
} from "@/lib/bookmarklet";

const DAY_MS = 24 * 60 * 60 * 1000;
const issuedAt = new Date("2026-10-29T03:00:00Z");

function after(days: number, extraMs = 0) {
    return new Date(issuedAt.getTime() + days * DAY_MS + extraMs);
}

// 만료 규칙 전 발급 꼴 — 페이로드에 iat 가 없다
function legacyToken(payload: Record<string, unknown>) {
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", process.env.BOOKMARKLET_SECRET!)
        .update(encoded)
        .digest("base64url");
    return `${encoded}.${signature}`;
}

function payloadOf(token: string) {
    return JSON.parse(
        Buffer.from(token.split(".")[0], "base64url").toString("utf8")
    );
}

describe("동기화 토큰 발급", () => {
    it("새 토큰 페이로드에 발급 시각(초)을 넣는다", () => {
        const token = createSyncToken({ userId: 3, version: 2 }, issuedAt);

        expect(payloadOf(token)).toEqual({
            userId: 3,
            version: 2,
            iat: issuedAt.getTime() / 1000,
        });
        expect(verifySyncToken(token, issuedAt)).toEqual({
            status: "valid",
            payload: { userId: 3, version: 2, iat: issuedAt.getTime() / 1000 },
        });
    });
});

describe("동기화 토큰 확인", () => {
    const token = createSyncToken({ userId: 3, version: 0 }, issuedAt);

    it("서명이 틀린 토큰은 만료와 구분해 invalid 로 돌려준다", () => {
        const [encoded, signature] = token.split(".");
        const otherPayload = Buffer.from(
            JSON.stringify({ ...payloadOf(token), userId: 4 })
        ).toString("base64url");

        for (const tampered of [
            `${otherPayload}.${signature}`,
            `${encoded}.${signature.slice(0, -2)}xx`,
            `${encoded}.${signature}.extra`,
            encoded,
        ]) {
            expect(verifySyncToken(tampered, issuedAt)).toEqual({
                status: "invalid",
            });
        }
    });

    it("서명이 맞아도 발급 시각이 정수가 아니면 invalid 로 돌려준다", () => {
        expect(
            verifySyncToken(
                legacyToken({ userId: 3, version: 0, iat: "1" }),
                issuedAt
            )
        ).toEqual({ status: "invalid" });
    });

    it("일반 사용자 토큰은 발급 180일이 지나면 expired 로 돌려준다", () => {
        expect(verifySyncToken(token, after(180, -1)).status).toBe("valid");
        expect(verifySyncToken(token, after(180))).toEqual({
            status: "expired",
        });
    });

    it("관리자 토큰은 사용자 행을 읽은 뒤 발급 30일로 만료한다", () => {
        const verified = verifySyncToken(token, after(31));
        expect(verified.status).toBe("valid");
        if (verified.status !== "valid") return;

        expect(
            isSyncTokenExpired(verified.payload, "admin", after(30, -1))
        ).toBe(false);
        expect(isSyncTokenExpired(verified.payload, "admin", after(30))).toBe(
            true
        );
        expect(isSyncTokenExpired(verified.payload, "user", after(31))).toBe(
            false
        );
    });
});

describe("발급 시각이 없는 기존 토큰", () => {
    const token = legacyToken({ userId: 3, version: 0 });

    it("기준 시각은 2027-04-27 00:00 KST 다", () => {
        expect(LEGACY_SYNC_TOKEN_EXPIRES_AT.toISOString()).toBe(
            "2027-04-26T15:00:00.000Z"
        );
    });

    it("기준 시각 전까지는 역할과 상관없이 받는다", () => {
        const justBefore = new Date(LEGACY_SYNC_TOKEN_EXPIRES_AT.getTime() - 1);
        const verified = verifySyncToken(token, justBefore);

        expect(verified).toEqual({
            status: "valid",
            payload: { userId: 3, version: 0 },
        });
        if (verified.status !== "valid") return;
        expect(isSyncTokenExpired(verified.payload, "admin", justBefore)).toBe(
            false
        );
    });

    it("기준 시각부터는 expired 로 돌려준다", () => {
        expect(verifySyncToken(token, LEGACY_SYNC_TOKEN_EXPIRES_AT)).toEqual({
            status: "expired",
        });
    });
});
