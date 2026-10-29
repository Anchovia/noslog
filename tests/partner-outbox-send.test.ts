import { afterEach, describe, expect, it, vi } from "vitest";

const env = vi.hoisted(() => ({
    serverEnv: {} as Record<string, string | undefined>,
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => env);
vi.mock("@/lib/db", () => ({ default: {} }));

import { sendToMusecat } from "@/features/partner/server/partner-outbox";

const invalidation = {
    id: "message-1",
    kind: "records_invalidation" as const,
    payload: { sub: "nl_sub", service: "nostalgia" },
};

describe("sendToMusecat", () => {
    afterEach(() => {
        env.serverEnv = {};
        vi.unstubAllGlobals();
    });

    it("파트너 주소 · 키가 없으면 보낸 것으로 치지 않고 미룬다", async () => {
        const fetch = vi.fn();
        vi.stubGlobal("fetch", fetch);
        for (const mode of [undefined, "mock", "live"]) {
            env.serverEnv = { MUSECAT_MODE: mode };
            expect(await sendToMusecat(invalidation)).toEqual({
                kind: "unsupported",
                error: "musecat_not_configured",
            });
        }
        expect(fetch).not.toHaveBeenCalled();
    });

    it("설정이 있으면 화면 모드와 상관없이 보내고 2xx 일 때만 보냄으로 남긴다", async () => {
        env.serverEnv = {
            MUSECAT_API_ORIGIN: "https://api.musecat.example",
            MUSECAT_PARTNER_KEY: "partner-key",
        };
        vi.stubGlobal(
            "fetch",
            vi
                .fn()
                .mockResolvedValueOnce(new Response(null, { status: 204 }))
                .mockResolvedValueOnce(new Response(null, { status: 503 }))
        );
        expect(await sendToMusecat(invalidation)).toEqual({
            kind: "delivered",
            status: 204,
        });
        expect(await sendToMusecat(invalidation)).toEqual({
            kind: "retry",
            status: 503,
            error: "http_503",
        });
    });
});
