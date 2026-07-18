import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
    session: {
        id: undefined as number | undefined,
        discordOAuthState: undefined as string | undefined,
        discordOAuthReturnTo: undefined as string | undefined,
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
}: {
    id?: string;
    avatar?: string | null;
} = {}) {
    mocks.fetch
        .mockResolvedValueOnce(jsonResponse({ access_token: "access-token" }))
        .mockResolvedValueOnce(
            jsonResponse({
                id,
                username: "discord-user",
                global_name: "Discord User",
                avatar,
            })
        );
}

describe("Discord OAuth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = undefined;
        mocks.session.discordOAuthState = undefined;
        mocks.session.discordOAuthReturnTo = undefined;
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

        expect(location.pathname).toBe("/login");
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
        mocks.userFindUnique.mockResolvedValueOnce({ id: 2, avatar: null });

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
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ id: 1, avatar: customAvatar });

        const response = await completeDiscordOAuth(
            request("/discord/complete?code=code&state=state")
        );

        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({ avatar: customAvatar }),
        });
        expect(new URL(response.headers.get("location")!).pathname).toBe(
            "/profile/settings"
        );
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
                discord_id: "new-discord",
                discord_name: "Discord User",
            }),
            select: { id: true },
        });
        expect(mocks.session.id).toBe(7);
        expect(mocks.session.save).toHaveBeenCalledTimes(2);
        expect(new URL(response.headers.get("location")!).pathname).toBe("/");
    });
});
