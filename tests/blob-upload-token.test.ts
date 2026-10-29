import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    generateClientTokenFromReadWriteToken: vi.fn(async () => "client-token"),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({
    serverEnv: { PRIVATE_BLOB_READ_WRITE_TOKEN: "private-token" },
}));
vi.mock("@vercel/blob/client", () => ({
    generateClientTokenFromReadWriteToken:
        mocks.generateClientTokenFromReadWriteToken,
}));

import {
    createImageUploadToken,
    createPrivateImageUploadToken,
} from "@/lib/blob";

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

// 클라이언트 토큰은 만료(30초) 전까지 여러 번 쓸 수 있어, 경로를 서버가 정하고 덮어쓰기를 막아 한 번만 올라가게 한다
describe("이미지 업로드 토큰", () => {
    it.each([
        ["공개", createImageUploadToken],
        ["비공개", createPrivateImageUploadToken],
    ] as const)(
        "%s 토큰은 발급마다 다른 경로 하나에만 쓴다",
        async (_, create) => {
            const first = await create("avatars/2/profile", "image/webp");
            const second = await create("avatars/2/profile", "image/webp");

            expect(first?.pathname).toMatch(
                new RegExp(`^avatars/2/profile-${UUID}\\.webp$`)
            );
            expect(second?.pathname).not.toBe(first?.pathname);
            for (const [options] of mocks.generateClientTokenFromReadWriteToken
                .mock.calls as unknown as [Record<string, unknown>][]) {
                expect(options).toMatchObject({
                    addRandomSuffix: false,
                    allowedContentTypes: ["image/webp"],
                });
                expect(options.allowOverwrite).toBeUndefined();
            }
        }
    );
});
