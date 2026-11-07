import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: {} as Record<string, unknown>,
    row: null as Record<string, unknown> | null,
    updateMany: vi.fn(),
    live: vi.fn(),
    report: vi.fn(),
    mode: vi.fn(() => "live"),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ default: async () => mocks.session }));
vi.mock("@/features/musecat/server/musecat-mode", () => ({
    getMusecatMode: mocks.mode,
}));
vi.mock("@/features/musecat/server/musecat-token-crypto", () => ({
    MUSECAT_TOKEN_KEY_ID: "k",
    encryptMusecatToken: (value: string) => `enc:${value}`,
    decryptMusecatToken: (value: string) => value.replace("enc:", ""),
}));
vi.mock("@/lib/env/server", () => ({
    serverEnv: {
        MUSECAT_API_ORIGIN: "https://musecat.test",
        MUSECAT_CLIENT_ID: "id",
        MUSECAT_CLIENT_SECRET: "secret",
        MUSECAT_REDIRECT_URI: "https://noslog.test/api/musecat/callback",
    },
}));
vi.mock("@/lib/db", () => ({
    default: {
        musecatConnection: {
            findUnique: async () => mocks.row,
            updateMany: mocks.updateMany,
            upsert: vi.fn(),
        },
        musecatAction: { create: vi.fn() },
        arcadeExternalId: { findFirst: async () => null },
    },
}));
vi.mock("@/features/arcades/arcade-discovery", () => ({
    arcadeDistance: vi.fn(),
}));
vi.mock("@/features/arcades/server/public-arcade-service", () => ({
    getPublicArcade: vi.fn(),
    getPublicArcades: vi.fn(),
}));
vi.mock("@/features/musecat/server/musecat-mock", () => ({}));
vi.mock("@/features/musecat/server/musecat-live-client", () => ({
    getMusecatArcadeLive: mocks.live,
    reportMusecatFault: mocks.report,
    fromMusecatArcade: vi.fn(),
    checkMusecatCampaign: vi.fn(),
    reactMusecatFlag: vi.fn(),
    setMusecatFavorite: vi.fn(),
}));

import {
    getMusecatArcadePage,
    reportFault,
} from "@/features/musecat/server/musecat-arcade-service";
import {
    completeMusecatConnect,
    getMusecatAccessToken,
} from "@/features/musecat/server/musecat-connection-service";

const HOUR = 60 * 60 * 1000;

/** updateMany 의 where 를 실제 행에 대어 보고, 맞을 때만 행을 고친다 */
function applyToRow() {
    mocks.updateMany.mockImplementation(
        async ({
            where,
            data,
        }: {
            where: Record<string, unknown>;
            data: Record<string, unknown>;
        }) => {
            const row = mocks.row!;
            const matches = Object.entries(where).every(([key, value]) =>
                key === "OR" ? true : row[key] === value
            );
            if (!matches) return { count: 0 };
            Object.assign(row, data);
            return { count: 1 };
        }
    );
}

function activeRow(overrides: Record<string, unknown> = {}) {
    return {
        id: 1,
        userId: 9,
        status: "active",
        generation: 3,
        accessTokenEnc: "enc:old-access",
        refreshTokenEnc: "enc:old-refresh",
        accessExpiresAt: new Date(Date.now() + HOUR),
        familyExpiresAt: new Date(Date.now() + 24 * HOUR),
        refreshLeaseUntil: null,
        blockedUntil: null,
        refreshAttemptId: null,
        musecatUsername: "cat",
        connectedAt: new Date(),
        ...overrides,
    };
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    mocks.session = { id: 9, save: vi.fn() };
    mocks.row = null;
    mocks.mode.mockReturnValue("live");
    applyToRow();
});

describe("뮤즈캣 연결 콜백", () => {
    it("token 호출이 시간 초과되면 던지지 않고 token_exchange 로 돌아간다", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockRejectedValue(new DOMException("t", "TimeoutError"))
        );
        mocks.session.musecatConnect = {
            state: "s",
            verifier: "v",
            returnTo: "/settings",
            createdAt: Date.now(),
        };
        await expect(
            completeMusecatConnect(
                new URLSearchParams({ state: "s", code: "c" })
            )
        ).resolves.toEqual({
            ok: false,
            error: "token_exchange",
            returnTo: "/settings",
        });
    });
});

describe("토큰 갱신 중 연결 끊기", () => {
    const expiring = () =>
        activeRow({ accessExpiresAt: new Date(Date.now() - 1000) });

    function refreshAnswer(status: number, body: unknown) {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                // 응답을 기다리는 사이에 끊겼다
                Object.assign(mocks.row!, {
                    status: "revoked",
                    accessTokenEnc: null,
                    refreshTokenEnc: null,
                });
                return new Response(JSON.stringify(body), { status });
            })
        );
    }

    it("성공한 갱신이 revoked 줄에 새 토큰을 저장하지 않고 쓰지도 않는다", async () => {
        mocks.row = expiring();
        refreshAnswer(200, {
            access_token: "new-access",
            refresh_token: "new-refresh",
        });
        await expect(getMusecatAccessToken(9)).resolves.toEqual({
            ok: false,
            error: "not_connected",
        });
        expect(mocks.row).toMatchObject({
            status: "revoked",
            accessTokenEnc: null,
            refreshTokenEnc: null,
        });
    });

    it("실패한 갱신이 revoked 줄을 다시 연결 필요로 되살리지 않는다", async () => {
        mocks.row = expiring();
        refreshAnswer(500, {});
        await getMusecatAccessToken(9);
        expect(mocks.row).toMatchObject({ status: "revoked" });
    });

    it("끊기지 않은 갱신은 그대로 저장하고 새 토큰을 준다", async () => {
        mocks.row = expiring();
        vi.stubGlobal(
            "fetch",
            vi.fn(
                async () =>
                    new Response(
                        JSON.stringify({
                            access_token: "new-access",
                            refresh_token: "new-refresh",
                        }),
                        { status: 200 }
                    )
            )
        );
        await expect(getMusecatAccessToken(9)).resolves.toMatchObject({
            ok: true,
            token: "new-access",
        });
        expect(mocks.row).toMatchObject({
            status: "active",
            accessTokenEnc: "enc:new-access",
            refreshTokenEnc: "enc:new-refresh",
        });
    });
});

describe("뮤즈캣 401 과 busy", () => {
    const fault = {
        musecatArcadeId: "1",
        gameId: "2",
        disruption: "broken" as never,
        message: "m",
        photos: [],
    };

    it("상세 조회가 401 이면 연결이 다시 연결 필요가 된다", async () => {
        mocks.row = activeRow();
        mocks.live.mockResolvedValue([
            { ok: false, status: 401, error: "invalid_token" },
            { ok: false, status: 401, error: "invalid_token" },
        ]);
        await expect(getMusecatArcadePage("slug")).resolves.toBeNull();
        expect(mocks.row).toMatchObject({
            status: "needs_reconnect",
            lastErrorCode: "http_401",
        });
    });

    it("상세 조회가 500 이면 연결을 건드리지 않는다", async () => {
        mocks.row = activeRow();
        mocks.live.mockResolvedValue([
            { ok: false, status: 500, error: "http_500" },
            { ok: false, status: 500, error: "http_500" },
        ]);
        await getMusecatArcadePage("slug");
        expect(mocks.row).toMatchObject({ status: "active" });
    });

    it("쓰기가 401 이면 연결을 바꾸고 needs_reconnect 를 돌려준다", async () => {
        mocks.row = activeRow();
        mocks.report.mockResolvedValue({ ok: false, status: 401, error: "x" });
        await expect(reportFault(fault)).resolves.toEqual({
            ok: false,
            error: "needs_reconnect",
        });
        expect(mocks.row).toMatchObject({ status: "needs_reconnect" });
    });

    it("401 뒤에 다시 연결했으면 새 세대를 내리지 않는다", async () => {
        mocks.row = activeRow();
        mocks.report.mockImplementation(async () => {
            mocks.row!.generation = 4;
            return { ok: false, status: 401, error: "x" };
        });
        await reportFault(fault);
        expect(mocks.row).toMatchObject({ status: "active", generation: 4 });
    });

    it("다른 요청이 갱신 중(busy)이면 연결 안 됨이 아니라 다시 시도 안내다", async () => {
        mocks.row = activeRow({
            accessExpiresAt: new Date(Date.now() - 1000),
            status: "active",
        });
        mocks.updateMany.mockResolvedValueOnce({ count: 0 });
        await expect(reportFault(fault)).resolves.toEqual({
            ok: false,
            error: "failed",
        });
    });
});
