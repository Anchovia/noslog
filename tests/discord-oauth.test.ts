import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
    session: {
        id: undefined as number | undefined,
        profileCompleted: undefined as boolean | undefined,
        locale: undefined as "ko" | "ja" | "en" | undefined,
        discordOAuthState: undefined as string | undefined,
        discordOAuthReturnTo: undefined as string | undefined,
        discordOAuthMode: undefined as
            "refresh" | "change" | "delete" | "admin" | undefined,
        deletionVerification: undefined as
            | { userId: number; discordId: string; verifiedAt: number }
            | undefined,
        adminVerification: undefined as
            | { userId: number; discordId: string; verifiedAt: number }
            | undefined,
        sessionVersion: undefined as number | undefined,
        discordMfaEnabled: undefined as boolean | undefined,
        discordOAuthUserId: undefined as number | undefined,
        onboardingReturnTo: undefined as string | undefined,
        save: vi.fn(),
    },
    getSession: vi.fn(),
    userFindUnique: vi.fn(),
    userUpdate: vi.fn(),
    userCreate: vi.fn(),
    revalidateTag: vi.fn(),
    fetch: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));

vi.mock("@/lib/env/server", () => ({
    serverEnv: {
        get DISCORD_CLIENT_ID() {
            return process.env.DISCORD_CLIENT_ID;
        },
        get DISCORD_CLIENT_SECRET() {
            return process.env.DISCORD_CLIENT_SECRET;
        },
        get DISCORD_REDIRECT_URI() {
            return process.env.DISCORD_REDIRECT_URI;
        },
    },
}));

vi.mock("@/lib/db", () => ({
    default: {
        user: {
            findUnique: mocks.userFindUnique,
            update: mocks.userUpdate,
            create: mocks.userCreate,
        },
    },
}));

vi.mock("next/cache", () => ({ revalidateTag: mocks.revalidateTag }));

import { GET as completeDiscordOAuth } from "@/app/(auth)/discord/complete/route";
import { GET as startDiscordOAuth } from "@/app/(auth)/discord/start/route";

function request(path: string) {
    return new NextRequest(`http://localhost:3000${path}`);
}

function jsonResponse(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

function mockDiscordSuccess({
    id = "discord-1",
    avatar = "avatar-hash",
    mfa = false,
}: {
    id?: string;
    avatar?: string | null;
    mfa?: boolean;
} = {}) {
    mocks.fetch
        .mockResolvedValueOnce(jsonResponse({ access_token: "access-token" }))
        .mockResolvedValueOnce(
            jsonResponse({
                id,
                username: "discord-user",
                global_name: "Discord User",
                avatar,
                mfa_enabled: mfa,
            })
        );
}

describe("Discord OAuth", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.session.id = undefined;
        mocks.session.profileCompleted = undefined;
        mocks.session.locale = undefined;
        mocks.session.discordOAuthState = undefined;
        mocks.session.discordOAuthReturnTo = undefined;
        mocks.session.discordOAuthMode = undefined;
        mocks.session.deletionVerification = undefined;
        mocks.session.adminVerification = undefined;
        mocks.session.sessionVersion = undefined;
        mocks.session.discordMfaEnabled = undefined;
        mocks.session.discordOAuthUserId = undefined;
        mocks.session.onboardingReturnTo = undefined;
        mocks.getSession.mockResolvedValue(mocks.session);
        mocks.userUpdate.mockResolvedValue({ id: 1 });
        mocks.userCreate.mockResolvedValue({ id: 1 });
        vi.stubGlobal("fetch", mocks.fetch);
        vi.stubEnv("DISCORD_CLIENT_ID", "client-id");
        vi.stubEnv("DISCORD_CLIENT_SECRET", "client-secret");
        vi.stubEnv(
            "DISCORD_REDIRECT_URI",
            "http://localhost:3000/discord/complete"
        );
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it("탈퇴 재인증은 같은 로그인 사용자와 Discord 신원만 허용한다", async () => {
        mocks.session.id = 7;
        mocks.session.profileCompleted = true;
        await startDiscordOAuth(
            request(
                "/discord/start?mode=delete&returnTo=%2Fko%2Fsettings%3Fcategory%3Daccount"
            )
        );
        const state = mocks.session.discordOAuthState;
        expect(mocks.session.discordOAuthUserId).toBe(7);
        mocks.userFindUnique.mockResolvedValue({
            id: 7,
            discordId: "discord-1",
            avatar: null,
            sessionVersion: 0,
        });
        mockDiscordSuccess();
        const response = await completeDiscordOAuth(
            request(`/discord/complete?code=code&state=${state}`)
        );
        expect(mocks.session.deletionVerification).toEqual({
            userId: 7,
            discordId: "discord-1",
            verifiedAt: expect.any(Number),
        });
        expect(
            new URL(response.headers.get("location")!).searchParams.get(
                "discordResult"
            )
        ).toBe("delete");
        expect(mocks.userUpdate).not.toHaveBeenCalled();
        expect(mocks.userCreate).not.toHaveBeenCalled();
    });

    it.each(["identity", "session", "state"])(
        "탈퇴 재인증 %s 불일치는 인증 권한을 부여하지 않는다",
        async (mismatch) => {
            mocks.session.id = 7;
            mocks.session.profileCompleted = true;
            await startDiscordOAuth(
                request(
                    "/discord/start?mode=delete&returnTo=%2Fko%2Fsettings%3Fcategory%3Daccount"
                )
            );
            const state = mocks.session.discordOAuthState;
            mocks.userFindUnique.mockResolvedValue({
                id: mismatch === "session" ? 8 : 7,
                discordId: "discord-1",
                avatar: null,
                sessionVersion: 0,
            });
            mockDiscordSuccess({
                id: mismatch === "identity" ? "other" : "discord-1",
            });
            await completeDiscordOAuth(
                request(
                    `/discord/complete?code=code&state=${mismatch === "state" ? "bad" : state}`
                )
            );
            expect(mocks.session.deletionVerification).toBeUndefined();
            expect(mocks.userUpdate).not.toHaveBeenCalled();
        }
    );

    it("로그인 시작 시 안전한 복귀 주소와 state를 세션에 저장한다", async () => {
        const response = await startDiscordOAuth(
            request("/discord/start?returnTo=%2Fprofile%2F1")
        );
        const location = new URL(response.headers.get("location")!);

        expect(location.origin).toBe("https://discord.com");
        expect(location.pathname).toBe("/oauth2/authorize");
        expect(location.searchParams.get("state")).toBe(
            mocks.session.discordOAuthState
        );
        expect(mocks.session.discordOAuthState).toHaveLength(64);
        expect(mocks.session.discordOAuthReturnTo).toBe("/profile/1");
        expect(mocks.session.save).toHaveBeenCalledOnce();
    });

    it("외부 복귀 주소는 루트 경로로 대체한다", async () => {
        await startDiscordOAuth(
            request("/discord/start?returnTo=%2F%2Fevil.example")
        );

        expect(mocks.session.discordOAuthReturnTo).toBe("/");
    });

    it("OAuth 설정이 없으면 로그인 화면에 오류를 전달한다", async () => {
        vi.stubEnv("DISCORD_CLIENT_ID", "");

        const response = await startDiscordOAuth(request("/discord/start"));
        const location = new URL(response.headers.get("location")!);

        expect(location.pathname).toBe("/en/login");
        expect(location.searchParams.get("error")).toBe("oauth_config");
        expect(mocks.session.save).not.toHaveBeenCalled();
    });

    it("state가 다르면 Discord API를 호출하지 않고 거부한다", async () => {
        mocks.session.discordOAuthState = "expected-state";

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=wrong-state")
        );
        const location = new URL(response.headers.get("location")!);

        expect(location.pathname).toBe("/login");
        expect(location.searchParams.get("error")).toBe("invalid_state");
        expect(mocks.fetch).not.toHaveBeenCalled();
        expect(mocks.session.discordOAuthState).toBeUndefined();
    });

    it("유효한 state의 사용자 취소는 만료와 구분하고 복귀 주소를 유지한다", async () => {
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthReturnTo = "/ja/bookmarklet";
        mocks.session.locale = "ja";
        const response = await completeDiscordOAuth(
            request("/discord/complete?error=access_denied&state=state")
        );
        const url = new URL(response.headers.get("location")!);
        expect(url.pathname).toBe("/ja/login");
        expect(url.searchParams.get("error")).toBe("cancelled");
        expect(url.searchParams.get("returnTo")).toBe("/ja/bookmarklet");
        expect(mocks.fetch).not.toHaveBeenCalled();
        expect(mocks.session.discordOAuthState).toBeUndefined();
    });

    it("신규 계정의 원래 목적지를 온보딩까지 보존한다", async () => {
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthReturnTo = "/en/bookmarklet";
        mocks.session.locale = "en";
        mockDiscordSuccess({ id: "new-discord" });
        mocks.userFindUnique.mockResolvedValueOnce(null);
        mocks.userCreate.mockResolvedValueOnce({ id: 7 });
        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        expect(mocks.session.onboardingReturnTo).toBe("/en/bookmarklet");
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/en/onboarding"
        );
    });

    it("Discord 토큰 교환 실패를 로그인 오류로 변환한다", async () => {
        mocks.session.discordOAuthState = "state";
        mocks.fetch.mockResolvedValueOnce(jsonResponse({}, 401));

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        const location = new URL(response.headers.get("location")!);

        expect(location.pathname).toBe("/login");
        expect(location.searchParams.get("error")).toBe("token_exchange");
    });

    it("다른 사용자에게 연결된 Discord 계정은 재연결하지 않는다", async () => {
        mocks.session.id = 1;
        mocks.session.discordOAuthState = "state";
        mockDiscordSuccess();
        mocks.userFindUnique
            .mockResolvedValueOnce({ id: 1, avatar: null, sessionVersion: 0 })
            .mockResolvedValueOnce({
                id: 2,
                avatar: null,
                profileCompletedAt: new Date(),
            });

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        const location = new URL(response.headers.get("location")!);

        expect(location.pathname).toBe("/profile/settings");
        expect(location.searchParams.get("discordError")).toBe(
            "already_linked"
        );
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("Discord 재연결 시 사용자가 올린 Blob 아바타를 유지한다", async () => {
        const customAvatar =
            "https://store.public.blob.vercel-storage.com/avatar.png";
        mocks.session.id = 1;
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthReturnTo = "/profile/settings";
        mockDiscordSuccess();
        mocks.userFindUnique
            .mockResolvedValueOnce({
                id: 1,
                avatar: customAvatar,
                sessionVersion: 0,
            })
            .mockResolvedValueOnce(null);

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );

        expect(mocks.userUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 1 },
                data: expect.objectContaining({ avatar: customAvatar }),
            })
        );
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/profile/settings"
        );
    });

    it("사용자가 제거한 사진을 Discord 로그인으로 되살리지 않는다", async () => {
        mocks.session.id = 1;
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthReturnTo = "/profile/settings";
        mockDiscordSuccess();
        mocks.userFindUnique
            .mockResolvedValueOnce({
                id: 1,
                avatar: null,
                avatarUserManaged: true,
                sessionVersion: 0,
            })
            .mockResolvedValueOnce(null);
        await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        expect(mocks.userUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 1 },
                data: expect.objectContaining({ avatar: null }),
            })
        );
    });

    it("정보 새로고침은 현재 연결된 Discord 표시 정보만 갱신한다", async () => {
        mocks.session.id = 1;
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthMode = "refresh";
        mocks.session.discordOAuthUserId = 1;
        mocks.session.discordOAuthReturnTo =
            "/ko/settings?category=connections";
        mockDiscordSuccess({ id: "same-discord" });
        mocks.userFindUnique
            .mockResolvedValueOnce({
                id: 1,
                discordId: "same-discord",
                avatar: null,
                sessionVersion: 0,
            })
            .mockResolvedValueOnce({ id: 1 });
        await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        expect(mocks.userUpdate.mock.calls[0][0].data).toEqual({
            discordName: expect.any(String),
            discordUsername: expect.any(String),
        });
        expect(mocks.session.discordOAuthMode).toBeUndefined();
        expect(mocks.session.discordOAuthUserId).toBeUndefined();
    });

    it("정보 새로고침 도중 다른 Discord 계정으로 인증하면 연결을 바꾸지 않는다", async () => {
        mocks.session.id = 1;
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthMode = "refresh";
        mocks.session.discordOAuthUserId = 1;
        mocks.session.discordOAuthReturnTo =
            "/ja/settings?category=connections";
        mockDiscordSuccess({ id: "another-discord" });
        mocks.userFindUnique.mockResolvedValueOnce({
            id: 1,
            discordId: "original-discord",
            avatar: null,
            sessionVersion: 0,
        });
        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        const target = new URL(response.headers.get("location")!);
        expect(target.pathname).toBe("/ja/settings");
        expect(target.searchParams.get("category")).toBe("connections");
        expect(target.searchParams.get("discordError")).toBe(
            "identity_mismatch"
        );
        expect(mocks.userUpdate).not.toHaveBeenCalled();
        expect(mocks.userCreate).not.toHaveBeenCalled();
    });

    it("OAuth 시작 후 NosLog 세션이 달라지면 민감한 계정 변경을 거부한다", async () => {
        mocks.session.id = 2;
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthMode = "change";
        mocks.session.discordOAuthUserId = 1;
        mocks.session.discordOAuthReturnTo =
            "/en/settings?category=connections";
        mocks.userFindUnique.mockResolvedValueOnce({
            id: 2,
            avatar: null,
            sessionVersion: 0,
        });
        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        expect(
            new URL(response.headers.get("location")!).searchParams.get(
                "discordError"
            )
        ).toBe("session_expired");
        expect(mocks.fetch).not.toHaveBeenCalled();
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("게스트의 계정 변경 OAuth 요청은 로그인으로 돌려보낸다", async () => {
        const response = await startDiscordOAuth(
            request(
                "/discord/start?mode=change&returnTo=%2Fko%2Fsettings%3Fcategory%3Dconnections"
            )
        );
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/ko/login"
        );
        expect(mocks.session.discordOAuthMode).toBeUndefined();
    });

    it("처음 로그인한 Discord 사용자는 새 계정과 세션을 만든다", async () => {
        mocks.session.discordOAuthState = "state";
        mockDiscordSuccess({ id: "new-discord" });
        mocks.userFindUnique.mockResolvedValueOnce(null);
        mocks.userCreate.mockResolvedValueOnce({ id: 7 });

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );

        expect(mocks.userCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                discordId: "new-discord",
                discordName: "Discord User",
                discordUsername: "discord-user",
            }),
            select: {
                id: true,
                locale: true,
                role: true,
                sessionVersion: true,
            },
        });
        expect(mocks.session.id).toBe(7);
        expect(mocks.session.profileCompleted).toBe(false);
        expect(mocks.session.save).toHaveBeenCalledTimes(2);
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/onboarding"
        );
    });

    it("현재 DB에 없는 오래된 세션은 새 로그인으로 교체한다", async () => {
        mocks.session.id = 99;
        mocks.session.profileCompleted = true;
        mocks.session.locale = "ja";
        mocks.session.discordOAuthState = "state";
        mockDiscordSuccess({ id: "new-discord" });
        mocks.userFindUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);
        mocks.userCreate.mockResolvedValueOnce({ id: 7, locale: null });

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );

        expect(mocks.userCreate).toHaveBeenCalledOnce();
        expect(mocks.session.id).toBe(7);
        expect(mocks.session.profileCompleted).toBe(false);
        expect(mocks.session.locale).toBeUndefined();
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/onboarding"
        );
    });

    it("프로필 설정을 마친 기존 사용자는 요청한 화면으로 돌아간다", async () => {
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthReturnTo = "/music";
        mockDiscordSuccess();
        mocks.userFindUnique.mockResolvedValueOnce({
            id: 3,
            avatar: null,
            profileCompletedAt: new Date("2026-07-19"),
        });
        mocks.userUpdate.mockResolvedValueOnce({ id: 3 });

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );

        expect(mocks.session.profileCompleted).toBe(true);
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/music"
        );
    });

    it("다시 로그인할 때 값이 그대로면 쓰지 않고 캐시도 비우지 않는다", async () => {
        mocks.session.discordOAuthState = "state";
        mockDiscordSuccess();
        mocks.userFindUnique.mockResolvedValueOnce({
            id: 3,
            avatar: "https://blob.example/avatar.webp",
            avatarUserManaged: true,
            discordName: "Saved",
            discordUsername: "saved",
            profileCompletedAt: new Date("2026-07-19"),
            locale: "ko",
        });

        await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );

        expect(mocks.userUpdate).not.toHaveBeenCalled();
        expect(mocks.revalidateTag).not.toHaveBeenCalled();
        expect(mocks.session.id).toBe(3);
    });

    it("2단계 인증이 꺼진 관리자는 로그인만 되고 연결 설정에서 안내를 본다", async () => {
        const log = vi.spyOn(console, "warn").mockImplementation(() => {});
        mocks.session.discordOAuthState = "state";
        mockDiscordSuccess({ mfa: false });
        mocks.userFindUnique.mockResolvedValueOnce({
            id: 3,
            avatar: null,
            role: "admin",
            sessionVersion: 2,
            profileCompletedAt: new Date("2026-07-19"),
        });
        mocks.userUpdate.mockResolvedValueOnce({
            id: 3,
            role: "admin",
            sessionVersion: 2,
        });
        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        const target = new URL(response.headers.get("location")!);
        expect(mocks.session.id).toBe(3);
        expect(mocks.session.sessionVersion).toBe(2);
        expect(mocks.session.discordMfaEnabled).toBe(false);
        expect(target.pathname).toBe("/profile/settings");
        expect(target.searchParams.get("discordError")).toBe(
            "admin_mfa_required"
        );
        expect(log.mock.calls.map(([line]) => JSON.parse(line).event)).toEqual([
            "auth.discord.succeeded",
            "auth.discord.admin-mfa-denied",
        ]);
        log.mockRestore();
    });

    function startAdminReauth() {
        mocks.session.id = 1;
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthMode = "admin";
        mocks.session.discordOAuthUserId = 1;
        mocks.userFindUnique.mockResolvedValueOnce({
            id: 1,
            discordId: "discord-1",
            avatar: null,
            role: "admin",
            sessionVersion: 0,
        });
    }

    it("관리자 재확인은 2단계 인증이 켜진 같은 Discord 만 통과한다", async () => {
        startAdminReauth();
        mockDiscordSuccess({ mfa: true });
        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        expect(mocks.session.adminVerification).toEqual({
            userId: 1,
            discordId: "discord-1",
            verifiedAt: expect.any(Number),
        });
        expect(mocks.session.deletionVerification).toBeUndefined();
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/admin/users"
        );
    });

    it("관리자 재확인에서 2단계 인증이 꺼져 있으면 통과시키지 않는다", async () => {
        startAdminReauth();
        mockDiscordSuccess({ mfa: false });
        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        const target = new URL(response.headers.get("location")!);
        expect(mocks.session.adminVerification).toBeUndefined();
        expect(mocks.session.discordMfaEnabled).toBe(false);
        expect(target.pathname).toBe("/profile/settings");
        expect(target.searchParams.get("discordError")).toBe(
            "admin_mfa_required"
        );
    });

    it("관리자 재확인에서 다른 Discord 계정이면 통과시키지 않는다", async () => {
        startAdminReauth();
        mockDiscordSuccess({ id: "other", mfa: true });
        await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        expect(mocks.session.adminVerification).toBeUndefined();
    });

    it("관리자 계정은 연결된 Discord 계정을 바꾸지 못한다", async () => {
        mocks.session.id = 1;
        mocks.session.discordOAuthState = "state";
        mocks.session.discordOAuthMode = "change";
        mocks.session.discordOAuthUserId = 1;
        mockDiscordSuccess({ id: "attacker", mfa: true });
        mocks.userFindUnique
            .mockResolvedValueOnce({
                id: 1,
                discordId: "discord-1",
                avatar: null,
                role: "admin",
                sessionVersion: 0,
            })
            .mockResolvedValueOnce(null);
        await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("실패를 사유와 함께 남기고 받은 code 는 남기지 않는다", async () => {
        const log = vi.spyOn(console, "warn").mockImplementation(() => {});
        mocks.session.discordOAuthState = "expected-state";
        await completeDiscordOAuth(
            request("/discord/complete?code=secret-code&state=wrong")
        );
        const line = log.mock.calls[0][0] as string;
        expect(JSON.parse(line)).toMatchObject({
            event: "auth.discord.failed",
            reason: "invalid_state",
        });
        expect(line).not.toContain("secret-code");
        log.mockRestore();
    });
});
