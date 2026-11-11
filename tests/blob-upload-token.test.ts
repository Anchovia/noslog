import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    generateClientTokenFromReadWriteToken: vi.fn(async () => "client-token"),
    head: vi.fn(),
    get: vi.fn(),
}));

vi.mock("@vercel/blob", () => ({
    head: mocks.head,
    get: mocks.get,
    del: vi.fn(),
}));

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
    isValidImageBlob,
    isValidPrivateImageBlob,
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

// 올릴 때의 Content-Type 은 보내는 쪽이 정한다 — 저장 전에 파일 머리가 그 형식인지 본다
describe("저장 전 이미지 확인", () => {
    const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13];
    const stored = (bytes: number[], contentType = "image/png") => {
        mocks.head.mockResolvedValue({
            pathname: "avatars/2/profile-a.png",
            contentType,
            size: 100,
        });
        mocks.get.mockResolvedValue({
            stream: new Blob([new Uint8Array(bytes)]).stream(),
        });
    };

    it.each([
        ["공개", isValidImageBlob, "public"],
        ["비공개", isValidPrivateImageBlob, "private"],
    ] as const)(
        "%s 파일은 머리가 선언한 형식일 때만 받는다",
        async (_, isValid, access) => {
            const url = `https://store.${access}.blob.vercel-storage.com/avatars/2/profile-a.png`;

            stored(PNG);
            expect(await isValid(url, "avatars/2/profile")).toBe(true);

            stored([...new TextEncoder().encode("<html><script>")]);
            expect(await isValid(url, "avatars/2/profile")).toBe(false);

            stored(PNG, "image/jpeg");
            expect(await isValid(url, "avatars/2/profile")).toBe(false);
        }
    );
});
